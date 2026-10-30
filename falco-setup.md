# Falco Setup Notes

> **October 29, 2026 release check**: [Falco 0.45.2](https://github.com/falcosecurity/falco/releases/tag/0.45.2). Helm chart, rules, plugins, and kernel drivers have separate versions; choose the chart and driver against the host kernel, not just the application release number.

Falco evaluates runtime events against rules and emits security alerts. It complements Trivy's static scans and Kyverno's admission checks. Falco detects behavior; it does not automatically block a process or enforce a network policy.

## Prerequisites and installation

Use a disposable Kubernetes cluster with supported Linux kernels and permission for privileged node-level monitoring. This is not a serverless or restricted Pod Security lab. Inspect the [driver requirements](https://falco.org/docs/concepts/event-sources/kernel/) before choosing modern eBPF or another driver; do not assume every Docker Desktop or managed cluster exposes the needed kernel capabilities.

The [official documentation](https://falco.org/docs/setup/kubernetes/) recommends the Operator for new deployments and still supports Helm. This guide uses the supported Helm path to keep the study lab small. Choose a compatible chart version; the chart version is not the Falco application version.

```bash
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm repo update
helm search repo falcosecurity/falco --versions
export CHART_VERSION='<selected-chart-version>'
helm show values falcosecurity/falco --version "$CHART_VERSION"
```

## Lab

Use a harmless marker-file rule rather than depending on a particular version of the default ruleset. It observes file creation inside a container and does not read host secrets.

```bash
cat > /tmp/falco-study-values.yaml <<'EOF'
driver:
  kind: modern_ebpf
customRules:
  study.yaml: |-
    - rule: Study marker file created
      desc: Detect creation of a disposable marker inside a container
      condition: container.id != host and evt.type in (open, openat, openat2, creat) and evt.is_open_write=true and fd.name=/tmp/falco-study-marker
      output: "Study marker created (container=%container.id process=%proc.name file=%fd.name)"
      priority: NOTICE
      tags: [study]
EOF
helm install falco falcosecurity/falco --version "$CHART_VERSION" \
  -n falco --create-namespace -f /tmp/falco-study-values.yaml \
  --wait --timeout 5m
kubectl get daemonsets,pods -n falco
kubectl create namespace falco-study
kubectl run marker -n falco-study --image=busybox:1.37 --restart=Never \
  -- /bin/sh -c 'touch /tmp/falco-study-marker; sleep 120'
kubectl logs -n falco -l app.kubernetes.io/name=falco -c falco --tail=100
```

Expect `Study marker created` in a Falco pod on the workload's node. If the event was missed during startup, wait for the DaemonSet to become ready and recreate the marker Pod. A Ready pod alone does not establish that events are being captured: verify the alert end to end.

## Troubleshooting and cleanup

Driver failures usually involve unsupported kernels, missing BTF/eBPF features, or privileges. Missing alerts can mean the workload ran on an unmonitored node, the rule failed to load, or events were dropped. Inspect Falco startup logs and dropped-event metrics before weakening rules. Exercise: narrow the rule to a chosen namespace when Kubernetes metadata is available and document the metadata enrichment dependency.

Forward alerts to a protected sink for production, tune exceptions carefully, and monitor event loss. Alert payloads can contain sensitive command-line arguments. Do not enable automatic disruptive responses based on an unreviewed study rule.

```bash
kubectl delete namespace falco-study
helm uninstall falco -n falco
kubectl delete namespace falco
```

Uninstall only this isolated lab's installation, not a shared monitoring agent.

## References

- [Falco Kubernetes setup](https://falco.org/docs/setup/kubernetes/)
- [Falco rule syntax](https://falco.org/docs/rules/basic-elements/)
- [Falco troubleshooting](https://falco.org/docs/troubleshooting/)