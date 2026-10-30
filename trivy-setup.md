# Trivy Setup Notes

> **October 29, 2026 release check**: [Trivy v0.76.1](https://github.com/aquasecurity/trivy/releases/tag/v0.76.1) includes the compromised eMudhra CA distrust mitigation (CVE-2026-111943). Keep both the scanner and vulnerability database current; a database refresh alone does not patch the scanner binary.

Trivy scans container images, filesystems, and infrastructure configuration for known vulnerabilities and other security issues. It complements admission policies and runtime monitoring; a clean scan is not proof that an application is secure.

## Prerequisites and installation

Install the CLI through the [official installation guide](https://trivy.dev/latest/getting-started/installation/). Use a supported release and record `trivy --version`. The first scan downloads databases and needs registry/network access plus local cache space. The CLI lab does not require a cluster or Docker daemon when scanning a publicly accessible registry image.

## Lab

Run these commands from the repository root in Bash. The tagged image is illustrative; replace it with a reviewed digest for reproducible findings.

```bash
trivy --version
trivy image --scanners vuln --severity HIGH,CRITICAL nginx:stable-alpine
trivy config examples/
trivy image --scanners vuln --severity HIGH,CRITICAL \
  --format json --output /tmp/trivy-study.json nginx:stable-alpine
trivy image --scanners vuln --severity HIGH,CRITICAL \
  --exit-code 1 nginx:stable-alpine
```

The last command deliberately returns a nonzero exit code when selected findings exist, making it suitable as a CI gate. A scan that fails to download its database is a scan failure, not a clean result. The `config` command reports manifest misconfigurations; it does not install CRDs or validate controller-specific business semantics.

Review package name, installed/fixed versions, advisory source, and exploitability before prioritizing remediation. Upgrade the affected dependency or base image and rescan the resulting image. `--ignore-unfixed` can filter findings but does not remediate them. Record time-limited exceptions and their justification; never silently ignore a whole severity class.

## Optional continuous scanning

The [Trivy Operator](https://aquasecurity.github.io/trivy-operator/latest/) runs in-cluster scans and exposes reports as CRDs. Choose a compatible chart, inspect its values and scan-job permissions, then install it in a disposable cluster:

```bash
helm repo add aqua https://aquasecurity.github.io/helm-charts/
helm repo update
helm search repo aqua/trivy-operator --versions
export CHART_VERSION='<selected-chart-version>'
helm install trivy-operator aqua/trivy-operator --version "$CHART_VERSION" \
  -n trivy-system --create-namespace --wait --timeout 5m
kubectl get vulnerabilityreports -A
kubectl get jobs -n trivy-system
```

Reports appear after workloads are discovered and scan jobs finish. Review report access: package inventories and misconfiguration details may be sensitive. Limit watched namespaces and resource consumption for production. An operator report does not automatically block admission.

## Troubleshooting and cleanup

Registry rate limits, private registry authentication, and database download failures are common causes of missing results. Do not pass registry passwords as literal commands in shared shell history. Exercise: scan the same digest before and after a database refresh and explain why findings can change without an image change.

```bash
helm uninstall trivy-operator -n trivy-system
kubectl delete namespace trivy-system
```

Only run these cleanup commands if you installed the optional operator and no other workloads share the namespace. CLI-only scans create no Kubernetes resources; remove the local JSON report when no longer needed. Operator CRDs/reports may remain after uninstall; review them before removal.

## References

- [Trivy scanner documentation](https://trivy.dev/latest/docs/)
- [Trivy Operator documentation](https://aquasecurity.github.io/trivy-operator/latest/)