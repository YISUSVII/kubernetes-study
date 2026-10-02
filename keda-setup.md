# KEDA (Kubernetes Event-Driven Autoscaling) Setup Notes

## Prerequisites
```bash
# Add KEDA Helm repository
helm repo add kedacore https://kedacore.github.io/charts

# Update Helm repositories
helm repo update
```

## Installation

### Create KEDA namespace
```bash
kubectl create namespace keda
```

### Install KEDA using Helm
```bash
helm install keda kedacore/keda --namespace keda --version 2.21.0
```

> **October 2026 update**: [KEDA v2.21.0](https://github.com/kedacore/keda/releases/tag/v2.21.0) fixes critical CVE-2026-77524 and changes token-audience enforcement, Temporal scaler metadata, and Azure Pipelines queue counting. Review the [2.21 migration guide](https://keda.sh/docs/2.21/migration/) before upgrading. KEDA v2.20 moved event recording to the `events.k8s.io` API group. If you use custom/restricted RBAC (not the bundled manifests/Helm chart), grant `create`/`patch` on `events.k8s.io/events` before upgrading. See [DEPRECATIONS.md](DEPRECATIONS.md).

## Verify Installation
```bash
# Check KEDA pods
kubectl get pods -n keda

# Check KEDA CRDs
kubectl get crds | grep keda
```

## Common Use Cases

### 1. Auto-scale based on CPU
```bash
kubectl apply -f - <<EOF
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: cpu-scaler
spec:
  scaleTargetRef:
    name: myapp
  minReplicaCount: 1
  maxReplicaCount: 10
  triggers:
  - type: cpu
    metadata:
      type: Utilization
      value: "60"
EOF
```

### 2. Auto-scale based on memory
```bash
kubectl apply -f - <<EOF
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: memory-scaler
spec:
  scaleTargetRef:
    name: myapp
  minReplicaCount: 1
  maxReplicaCount: 10
  triggers:
  - type: memory
    metadata:
      type: Utilization
      value: "70"
EOF
```

### 3. Auto-scale based on HTTP requests
```bash
kubectl apply -f - <<EOF
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: http-scaler
spec:
  scaleTargetRef:
    name: myapp
  minReplicaCount: 2
  maxReplicaCount: 20
  triggers:
  - type: prometheus
    metadata:
      serverAddress: http://prometheus:9090
      query: rate(http_requests_total[1m])
      threshold: "100"
EOF
```

### 4. Auto-scale based on Kafka messages
```bash
kubectl apply -f - <<EOF
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: kafka-scaler
spec:
  scaleTargetRef:
    name: kafka-consumer
  minReplicaCount: 1
  maxReplicaCount: 30
  triggers:
  - type: kafka
    metadata:
      bootstrapServers: kafka-broker:9092
      consumerGroup: mygroup
      topic: mytopic
      lagThreshold: "10"
EOF
```

## Useful Commands
```bash
# Check ScaledObjects
kubectl get scaledobjects

# Check ScaledObject details
kubectl describe scaledobject <name>

# Check HPA status (KEDA creates HPAs)
kubectl get hpa

# Check KEDA operator logs
kubectl logs -n keda -l app=keda-operator -f

# Uninstall KEDA
helm uninstall keda -n keda
```

## Supported Scalers
- CPU & Memory
- Prometheus
- Azure Queue, Azure Blob, Azure Event Hubs
- AWS SQS, Kinesis
- Google Cloud Pub/Sub
- Kafka
- RabbitMQ
- Redis
- PostgreSQL
- MySQL
- And many more...

## Best Practices
1. Set appropriate `minReplicaCount` to avoid cold starts
2. Use `pollingInterval` to control how often KEDA checks metrics
3. Combine multiple triggers for complex scaling logic
4. Monitor KEDA performance with Prometheus metrics
5. Test scaling behavior in non-production environments first

## Resources
- **Official Documentation**: https://keda.sh/
- **Scalers List**: https://keda.sh/docs/scalers/
- **GitHub Repository**: https://github.com/kedacore/keda

## Notes
- KEDA creates HorizontalPodAutoscalers (HPAs) internally
- Requires metrics-server for CPU/memory-based scaling
- Works well with Prometheus for custom metrics
- Supports event-driven and metric-driven scaling
