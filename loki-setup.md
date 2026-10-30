# Loki Setup Notes

> **October 29, 2026 release check**: Loki application [v3.7.9](https://github.com/grafana/loki/releases/tag/v3.7.9); community Helm chart [20.0.3](https://github.com/grafana-community/helm-charts/releases/tag/loki-20.0.3). These are separate version streams. Chart 20 removes bundled MinIO and its values; migrate object storage while still on 19.x, then remove `minio` and `ignoreMinioDeprecation` keys before upgrading. Unknown top-level values now fail schema validation. Simple Scalable mode is being deprecated; this lab uses Monolithic mode. See the [tagged chart migration notes](https://github.com/grafana-community/helm-charts/blob/loki-20.0.3/charts/loki/README.md).

Loki stores and queries logs using labels and LogQL. Grafana provides the interface, while Fluent Bit or another agent ships logs. Loki indexes labels rather than the full contents of every log line; choose bounded labels such as environment and workload.

## Prerequisites and installation

Use a disposable cluster, Helm, kubectl, curl, and Bash. The [official installation guide](https://grafana.com/docs/loki/latest/setup/install/helm/install-monolithic/) now points to the Grafana community chart. The community chart renamed `SingleBinary` deployment mode to `Monolithic`; inspect the selected chart's values and upgrade notes rather than reusing old blog configurations. This lab uses disposable filesystem storage, not the deprecated bundled MinIO subchart.

```bash
helm repo add grafana-community https://grafana-community.github.io/helm-charts
helm repo update
helm search repo grafana-community/loki --versions
export CHART_VERSION=20.0.3
helm show chart grafana-community/loki --version "$CHART_VERSION"
helm show values grafana-community/loki --version "$CHART_VERSION"
```

## Lab

These values target the community chart's monolithic configuration. Validate them against the exact chart you select. Persistence and authentication are deliberately disabled for this isolated lab; never expose it publicly.

```bash
cat > /tmp/loki-study-values.yaml <<'EOF'
deploymentMode: Monolithic
loki:
  auth_enabled: false
  commonConfig:
    replication_factor: 1
  storage:
    type: filesystem
  schemaConfig:
    configs:
      - from: "2024-04-01"
        store: tsdb
        object_store: filesystem
        schema: v13
        index:
          prefix: loki_index_
          period: 24h
singleBinary:
  replicas: 1
  persistence:
    enabled: false
backend:
  replicas: 0
read:
  replicas: 0
write:
  replicas: 0
ingester:
  replicas: 0
querier:
  replicas: 0
queryFrontend:
  replicas: 0
queryScheduler:
  replicas: 0
distributor:
  replicas: 0
compactor:
  replicas: 0
indexGateway:
  replicas: 0
bloomPlanner:
  replicas: 0
bloomBuilder:
  replicas: 0
bloomGateway:
  replicas: 0
chunksCache:
  enabled: false
resultsCache:
  enabled: false
EOF
helm template loki grafana-community/loki --version "$CHART_VERSION" \
  -n loki-study -f /tmp/loki-study-values.yaml > /tmp/loki-study-rendered.yaml
helm install loki grafana-community/loki --version "$CHART_VERSION" \
  -n loki-study --create-namespace -f /tmp/loki-study-values.yaml \
  --wait --timeout 10m
kubectl get pods,services -n loki-study
kubectl port-forward -n loki-study svc/loki-gateway 3100:80
```

In another Bash terminal, push a log with a current nanosecond timestamp and query it. `date +%s` is supported in WSL/Linux; the nine appended zeros convert seconds to nanoseconds.

```bash
STAMP="$(date +%s)000000000"
curl -f -H 'Content-Type: application/json' http://localhost:3100/loki/api/v1/push \
  -d "{\"streams\":[{\"stream\":{\"job\":\"study\"},\"values\":[[\"${STAMP}\",\"hello-loki-study\"]]}]}"
curl -f -G http://localhost:3100/loki/api/v1/query_range \
  --data-urlencode 'query={job="study"}' --data-urlencode 'limit=10'
```

Expect HTTP 204 for a successful push and the message in the query response. In the [existing Grafana deployment](prometheus-grafana-setup.md), add a Loki data source with URL `http://loki-gateway.loki-study.svc.cluster.local`. Query `{job="study"}` in Explore. Continue with the [Fluent Bit lab](fluent-bit-setup.md) for real container logs.

## Troubleshooting and cleanup

An empty query may reflect the time range, label mismatch, or ingestion rejection. Check Loki logs and gateway errors. Old timestamps can be rejected. A single replica needs replication factor one. Production requires supported object storage, retention configuration, access controls, capacity planning, and a tested durability strategy; this ephemeral filesystem lab provides none of those guarantees.

```bash
helm uninstall loki -n loki-study
kubectl delete namespace loki-study
```

All lab logs are disposable and may be lost on pod recreation even before cleanup. Exercise: explain which components must change to preserve logs through node loss.

## References

- [Loki Helm installation](https://grafana.com/docs/loki/latest/setup/install/helm/)
- [LogQL](https://grafana.com/docs/loki/latest/query/)
- [Loki HTTP API](https://grafana.com/docs/loki/latest/reference/loki-http-api/)