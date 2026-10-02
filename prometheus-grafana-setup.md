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
helm install prometheus prometheus-community/kube-prometheus-stack --namespace monitoring --create-namespace --version 91.8.2
```

## Example Installation Details
- **Chart Version**: 91.8.2 (stable snapshot checked October 1, 2026)
- **Release Name**: prometheus
- **Namespace**: monitoring
- **Status**: verify in your cluster using the commands below

> **October 2026 update**: [chart 91.8.2](https://github.com/prometheus-community/helm-charts/releases/tag/kube-prometheus-stack-91.8.2) replaces the July 87.21.0 pin. Review the [chart upgrade notes](https://github.com/prometheus-community/helm-charts/blob/kube-prometheus-stack-91.8.2/charts/kube-prometheus-stack/README.md) before upgrading across major chart versions.

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