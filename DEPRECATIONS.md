# 2026 Update: Releases, Deprecations & Ecosystem News

> Checked against official project releases and upgrade documentation on **October 1, 2026**. Previous refresh: July 29, 2026. These are published release pins, not validation of a deployed cluster.

## Release changes since July

| Component | July pin | October snapshot | Official release |
|-----------|----------|------------------|------------------|
| Kubernetes | Study baseline 1.34/1.35 | Latest 1.37.1; study baseline 1.35/1.36 | [Upstream support](https://kubernetes.io/releases/) |
| ArgoCD | v3.4.5 | v3.5.3 | [Release](https://github.com/argoproj/argo-cd/releases/tag/v3.5.3) |
| Calico | v3.32.1 | v3.32.2 | [Release](https://github.com/projectcalico/calico/releases/tag/v3.32.2) |
| cert-manager | v1.21.0 | v1.21.2 | [Release](https://github.com/cert-manager/cert-manager/releases/tag/v1.21.2) |
| Cilium | v1.19.6 | v1.20.2 | [Release](https://github.com/cilium/cilium/releases/tag/v1.20.2) |
| Gateway API | v1.6.1 | v1.6.2 | [Release](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.6.2) |
| Istio | 1.30.3 | 1.31.1 | [Release](https://github.com/istio/istio/releases/tag/1.31.1) |
| KEDA | v2.20.1 | v2.21.0 | [Release](https://github.com/kedacore/keda/releases/tag/v2.21.0) |
| kube-prometheus-stack | Chart 87.21.0 | Chart 91.8.2 | [Release](https://github.com/prometheus-community/helm-charts/releases/tag/kube-prometheus-stack-91.8.2) |
| ingress-nginx | Retired | Still retired | [Archived repository](https://github.com/kubernetes/ingress-nginx) |

## Priority: KEDA 2.21 security and breaking changes

KEDA 2.21 fixes critical **CVE-2026-77524 / GHSA-637c-6jxx-4rwm**. The affected paths use Vault Kubernetes authentication or `boundServiceAccountToken` in TriggerAuthentication/ClusterTriggerAuthentication. Review these integrations before upgrading; API keys and ordinary Vault token authentication are outside those affected paths. [Release and advisory links](https://github.com/kedacore/keda/releases/tag/v2.21.0).

- **Token audiences:** Configure dedicated audiences and matching receiver validation. Tokens minted for named service accounts need exact namespace/name audience mappings. Avoid using the operator-wide insecure `legacy` mode as a permanent solution.
- **Temporal:** Removed `buildId`, `selectAllActive`, and `selectUnversioned`. For versioned workers, migrate to `workerDeploymentName` and `workerDeploymentBuildId`.
- **Azure Pipelines:** `scaleOnInFlight` defaults to `true`, counting unfinished assigned jobs. Review scaling behavior; `false` restores unassigned-only counting.

Follow the [2.20 → 2.21 migration guide](https://keda.sh/docs/2.21/migration/). The bundled examples do not configure these authentication paths or the Temporal/Azure Pipelines scalers, so this refresh changes their documented baseline without adding token configuration.

Earlier migration reminder: custom RBAC for KEDA 2.20+ must allow event recording through `events.k8s.io/events`. Review all intervening release notes when upgrading older installations.

## ArgoCD 3.5: Helm and deprecated signature configuration

ArgoCD 3.5 uses Helm 4. Plain HTTP OCI registries require explicit configuration, including dependency repositories. Existing `spec.source.helm.version: v3` no longer selects Helm 3. GnuPG signature configuration (`AppProject.spec.signatureKeys`) is deprecated in favor of `sourceIntegrity`. Impersonation now covers API server operations **when enabled**; it is not an assertion that every installation enables impersonation by default. Review the [3.4 → 3.5 upgrade guide](https://argo-cd.readthedocs.io/en/stable/operator-manual/upgrading/3.4-3.5/).

The [setup guide](argocd-setup.md) pins the application manifest to v3.5.3. Helm chart versions are independent of application versions; select a chart by its `appVersion` rather than retaining the previous `8.x` placeholder.

## cert-manager 1.21.2: security hardening and reliability

The September patch fixes renewal/HTTP-01 solver issues, webhook/controller panics, and duplicate Gateway listener DNS names. It limits untrusted issuer responses in status/events and tightens ambient AWS credential use for namespaced Vault Issuers. Upstream recommends upgrading. [Release notes](https://github.com/cert-manager/cert-manager/releases/tag/v1.21.2).

The July RBAC advisory remains relevant to older installations: [GHSA-8rvj-mm4h-c258](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-8rvj-mm4h-c258). Check the advisory's affected/fixed versions when assessing an existing cluster.

## Kubernetes and Istio support windows

Upstream Kubernetes currently maintains **1.35, 1.36, and 1.37**. The study prerequisites now use 1.35/1.36 and recommend matching kubectl's minor version to the cluster. [Kubernetes releases](https://kubernetes.io/releases/).

Istio supports **1.29, 1.30, and 1.31**; 1.28 is out of support. Istio 1.29's expected end of support is **October 12, 2026**. Istio 1.31 lists Kubernetes **1.32–1.36** as supported, so the latest Kubernetes release is not automatically supported by the whole stack. [Istio support matrix](https://istio.io/latest/docs/releases/supported-releases/).

Ecosystem news: Istio 1.31 adds weighted ambient waypoint canaries and enables stricter separation of cross-namespace Istio Gateways from managed Gateway API proxies by default. Review custom gateway sharing before upgrading. [1.31 change notes](https://istio.io/latest/news/releases/1.31.x/announcing-1.31/change-notes/).

## Networking and monitoring updates

- **Cilium 1.20 is stable**, replacing July's release-candidate notice. Patch 1.20.2 includes ENI/IPAM, network-policy, and Gateway API fixes. Follow the project's minor upgrade documentation before changing the CNI. [Release notes](https://github.com/cilium/cilium/releases/tag/v1.20.2).
- **Gateway API 1.6.2** clarifies that redirect codes 303, 307, and 308 require Extended conformance. Check the implementation's supported features. Standard and Experimental are alternative CRD channels; the setup guide no longer describes already-standard features as requiring Experimental. [Release notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.6.2).
- **Calico 3.32.2** is a patch update; no example API rewrites were made in this refresh. [Release](https://github.com/projectcalico/calico/releases/tag/v3.32.2).
- **kube-prometheus-stack 91.8.2** replaces chart 87.21.0. Major chart changes require reading the intervening upgrade sections and CRD handling instructions; a larger chart version is not evidence of a harmless upgrade. [Chart documentation](https://github.com/prometheus-community/helm-charts/blob/kube-prometheus-stack-91.8.2/charts/kube-prometheus-stack/README.md).

## ingress-nginx remains retired

The repository was archived on **March 24, 2026**. Keep [nginx-ingress-setup.md](nginx-ingress-setup.md) and its manifests for historical study; use a maintained [Gateway API implementation](https://gateway-api.sigs.k8s.io/implementations/) for new work. [Archive status](https://github.com/kubernetes/ingress-nginx).

The Gateway API guide previously listed ingress-nginx as a Gateway controller. It now distinguishes **NGINX Gateway Fabric**, a separate implementation. Existing GatewayClass examples use Cilium's `io.cilium/gateway-controller`, and BackendTLSPolicy examples use `gateway.networking.k8s.io/v1`.

## Rechecking this snapshot

Check each project's release and upgrade documentation again before deployment. For repositories containing multiple Helm charts, use the component-specific release tag rather than assuming `/releases/latest` identifies the desired chart. Review security advisories, Kubernetes support windows, and controller conformance separately from release numbers.
