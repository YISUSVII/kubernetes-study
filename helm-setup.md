# Helm Setup Notes

> **October 29, 2026 release check**: [Helm v4.3.1](https://github.com/helm/helm/releases/tag/v4.3.1). Select charts compatible with Helm 4 and review major-version migration notes; chart versions are not Helm or application versions.

Helm packages Kubernetes resources into charts and manages installations as releases. Unlike Kustomize, Helm renders templates and tracks release history. ArgoCD can render Helm charts without creating Helm-managed releases.

## Prerequisites and installation

Use a disposable cluster, `kubectl`, and a Helm CLI supported by your chosen charts. Install Helm using the [official installation instructions](https://helm.sh/docs/intro/install/). These labs do not assert a latest release: select a supported chart version, inspect its Kubernetes requirements, and record the selected versions before installing.

```bash
helm version
kubectl cluster-info
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm search repo prometheus-community/prometheus --versions
```

## Lab

Set `CHART_VERSION` to a version from the search output. Chart versions and application versions are different; inspect both before proceeding. Commands use a Bash-compatible shell.

```bash
export CHART_VERSION='<selected-chart-version>'
helm show chart prometheus-community/prometheus --version "$CHART_VERSION"
helm show values prometheus-community/prometheus --version "$CHART_VERSION"
helm template study prometheus-community/prometheus \
  --namespace helm-study --version "$CHART_VERSION" > /tmp/helm-study.yaml
kubectl create namespace helm-study
kubectl apply --dry-run=server -f /tmp/helm-study.yaml
helm upgrade --install study prometheus-community/prometheus \
  --namespace helm-study --version "$CHART_VERSION" --wait --timeout 10m
helm list -n helm-study
kubectl get pods,pvc -n helm-study
```

The chart may need a default StorageClass and sufficient capacity. Server-side dry runs require APIs referenced by the chart to exist; they do not prove workloads will become healthy. This is a separate Prometheus lab, not a replacement for the [monitoring stack guide](prometheus-grafana-setup.md).

## Upgrade, inspect, and recover

```bash
helm get values study -n helm-study --all
helm get manifest study -n helm-study
helm history study -n helm-study
helm status study -n helm-study
```

For an upgrade, choose another compatible chart version, render and review the diff, then repeat `helm upgrade --install` with that version. Roll back using `helm rollback study <REVISION> -n helm-study --wait`. A rollback does not undo external database migrations or necessarily restore CRDs. Values can contain secrets: do not publish command output or commit credentials.

## Troubleshooting and cleanup

Pending PVCs usually indicate missing storage provisioning. For failed releases, inspect pod events and `helm status` before retrying. Helm does not automatically upgrade or remove all CRDs placed in a chart's `crds/` directory; follow the chart's upgrade instructions.

```bash
helm uninstall study -n helm-study
kubectl get pvc -n helm-study
kubectl delete namespace helm-study
```

Deleting the namespace removes remaining PVCs; underlying volume deletion depends on the reclaim policy. Exercise: render two versions and identify changes to RBAC, images, and persistent storage before an upgrade.

## References

- [Helm documentation](https://helm.sh/docs/)
- [Chart best practices](https://helm.sh/docs/chart_best_practices/)
- [ArgoCD Helm integration](argocd-setup.md)