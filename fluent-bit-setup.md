# Fluent Bit Setup Notes

> **October 29, 2026 release check**: [Fluent Bit v5.1.5](https://github.com/fluent/fluent-bit/releases/tag/v5.1.5). Select a compatible Helm chart and verify its `appVersion`, parser configuration, and output plugins before upgrading.

Fluent Bit is a lightweight telemetry agent commonly deployed as a DaemonSet to tail container logs, enrich them with Kubernetes metadata, and forward them to a backend. It is not a log database; pair it with Loki or another log store.

## Prerequisites and installation

Use a disposable cluster with Linux nodes, Helm, and permission to deploy host log mounts and metadata RBAC. Managed/serverless environments may forbid these mounts or use different log paths. The lab assumes standard CRI logs under `/var/log/containers` and `/var/log/pods`.

```bash
helm repo add fluent https://fluent.github.io/helm-charts
helm repo update
helm search repo fluent/fluent-bit --versions
export CHART_VERSION='<selected-chart-version>'
helm show values fluent/fluent-bit --version "$CHART_VERSION"
```

## Lab

Write temporary chart values. The stdout output makes ingestion observable without a separate backend. Exclude the agent namespace to avoid reading the output back into itself.

```bash
cat > /tmp/fluent-study-values.yaml <<'EOF'
kind: DaemonSet
config:
  inputs: |
    [INPUT]
        Name tail
        Path /var/log/containers/*.log
        Exclude_Path /var/log/containers/*_fluent-study_*.log
        multiline.parser docker, cri
        Tag kube.*
        Mem_Buf_Limit 5MB
        Skip_Long_Lines On
        Read_from_Head On
  filters: |
    [FILTER]
        Name kubernetes
        Match kube.*
        Kube_Tag_Prefix kube.var.log.containers.
        Merge_Log On
        Keep_Log Off
  outputs: |
    [OUTPUT]
        Name stdout
        Match kube.*
EOF
helm install fluent-bit fluent/fluent-bit --version "$CHART_VERSION" \
  -n fluent-study --create-namespace -f /tmp/fluent-study-values.yaml \
  --wait --timeout 5m
kubectl create namespace log-study
kubectl run log-generator -n log-study --image=busybox:1.37 --restart=Never \
  -- /bin/sh -c 'while true; do echo "hello-fluent-study"; sleep 5; done'
kubectl logs -n fluent-study -l app.kubernetes.io/instance=fluent-bit \
  --all-containers=true --tail=100
```

Expect `hello-fluent-study` plus Kubernetes namespace/pod metadata in the agent output. If ingestion is delayed, rerun the logs command. Each DaemonSet pod sees only its node's files, so query all agent pods rather than an arbitrary one.

## Send to Loki

After completing the [Loki lab](loki-setup.md), replace the stdout output in the values file with this output and run `helm upgrade fluent-bit fluent/fluent-bit` using the same namespace, chart version, and values file:

```text
[OUTPUT]
    Name loki
    Match kube.*
    Host loki-gateway.loki-study.svc.cluster.local
    Port 80
    Labels job=fluent-bit
    Line_Format json
```

The host assumes Loki's release name `loki` and namespace `loki-study`. Query `{job="fluent-bit"} |= "hello-fluent-study"` in Grafana Explore. Production needs TLS/authentication, retry/backpressure planning, persistent buffering where required, and low-cardinality labels. Do not label every log line with request IDs or other unbounded values.

## Troubleshooting and cleanup

Missing files indicate host mount or runtime path issues. Missing metadata suggests RBAC or API server connectivity problems. Output retries indicate backend DNS, endpoint, or authentication failures; memory-only buffering can lose logs during restarts.

```bash
kubectl delete namespace log-study
helm uninstall fluent-bit -n fluent-study
kubectl delete namespace fluent-study
```

## References

- [Kubernetes installation](https://docs.fluentbit.io/manual/installation/kubernetes)
- [Loki output plugin](https://docs.fluentbit.io/manual/pipeline/outputs/loki)
- [Fluent Bit Helm charts](https://github.com/fluent/helm-charts)