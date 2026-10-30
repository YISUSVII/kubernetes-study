# Flux Setup Notes

> **October 29, 2026 release check**: [Flux v2.10.0](https://github.com/fluxcd/flux2/releases/tag/v2.10.0). Notification `Alert` and `Provider` APIs graduate to `v1`. Conversion drops deprecated `Alert.spec.summary` and `Provider.spec.interval`; use `eventMetadata.summary`, `proxySecretRef`, and `certSecretRef` as appropriate and review Azure Event Hub authentication changes. The source/Kustomization lab below does not create notification resources.

Flux continuously reconciles Kubernetes resources from Git or other sources. Its source-controller fetches artifacts, kustomize-controller applies manifests, and helm-controller manages Helm releases. Flux and ArgoCD are alternatives for the same reconciliation boundary: do not let both own the same resources.

## Prerequisites and installation

Use a disposable cluster with cluster-admin access and install the [Flux CLI](https://fluxcd.io/flux/installation/). Check its supported Kubernetes versions before using the repository's study baseline. The lab installs controllers without requiring a writable Git repository or a personal access token. Commands use Bash.

```bash
flux version --client
flux check --pre
flux install
flux check
```

For repeatable installations, select a supported release and use `flux install --version=v2.10.0`; record the CLI and controller versions. Version 2.10 requires Kubernetes 1.35.2+, 1.36.1+, or 1.37.0+ on those respective minors. When upgrading, object-level identity is always enabled: add explicit controller RBAC for `serviceaccounts/token` where needed, and expect an initial ImageRepository rescan when adopting Flux artifact storage. For production, use the [bootstrap workflow](https://fluxcd.io/flux/installation/bootstrap/) and keep credentials outside Git. Bootstrap provisions controllers and commits their configuration to a repository.

## Lab

This uses Flux's public example repository. Review it before applying and replace `master` with a reviewed commit using `--tag` or `--commit` as appropriate when you need immutable source selection.

```bash
kubectl create namespace flux-study
flux create source git podinfo \
  --namespace flux-study \
  --url=https://github.com/stefanprodan/podinfo \
  --branch=master --interval=1m
flux create kustomization podinfo \
  --namespace flux-study \
  --source=GitRepository/podinfo \
  --path=./kustomize --target-namespace=flux-study \
  --prune=true --interval=1m --wait=true
flux reconcile source git podinfo -n flux-study
flux reconcile kustomization podinfo -n flux-study --with-source
flux get all -n flux-study
kubectl get pods,services -n flux-study
```

Expect the GitRepository artifact to have a revision and the Kustomization to report Ready. Here `Kustomization` is a Flux CRD, not the local `kustomization.yaml` used by the Kustomize CLI. The example does not need public inbound access. Inspect the Service and use `kubectl port-forward -n flux-study svc/podinfo 9898:9898`, then visit `http://localhost:9898`.

## Troubleshooting and cleanup

```bash
kubectl describe gitrepository podinfo -n flux-study
kubectl describe kustomization podinfo -n flux-study
flux logs --level=error --all-namespaces
```

Fetch failures usually involve credentials, DNS, or branch names. Apply failures usually involve missing APIs, RBAC, or an incorrect source path. Exercise: in your own repository, change replica count, reconcile, and compare drift correction with `flux suspend kustomization podinfo -n flux-study` followed by `flux resume`.

```bash
flux delete kustomization podinfo -n flux-study --silent
flux delete source git podinfo -n flux-study --silent
kubectl delete namespace flux-study
```

Confirm reconciled workloads are removed before uninstalling controllers. On this disposable cluster only, run `flux uninstall --silent` if no other Flux tenants remain; this removes Flux's shared installation.

## References

- [Flux getting started](https://fluxcd.io/flux/get-started/)
- [Flux Kustomizations](https://fluxcd.io/flux/components/kustomize/kustomizations/)
- [Kustomize foundations](kustomize-setup.md)