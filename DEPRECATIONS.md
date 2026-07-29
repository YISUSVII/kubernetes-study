# 2026 Update: Deprecated, Outdated & Retired Resources

> Generated as part of the mid-2026 refresh of this repository. Versions below were verified against each project's official GitHub Releases pages on **July 29, 2026**. Re-check `endoflife.date` and each project's release page periodically, since these ecosystems move fast.

## Summary Table

| Component | Repo previously referenced | Current stable (Jul 2026) | Severity |
|-----------|----------------------------|----------------------------|----------|
| ingress-nginx | v1.11 / chart 4.x | controller-v1.15.1 / chart-4.15.1 — **project retired** | 🔴 Critical |
| ArgoCD | v2.14 | v3.4.5 (v3.5 in RC) | 🟠 Major version behind |
| Istio | 1.24 | 1.30.3 | 🟠 Major version behind (past EOL) |
| Cilium | 1.17 | 1.19.6 (1.20 in RC) | 🟡 Behind, 1.17 nearing EOL |
| cert-manager | v1.17 | v1.21.0 | 🟡 Behind, security fix in v1.19.6/v1.20.3 |
| Gateway API | v1.2.1 | v1.6.1 | 🟡 Behind, API graduations |
| KEDA | v2.15 | v2.20.1 | 🟡 Behind, breaking RBAC change |
| Calico | (unpinned, ~v3.29 era) | v3.32.1 | 🟢 Minor |
| kube-prometheus-stack (Helm chart) | 79.9.0 | 87.21.0 | 🟢 Minor |

---

## 🔴 Critical: ingress-nginx is retired

**`kubernetes/ingress-nginx` was archived by its maintainers/Kubernetes SIG on March 24, 2026.** The GitHub repository is now read-only ("Public archive"), no further releases, security patches, or bug fixes will be published. The final releases are `controller-v1.15.1` and Helm chart `4.15.1`.

- **Action**: Do not deploy `ingress-nginx` for new workloads. If you're currently running it, plan a migration.
- **Migration path**: Move to the [Gateway API](gateway-api-setup.md) with an actively maintained implementation — options include **Envoy Gateway**, **Cilium** (native Gateway API support, see [cilium-setup.md](cilium-setup.md)), **Istio Gateway**, or another [conformant Gateway API implementation](https://gateway-api.sigs.k8s.io/implementations/).
- **Tooling**: Kubernetes SIG-Network maintains [ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway), a CLI that converts existing `Ingress` resources (including many ingress-nginx annotations) into Gateway API resources.
- This repo's [nginx-ingress-setup.md](nginx-ingress-setup.md) and `examples/NginxIngress/` are kept only for historical/study reference (e.g. understanding the older Ingress annotation model).

## 🟠 ArgoCD v2.14 → v3.4 (major version jump)

- ArgoCD 3.0 was a major release with breaking changes vs. the 2.x series referenced previously in this repo:
  - **Helm 3 → Helm 4 migration** inside the repo-server for Helm-type Applications — test Helm-based Applications carefully after upgrading.
  - RBAC and impersonation behavior changes (server operations now use impersonation by default in newer 3.x releases).
  - `Application` CRD (`argoproj.io/v1alpha1`) is unchanged in group/version, but new optional fields were added (e.g. `sourceHydrator`, source integrity verification) — no manifest rewrite required, but review the [ArgoCD upgrade docs](https://argo-cd.readthedocs.io/en/stable/operator-manual/upgrading/overview/) before jumping multiple majors.
- **Action**: Upgrade path is 2.x → 3.0 → 3.4/3.5, following the official upgrade guide one minor/major at a time. Do not skip straight from 2.14 to 3.5.

## 🟠 Istio 1.24 → 1.30 (multiple releases behind, past EOL)

- Istio only actively supports roughly the last 4 minor releases (currently 1.28.x, 1.29.x, 1.30.x, plus 1.31 in alpha). **1.24.x no longer receives patches.**
- No breaking `networking.istio.io` API changes between 1.24 and 1.30 for the resources used in this repo's examples (`VirtualService`, `Gateway`, `DestinationRule`, `PeerAuthentication` are all stable `v1`), but **always upgrade one minor version at a time** per Istio's supported upgrade policy — do not jump 1.24 → 1.30 directly.
- **Action**: Pin explicit Helm chart versions (`--version 1.30.3`) instead of installing whatever the `istio/istiod` chart resolves to by default, and follow the [canary control plane upgrade](https://istio.io/latest/docs/setup/upgrade/canary/) process.

## 🟡 Cilium 1.17 → 1.19/1.20

- Cilium 1.17.x is approaching end-of-life; 1.18 and 1.19 are the actively maintained stable branches, with 1.20 currently in release-candidate.
- Notable recent changes relevant to this repo's `examples/Cilium/` manifests:
  - Gateway API support inside Cilium has been updated to track Gateway API v1.6.x (TCPRoute/UDPRoute now `v1`).
  - Beta Mutual Auth is deprecated and will be removed in a future Cilium version.
  - The local REST BGP APIs are deprecated.
- **Action**: Upgrade to 1.19.x for new deployments; avoid 1.17.x for new clusters.

## 🟡 cert-manager v1.17 → v1.21 (includes a security fix)

- **Security**: [GHSA-8rvj-mm4h-c258](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-8rvj-mm4h-c258) (HIGH) — the default `cert-manager-edit` aggregated ClusterRole allowed namespaced users to directly create ACME `Challenge`/`Order` resources, potentially bypassing Issuer solver selectors and exfiltrating DNS provider credentials (notably with the acme-dns solver). Fixed in **v1.19.6**, **v1.20.3**, and **v1.21.0**. If you run any version between v1.17 and v1.20.2, upgrade immediately.
- **Breaking Helm chart changes in v1.21.0**:
  - The chart no longer creates a default `Role`/`RoleBinding` granting `serviceaccounts/token: create` to the controller ServiceAccount.
  - `prometheus.servicemonitor.targetPort`, `prometheus.servicemonitor.path`, and `prometheus.podmonitor.path` Helm values were **removed** (schema uses `additionalProperties: false` — leftover values will fail validation). The metrics Service port was renamed from `tcp-prometheus-servicemonitor` to `http-metrics`.
  - `cert-manager-edit` ClusterRole no longer grants `create`/`patch`/`update` on ACME `Challenge`/`Order` (this is the security fix above).
- **Action**: Update `CertManager/` example ClusterIssuers/Issuers are unaffected (no API version change — `cert-manager.io/v1` is unchanged), but review your Helm values before upgrading the chart.

## 🟡 Gateway API v1.2.1 → v1.6.1

- **API graduations** (relevant to `examples/GatewayAPI/`):
  - `TCPRoute` and `UDPRoute` graduated to **GA (`v1`)** in v1.6.0. The `v1alpha2` versions are now deprecated and will be removed in a future release — update any custom manifests using `gateway.networking.k8s.io/v1alpha2` for these kinds.
  - `TLSRoute`, `ListenerSet` (`XListenerSet`), and the HTTPRoute `CORS` filter graduated to the **Standard** channel in v1.5.0.
  - `ReferenceGrant` is moving toward `v1` (currently still `v1beta1` in this repo's [`examples/GatewayAPI/09-referencegrant.yaml`](examples/GatewayAPI/09-referencegrant.yaml) — that alias remains valid, but watch for the `v1` promotion in upcoming releases).
  - A new `safe-upgrades.gateway.networking.k8s.io` ValidatingAdmissionPolicy (introduced in v1.5) blocks installing Experimental CRDs on top of Standard CRDs and blocks downgrading below v1.5 once installed — be aware of this when scripting CRD installs/upgrades.
- **Action**: Bump install manifests to `v1.6.1` (already done in [gateway-api-setup.md](gateway-api-setup.md)); prefer `v1` over `v1alpha2` for TCPRoute/UDPRoute in any new manifests.

### Fixed in this repo (2026 update)

- **[`examples/GatewayAPI/10-backendtlspolicy.yaml`](examples/GatewayAPI/10-backendtlspolicy.yaml)** used `apiVersion: gateway.networking.k8s.io/v1alpha3` for `BackendTLSPolicy`. As of the v1.6.1 CRDs, **`v1alpha3` is deprecated and no longer served** (`served: false` in the CRD) — applying that manifest against a current cluster would fail. Updated to `gateway.networking.k8s.io/v1`.
- **[`examples/GatewayAPI/01-gatewayclass.yaml`](examples/GatewayAPI/01-gatewayclass.yaml)** and **[`02-gateway-basic.yaml`](examples/GatewayAPI/02-gateway-basic.yaml)** referenced `controllerName: k8s.io/ingress-nginx` — ingress-nginx never implemented the Gateway API and the project is now retired anyway. Updated the examples to use Cilium's Gateway API controller (`io.cilium/gateway-controller`), which is already documented elsewhere in this repo and is actively maintained.
- **[`examples/Cilium/03-hubble-observability.yaml`](examples/Cilium/03-hubble-observability.yaml)** exposed Hubble UI through an `ingressClassName: nginx` Ingress with `nginx.ingress.kubernetes.io/*` annotations. Added a note recommending Gateway API + a maintained implementation instead of standing up a new ingress-nginx deployment.

## 🟡 KEDA v2.15 → v2.20 (breaking RBAC change + removed deprecated fields)

- **Breaking**: starting in v2.20.0, KEDA records Kubernetes events via the `events.k8s.io` API group instead of the legacy core `events` resource (tracks the Kubernetes 0.35 client-go dependency bump). If you deploy KEDA with **custom/restricted RBAC** (not the bundled manifests or Helm chart), you must grant `create`/`patch` on `events.k8s.io/events` before upgrading, or event recording will silently fail.
- **Removed in v2.20** (deprecated since v2.18): GCP Pub/Sub Scaler's `subscriptionSize` setting (use `mode`/`value` instead); Huawei Cloudeye Scaler's `minMetricValue` (use `activationTargetMetricValue`).
- **Removed in v2.18**: NATS Streaming ("Stan") scaler; CPU/Memory scaler's legacy `type` setting (use `metricType`); IBM MQ scaler's `tls` setting (use `unsafeSsl`).
- **Action**: none of this repo's `examples/KEDA/` manifests use the removed fields, so they remain valid — but if you deploy KEDA with hand-written RBAC, update it for the `events.k8s.io` change.

## 🟢 Calico v3.32.1

- No breaking changes identified against the manifests in `examples/Calico/`. `AdminNetworkPolicy` (`policy.networking.k8s.io/v1alpha1`) is still alpha upstream in Kubernetes (network-policy-api project) — it has not yet graduated to beta/GA, so the existing example remains accurate. Re-check `policy.networking.k8s.io` graduation status periodically.

## 🟢 kube-prometheus-stack Helm chart 79.9.0 → 87.21.0

- Large chart version jump is normal for this fast-moving chart (it bundles Prometheus Operator, Prometheus, Alertmanager, Grafana, and node-exporter versions together — the jump reflects many small releases, not one breaking change).
- The standalone `prometheus-operator/kube-prometheus` (jsonnet) project separately moved from v0.14 (referenced implicitly via older examples) to **v0.18.0**, which migrated service discovery to `EndpointSlices` and dropped the deprecated `apiserver_storage_objects` metric (replaced by `apiserver_resource_objects` since Kubernetes 1.34).
- **Action**: `examples/Prometheus/` manifests (`ServiceMonitor`, `PrometheusRule`, `PodMonitor` on `monitoring.coreos.com/v1`) are unaffected — that CRD API has been stable for years.

---

## How this list was produced

Versions were checked directly against the official GitHub Releases page for each project (argoproj/argo-cd, projectcalico/calico, cert-manager/cert-manager, cilium/cilium, kubernetes-sigs/gateway-api, istio/istio, kedacore/keda, kubernetes/ingress-nginx, prometheus-community/helm-charts, prometheus-operator/kube-prometheus) on **2026-07-29**. When re-running this check in the future, prefer each project's `/releases/latest` endpoint and cross-reference [endoflife.date](https://endoflife.date/) for support windows.
