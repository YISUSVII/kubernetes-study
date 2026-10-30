# OpenTelemetry Setup Notes

> **October 29, 2026 release check**: [Collector distributions v0.164.0](https://github.com/open-telemetry/opentelemetry-collector-releases/releases/tag/v0.164.0) include Go crypto/x509 security fixes. Collector, SDK, Operator, and Helm chart versions are separate; inspect the selected distribution's available components before upgrading.

OpenTelemetry (OTel in the image) provides APIs, SDKs, protocols, and a Collector for traces, metrics, and logs. A Collector receives, processes, and exports telemetry; it is not a long-term storage backend or dashboard. Application instrumentation is separate from installing a Collector.

## Prerequisites and installation

Use a disposable cluster, Helm, kubectl, curl, and Bash. Check the [Collector chart documentation](https://opentelemetry.io/docs/platforms/kubernetes/helm/collector/) and select a compatible chart version. Collector distributions contain different components; choose an image that contains every receiver, processor, and exporter in your configuration.

```bash
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm repo update
helm search repo open-telemetry/opentelemetry-collector --versions
export CHART_VERSION='<selected-chart-version>'
```

## Lab

This lab accepts OTLP/HTTP logs and sends them to the debug exporter. It intentionally does not collect host files or install the Operator. Create temporary chart values:

```bash
cat > /tmp/otel-study-values.yaml <<'EOF'
mode: deployment
replicaCount: 1
image:
  repository: otel/opentelemetry-collector-k8s
config:
  receivers:
    jaeger: null
    zipkin: null
    prometheus: null
  exporters:
    debug:
      verbosity: detailed
  service:
    pipelines:
      traces: null
      metrics: null
      logs:
        receivers: [otlp]
        processors: [memory_limiter, batch]
        exporters: [debug]
ports:
  jaeger-compact:
    enabled: false
  jaeger-thrift:
    enabled: false
  jaeger-grpc:
    enabled: false
  zipkin:
    enabled: false
EOF
helm install otel open-telemetry/opentelemetry-collector \
  --version "$CHART_VERSION" -n otel-study --create-namespace \
  -f /tmp/otel-study-values.yaml --wait --timeout 5m
kubectl get pods,services -n otel-study
kubectl port-forward -n otel-study svc/otel-opentelemetry-collector 4318:4318
```

In another terminal, send a synthetic log and inspect the Collector output:

```bash
curl -f -H 'Content-Type: application/json' http://localhost:4318/v1/logs \
  -d '{"resourceLogs":[{"resource":{"attributes":[{"key":"service.name","value":{"stringValue":"study-client"}}]},"scopeLogs":[{"logRecords":[{"severityText":"INFO","body":{"stringValue":"hello-otel-study"}}]}]}]}'
kubectl logs -n otel-study -l app.kubernetes.io/instance=otel --tail=100
```

Expect an OTLP success response with no rejected log records and `hello-otel-study` in the logs after batch export. HTTP 200 alone is insufficient if `partialSuccess` reports rejections. Exercise: add a redaction processor before exporting and verify sensitive attributes no longer appear.

## Troubleshooting and cleanup

Check OTLP protocol and ports: gRPC uses 4317, HTTP uses 4318 and `/v1/logs`, `/v1/metrics`, or `/v1/traces`. An enabled receiver must also belong to a service pipeline. For unsupported component errors, inspect the Collector distribution and chart-generated ConfigMap.

Never expose unauthenticated OTLP endpoints publicly. Debug exports can reveal private payloads. Do not combine container-log collection with exporting those same logs back to stdout without excluding Collector logs; this can create an ingestion loop. Production requires TLS/authentication, bounded queues, resource limits, and a real telemetry backend.

```bash
helm uninstall otel -n otel-study
kubectl delete namespace otel-study
```

## References

- [Collector configuration](https://opentelemetry.io/docs/collector/configuration/)
- [Kubernetes instrumentation](https://opentelemetry.io/docs/platforms/kubernetes/)
- [Metrics and dashboards](prometheus-grafana-setup.md)