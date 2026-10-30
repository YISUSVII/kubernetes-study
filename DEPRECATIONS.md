# 2026 Update: Releases, Deprecations & Ecosystem News

> Checked against official project releases and upgrade documentation on **October 29, 2026**. Previous page refresh: October 1, 2026. These are published release references, not validation of a deployed cluster.

## Release changes since October 1

| Component | October 1 snapshot | October 29 snapshot | Official release |
|-----------|----------|------------------|------------------|
| Kubernetes | 1.37.1 | 1.37.2; study baseline remains 1.35/1.36 | [Release](https://github.com/kubernetes/kubernetes/releases/tag/v1.37.2) |
| ArgoCD | v3.5.3 | v3.5.6 | [Release](https://github.com/argoproj/argo-cd/releases/tag/v3.5.6) |
| Calico | v3.32.2 | v3.33.0 | [Release](https://github.com/projectcalico/calico/releases/tag/v3.33.0) |
| cert-manager | v1.21.2 | v1.21.3 | [Release](https://github.com/cert-manager/cert-manager/releases/tag/v1.21.3) |
| Cilium | v1.20.2 | v1.20.4 | [Release](https://github.com/cilium/cilium/releases/tag/v1.20.4) |
| Gateway API | v1.6.2 | v1.7.0 upstream; v1.6.3 Cilium lab | [Release](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.7.0) |
| Istio | 1.31.1 | 1.31.3 | [Release](https://github.com/istio/istio/releases/tag/1.31.3) |
| KEDA | v2.21.0 | v2.21.0 (unchanged) | [Release](https://github.com/kedacore/keda/releases/tag/v2.21.0) |
| Crossplane | v2.4.2 | v2.4.3 | [Release](https://github.com/crossplane/crossplane/releases/tag/v2.4.3) |
| Karmada | v1.19.0 | v1.19.0 (unchanged) | [Release](https://github.com/karmada-io/karmada/releases/tag/v1.19.0) |
| kube-prometheus-stack | Chart 91.8.2 | Chart 92.16.0 | [Release](https://github.com/prometheus-community/helm-charts/releases/tag/kube-prometheus-stack-92.16.0) |
| ingress-nginx | Retired | Still retired | [Archived repository](https://github.com/kubernetes/ingress-nginx) |

The [complete release snapshot](README.md#release-snapshot--october-29-2026) also records all 16 newly covered ecosystem technologies. Their versions are newly verified references, not invented October 1 baselines.

## Priority: October security patches

- **ArgoCD 3.5.4 and later:** critical fixes cover Kustomize command execution, Jsonnet file access, and AppProject hook restrictions, plus login throttling, SSH proxy handling, extension RBAC, and oversized OCI manifests. The lab now pins 3.5.6. Kustomize Helm rendering no longer honors `helmGlobals.configHome`; OCI manifests above 4 MiB are rejected. [Stable security release](https://github.com/argoproj/argo-cd/releases/tag/v3.5.4). Version 3.6 release candidates are not stable pins.
- **Compromised eMudhra CAs:** patched releases include cert-manager 1.21.3, Cilium 1.20.4, Crossplane 2.4.3, Istio 1.31.3, Trivy 0.76.1, and CoreDNS 1.15.0. Review each release's trust-store changes and your certificate chains; changing only a chart version or vulnerability database does not guarantee a patched binary. [cert-manager notes](https://github.com/cert-manager/cert-manager/releases/tag/v1.21.3), [Cilium notes](https://github.com/cilium/cilium/releases/tag/v1.20.4), [Crossplane notes](https://github.com/crossplane/crossplane/releases/tag/v2.4.3).
- **Istio:** security notices [2026-007 and 2026-008](https://istio.io/latest/news/security/) cover Envoy issues, authorization-policy method-case bypass, ambient control-plane denial of service, and compromised CA distrust. Supported patched baselines are 1.31.3+ and 1.30.7+; 1.29's final patch does not extend its support window.
- **Kyverno 1.19.2:** addresses 24 advisories across policy isolation, image verification, authorization, expression limits, and workflow hardening. Check each advisory's affected versions and select a chart with the patched application. [Release and advisory links](https://github.com/kyverno/kyverno/releases/tag/v1.19.2).
- **containerd 2.4.2:** includes runtime security fixes. Follow the distribution's supported patched branch and drain/upgrade procedures rather than replacing a managed runtime directly. [Release advisories](https://github.com/containerd/containerd/releases/tag/v2.4.2).

## Priority: KEDA 2.21 security and breaking changes

KEDA 2.21 fixes critical **CVE-2026-77524 / GHSA-637c-6jxx-4rwm**. The affected paths use Vault Kubernetes authentication or `boundServiceAccountToken` in TriggerAuthentication/ClusterTriggerAuthentication. Review these integrations before upgrading; API keys and ordinary Vault token authentication are outside those affected paths. [Release and advisory links](https://github.com/kedacore/keda/releases/tag/v2.21.0).

- **Token audiences:** Configure dedicated audiences and matching receiver validation. Tokens minted for named service accounts need exact namespace/name audience mappings. Avoid using the operator-wide insecure `legacy` mode as a permanent solution.
- **Temporal:** Removed `buildId`, `selectAllActive`, and `selectUnversioned`. For versioned workers, migrate to `workerDeploymentName` and `workerDeploymentBuildId`.
- **Azure Pipelines:** `scaleOnInFlight` defaults to `true`, counting unfinished assigned jobs. Review scaling behavior; `false` restores unassigned-only counting.

Follow the [2.20 → 2.21 migration guide](https://keda.sh/docs/2.21/migration/). The bundled examples do not configure these authentication paths or the Temporal/Azure Pipelines scalers, so this refresh changes their documented baseline without adding token configuration.

Earlier migration reminder: custom RBAC for KEDA 2.20+ must allow event recording through `events.k8s.io/events`. Review all intervening release notes when upgrading older installations.

## ArgoCD 3.5: Helm and deprecated signature configuration

ArgoCD 3.5 uses Helm 4. Plain HTTP OCI registries require explicit configuration, including dependency repositories. Existing `spec.source.helm.version: v3` no longer selects Helm 3. GnuPG signature configuration (`AppProject.spec.signatureKeys`) is deprecated in favor of `sourceIntegrity`. Impersonation now covers API server operations **when enabled**; it is not an assertion that every installation enables impersonation by default. Review the [3.4 → 3.5 upgrade guide](https://argo-cd.readthedocs.io/en/stable/operator-manual/upgrading/3.4-3.5/).

The [setup guide](argocd-setup.md) pins the application manifest to v3.5.6. Helm chart versions are independent of application versions; select a chart by its `appVersion` rather than retaining the previous `8.x` placeholder.

## cert-manager 1.21.3: trust, Secret ownership, and renewal

The October patch distrusts compromised eMudhra CAs, fixes a stale ACME ARI renewal-window loop, and requires the next-private-key Secret to have the expected label and Certificate ownership. This prevents a status writer from using an unrelated Secret's key. Upstream recommends that all users upgrade. These fixes supplement September's issuer-response and ambient-credential hardening. [Release notes](https://github.com/cert-manager/cert-manager/releases/tag/v1.21.3).

The July RBAC advisory remains relevant to older installations: [GHSA-8rvj-mm4h-c258](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-8rvj-mm4h-c258). Check the advisory's affected/fixed versions when assessing an existing cluster.

## Kubernetes and Istio support windows

Upstream Kubernetes currently maintains **1.35, 1.36, and 1.37**; **1.34 reached EOL October 27, 2026**. The study prerequisites retain 1.35/1.36 and recommend matching kubectl's minor version to the cluster. Latest published stable is 1.37.2. [Kubernetes releases and support dates](https://kubernetes.io/releases/).

Istio supports **1.30 and 1.31**. Version **1.29 reached EOL October 15, 2026**, replacing the previous page's estimated October 12 date. Istio 1.31 supports Kubernetes **1.32–1.37**; 1.30 supports **1.32–1.36**. This does not certify every other add-on on Kubernetes 1.37. [Istio support matrix](https://istio.io/latest/docs/releases/supported-releases/).

Ecosystem news: Istio 1.31 adds weighted ambient waypoint canaries and enables stricter separation of cross-namespace Istio Gateways from managed Gateway API proxies by default. Review custom gateway sharing before upgrading. [1.31 change notes](https://istio.io/latest/news/releases/1.31.x/announcing-1.31/change-notes/).

## Networking and monitoring updates

- **Cilium 1.20.4** fixes the 1.20.3 BackendTLSPolicy regression as well as CA trust. CiliumEnvoyConfig redirects now require same-namespace Services; omitted namespaces in clusterwide references default to `default`. Follow the minor upgrade guide before changing the CNI. [Release notes](https://github.com/cilium/cilium/releases/tag/v1.20.4).
- **Gateway API 1.7.0** promotes HTTPRoute retries to Standard. Experimental session persistence moves to XBackend; inline route/BackendTrafficPolicy attachment is deprecated. Experimental fields are renamed, including `sessionName` to `cookie.name`/`header.name`, `cookieConfig` to `cookie`, and XBackend port `port` to `number`; `port.name` is removed. Standard CRDs are not subject to those Experimental field breaks. [Release notes](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.7.0).
- **Controller compatibility:** the Cilium lab uses **Gateway API 1.6.3**, as specified by [Cilium's support page](https://docs.cilium.io/en/stable/network/servicemesh/gateway-api/gateway-api/). Standard/Experimental are alternative channels; check safe-upgrade restrictions before switching. Redirect codes 303, 307, and 308 still require Extended conformance. TCPRoute/UDPRoute use `v1`; avoid deprecated `v1alpha2`.
- **Calico 3.33.0:** install/update the separate `crd.projectcalico.org.v1` chart before the operator. `defaultFelixConfiguration` is deprecated; apply custom resources explicitly. Most separate component images are replaced by `quay.io/calico/calico`; audit image mirrors. eBPF requires Linux 5.10+ and BTF/CO-RE. BIRD-programmed IPIP routes are deprecated for planned removal in 3.35; Felix is now the default owner. DatastoreMigration `v1beta1` remains served but is deprecated in favor of `v1`. FIPS image variants were removed. [Release notes](https://github.com/projectcalico/calico/blob/v3.33.0/release-notes/v3.33.0-release-notes.md).
- **kube-prometheus-stack 92.16.0:** chart 92 adds `kubernetes.io/os: linux` node selectors to chart-owned workloads, merging existing selectors and triggering a one-time rollout. Review mixed-OS placement and CRD handling. The chart's appVersion is Prometheus Operator v0.94.2, not Prometheus/Grafana. [Tagged upgrade instructions](https://github.com/prometheus-community/helm-charts/blob/kube-prometheus-stack-92.16.0/charts/kube-prometheus-stack/UPGRADE.md).

## Newly covered ecosystem migration boundaries

- **Flux 2.10:** object-level workload identity is always enabled and default controller RBAC no longer grants `create` on `serviceaccounts/token`. Install explicit bindings where required before upgrading. Notification Event/Alert/Provider APIs graduate to `v1`; migrate dropped fields and credentials before converting. ImageRepository uses Flux artifact storage by default, causing an initial rescan. Supported Kubernetes minima are 1.35.2, 1.36.1, and 1.37.0 for their respective minors. [Release and migration notes](https://github.com/fluxcd/flux2/releases/tag/v2.10.0).
- **Loki community chart 20:** bundled MinIO, `minio`, and `ignoreMinioDeprecation` are removed. Migrate storage on 19.x and retain access to old data until it ages out before crossing this boundary. Chart 20 rejects unknown top-level values. The lab uses chart 20.0.3, Monolithic mode, and ephemeral filesystem storage, not bundled MinIO. Simple Scalable mode is being deprecated. [Tagged migration notes](https://github.com/grafana-community/helm-charts/blob/loki-20.0.3/charts/loki/README.md), [deployment modes](https://grafana.com/docs/loki/latest/setup/install/helm/).
- **Longhorn 1.13:** Kubernetes 1.34+ is mandatory. Experimental V2 sharded volumes lack backup/restore, cloning, backing-image, DR, and live-migration workflows; do not treat them as equivalent to ordinary persistent volumes. [Release](https://github.com/longhorn/longhorn/releases/tag/v1.13.0).
- **Runtime and DNS releases:** CRI-O 1.37.2 belongs with Kubernetes 1.37, not the 1.35/1.36 study baseline. containerd major versions change configuration paths. Managed CoreDNS/runtime versions follow the provider's upgrade policy, not the repository's upstream latest column. See [CRI-O](cri-o-setup.md), [containerd](containerd-setup.md), and [CoreDNS](coredns-setup.md).

## ingress-nginx remains retired

The repository was archived on **March 24, 2026**. Keep [nginx-ingress-setup.md](nginx-ingress-setup.md) and its manifests for historical study; use a maintained [Gateway API implementation](https://gateway-api.sigs.k8s.io/implementations/) for new work. [Archive status](https://github.com/kubernetes/ingress-nginx).

The Gateway API guide previously listed ingress-nginx as a Gateway controller. It now distinguishes **NGINX Gateway Fabric**, a separate implementation. Existing GatewayClass examples use Cilium's `io.cilium/gateway-controller`, and BackendTLSPolicy examples use `gateway.networking.k8s.io/v1`.

## Rechecking this snapshot

Check each project's release and upgrade documentation again before deployment. For repositories containing multiple Helm charts, use the component-specific release tag rather than assuming `/releases/latest` identifies the desired chart. Review security advisories, Kubernetes support windows, and controller conformance separately from release numbers.
