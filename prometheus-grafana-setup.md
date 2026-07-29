# Prometheus & Grafana Setup Notes

## Prerequisites
```bash
# Add Prometheus community Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts

# Update Helm repositories
helm repo update
```

## Installation Command
```bash
helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace --version 87.21.0
```

## Installation Details
- **Chart Version**: 87.21.0 (current stable, mid-2026; was 79.9.0)
- **Release Name**: prometheus
- **Namespace**: monitoring
- **Status**: deployed
- **Deployment Date**: Sun Nov 30 16:03:00 2025

> **2026 update**: the standalone `prometheus-operator/kube-prometheus` jsonnet project is now at v0.18.0. See [DEPRECATIONS.md](DEPRECATIONS.md).

## Post-Installation Commands

### Check Installation Status
```bash
kubectl --namespace monitoring get pods -l "release=prometheus"
```

### Get Grafana Admin Password
Two methods available:

**Method 1:**
```bash
kubectl --namespace monitoring get secrets prometheus-grafana -o jsonpath="{.data.admin-password}" | base64 -d ; echo
```

**Method 2:**
```bash
kubectl get secret --namespace monitoring -l app.kubernetes.io/component=admin-secret -o jsonpath="{.items[0].data.admin-password}" | base64 --decode ; echo
```

**Current Admin Password**: `gILP1wJ0jsWaonYKV4n3ghQflQlp86RzKN74tZdp`

### Access Grafana Locally
```bash
# Export pod name
export POD_NAME=$(kubectl --namespace monitoring get pod -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=prometheus" -oname)

# Start port forwarding
kubectl --namespace monitoring port-forward $POD_NAME 3000
```

**Access URL**: http://localhost:3000
- **Username**: admin
- **Password**: gILP1wJ0jsWaonYKV4n3ghQflQlp86RzKN74tZdp

## Additional Resources
- **Prometheus Operator Documentation**: https://github.com/prometheus-operator/kube-prometheus
- Use the above link for instructions on creating & configuring Alertmanager and Prometheus instances using the Operator

## Notes
- Port forwarding runs on `127.0.0.1:3000` and `[::1]:3000`
- Use `Ctrl+C` to stop port forwarding
- The setup includes the complete kube-prometheus-stack with Grafana, Prometheus, and Alertmanager

## Troubleshooting
- If pods are not running, check status with the status command above
- Ensure the monitoring namespace exists and is active
- Verify Helm chart repository is added: `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`