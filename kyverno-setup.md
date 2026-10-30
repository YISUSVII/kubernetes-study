# Kyverno Setup Notes

> **October 29, 2026 release check**: [Kyverno v1.19.2](https://github.com/kyverno/kyverno/releases/tag/v1.19.2) addresses 24 security advisories, including critical and high-severity issues. Select a chart whose `appVersion` includes these fixes; do not confuse the chart's version with 1.19.2.

Kyverno evaluates admission policies and produces policy reports. It can validate, mutate, generate, and verify resources. Policy admission is different from network enforcement, vulnerability scanning, and runtime detection: use Calico/Cilium, Trivy, and Falco for those layers.

## Prerequisites and installation

Use a disposable cluster with CRD/webhook permissions and Helm. Check the [supported releases](https://kyverno.io/docs/installation/releases/) against your Kubernetes version. Choose a chart version from the search output and set `CHART_VERSION` in Bash.

```bash
helm repo add kyverno https://kyverno.github.io/kyverno/
helm repo update
helm search repo kyverno/kyverno --versions
export CHART_VERSION='<selected-chart-version>'
helm show chart kyverno/kyverno --version "$CHART_VERSION"
helm install kyverno kyverno/kyverno --version "$CHART_VERSION" \
  -n kyverno --create-namespace --wait --timeout 5m
kubectl get deployments -n kyverno
```

This uses the supported Helm installation path; production needs controller availability, webhook recovery planning, and careful namespace exclusions.

## Lab

The following legacy `ClusterPolicy` API is useful for studying existing policies. Check the selected release's API/deprecation documentation before adoption; newer CEL-based policy types have different schemas. This rule affects only one lab namespace and starts in Audit mode.

```bash
kubectl create namespace kyverno-study
kubectl apply -f - <<'EOF'
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: study-require-owner
spec:
  background: true
  rules:
    - name: require-owner
      match:
        any:
          - resources:
              kinds: [Pod]
              namespaces: [kyverno-study]
      validate:
        failureAction: Audit
        message: Pods must have an owner label.
        pattern:
          metadata:
            labels:
              owner: "?*"
EOF
kubectl run unlabelled -n kyverno-study --image=nginx:stable-alpine
kubectl get policyreports -n kyverno-study
```

Allow time for background reports. The Pod is allowed in Audit mode but should produce a failed policy result. Inspect the report with `kubectl get policyreports -n kyverno-study -o yaml`. Then enable enforcement and test admission without creating another workload:

```bash
kubectl patch clusterpolicy study-require-owner --type=json \
  -p='[{"op":"replace","path":"/spec/rules/0/validate/failureAction","value":"Enforce"}]'
kubectl run denied -n kyverno-study --image=nginx:stable-alpine --dry-run=server
kubectl run allowed -n kyverno-study --image=nginx:stable-alpine --labels=owner=study --dry-run=server
```

Expect the first request to be denied and the second accepted. Enforcement does not evict the existing unlabelled Pod. Pin images by digest in a production policy exercise.

## Troubleshooting and cleanup

If policies are not applied, inspect match rules, namespace exclusions, and admission-controller logs. API server connectivity to webhooks is essential: a fail-closed webhook outage can block resource creation. Do not apply cluster-wide enforcement until Audit results and recovery procedures have been reviewed.

```bash
kubectl delete clusterpolicy study-require-owner
kubectl delete namespace kyverno-study
helm uninstall kyverno -n kyverno
```

Remove policies before controllers; uninstall the shared controller only in the isolated lab.

## References

- [Kyverno installation](https://kyverno.io/docs/installation/)
- [Policy types](https://kyverno.io/docs/policy-types/overview/)
- [Policy reports](https://kyverno.io/docs/guides/reports/)