# Kubernetes Study Repository

> A structured study guide covering production-grade Kubernetes tooling, updated for **October 29, 2026**.
> Study baseline: **Kubernetes 1.35 / 1.36**. Upstream also maintains **1.37**; check each add-on's support matrix before upgrading.

> 🌐 **Website**: browse this repo as a visual, searchable site at **https://yisusvii.github.io/kubernetes-study/** (source in [`docs/`](docs/)). To enable it on your own fork: repo **Settings → Pages → Source: Deploy from a branch → Branch: `main` / folder: `/docs`**.

> ⚠️ **Deprecation notice**: `ingress-nginx` (the project used in [nginx-ingress-setup.md](nginx-ingress-setup.md)) was **archived/retired by Kubernetes on March 24, 2026**. See [DEPRECATIONS.md](DEPRECATIONS.md) for details and migration guidance before using it in new projects.

## Contents

| Guide | Description |
|-------|-------------|
| [STUDY_GUIDE.md](STUDY_GUIDE.md) | Main learning paths, exercises, and best practices |
| [DEPRECATIONS.md](DEPRECATIONS.md) | **2026 update**: deprecated/retired/outdated resources and migration notes |
| [argocd-setup.md](argocd-setup.md) | GitOps with ArgoCD v3.5+ |
| [calico-setup.md](calico-setup.md) | Network policies with Calico v3.33+ |
| [cert-manager-setup.md](cert-manager-setup.md) | TLS automation with cert-manager v1.21+ |
| [cilium-setup.md](cilium-setup.md) | eBPF networking with Cilium v1.20+ (standard CNI) |
| [gateway-api-setup.md](gateway-api-setup.md) | Gateway API v1.6+ |
| [istio-setup.md](istio-setup.md) | Service mesh with Istio 1.31+ |
| [keda-setup.md](keda-setup.md) | Event-driven autoscaling with KEDA v2.21+ |
| [kubernetes-admin-tools-reference.md](kubernetes-admin-tools-reference.md) | kubectl, Helm, k9s, and more |
| [nginx-ingress-setup.md](nginx-ingress-setup.md) | NGINX Ingress Controller ⚠️ **retired, see DEPRECATIONS.md** |
| [prometheus-grafana-setup.md](prometheus-grafana-setup.md) | Monitoring stack (kube-prometheus-stack chart v92+) |
| [crossplane-setup.md](crossplane-setup.md) | Platform APIs with Crossplane v2.4.3 (CNCF Graduated) |
| [karmada-setup.md](karmada-setup.md) | Multi-cluster orchestration with Karmada v1.19.0 (CNCF Graduated) |
| [Ecosystem image coverage](#ecosystem-image-coverage) | Comparison of all 24 pictured technologies and links to their guides |
| [examples/](examples/) | Standalone YAML collections; additional inline labs are included in the guides |

## Ecosystem image coverage

Compared with the supplied Kubernetes Ecosystem image on **October 29, 2026**. Of its 24 technologies, **8 already had dedicated setup coverage**, **3 had partial coverage**, and **13 had no substantive study coverage**. All 16 gaps now have dedicated guides. Prometheus and Grafana share one existing guide; Kubernetes at the center is the repository's foundation, not another missing add-on.

| Technology in image | Coverage before this update | Study content |
|---------------------|-----------------------------|---------------|
| Helm | Partial: CLI reference and chart installation commands | [Helm setup and release lifecycle](helm-setup.md) |
| Kustomize | Partial: ArgoCD application example | [Bases, overlays, and rendering](kustomize-setup.md) |
| Argo CD | Existing dedicated guide | [ArgoCD](argocd-setup.md) |
| Flux | Missing | [GitOps reconciliation](flux-setup.md) |
| Prometheus | Existing dedicated guide | [Prometheus and Grafana](prometheus-grafana-setup.md) |
| Grafana | Existing dedicated guide | [Prometheus and Grafana](prometheus-grafana-setup.md) |
| OTel (OpenTelemetry) | Missing: only a resource-list mention | [Collector and OTLP lab](opentelemetry-setup.md) |
| Fluent Bit | Missing | [Container log collection](fluent-bit-setup.md) |
| Loki | Missing | [Log storage and LogQL](loki-setup.md) |
| Cilium | Existing dedicated guide | [Cilium](cilium-setup.md) |
| Calico | Existing dedicated guide | [Calico](calico-setup.md) |
| containerd | Missing | [Runtime configuration and CRI diagnostics](containerd-setup.md) |
| CoreDNS | Missing | [Service discovery and DNS diagnostics](coredns-setup.md) |
| CRI-O | Missing | [Runtime installation boundaries and diagnostics](cri-o-setup.md) |
| Istio | Existing dedicated guide | [Istio](istio-setup.md) |
| Envoy Gateway | Partial: installation option in Gateway API guide | [Controller-specific Gateway API lab](envoy-gateway-setup.md) |
| Longhorn | Missing | [Persistent storage and data lifecycle](longhorn-setup.md) |
| Velero | Missing | [Backup and verified restore](velero-setup.md) |
| KEDA | Existing dedicated guide | [KEDA](keda-setup.md) |
| Karpenter | Missing | [Provider-aware node provisioning](karpenter-setup.md) |
| cert-manager | Existing dedicated guide | [cert-manager](cert-manager-setup.md) |
| Kyverno | Missing | [Audit-to-enforce policy lab](kyverno-setup.md) |
| Falco | Missing | [Runtime event detection](falco-setup.md) |
| Trivy | Missing | [Image and manifest scanning](trivy-setup.md) |

### Lab boundaries

The new guides include prerequisites, inline commands/configuration, expected results, troubleshooting, cleanup, exercises, and official references. Shell examples use **Bash** unless identified otherwise; on Windows, use WSL for these commands. Runtime diagnostics run on the relevant **Linux node**, not on the Windows host.

Select and record supported CLI/chart/application versions before deployment. New guides are **study procedures, not cluster-tested compatibility certifications**; their upstream releases are recorded in the October 29 snapshot below. Helm chart versions are independent of application versions. Review upstream support matrices against your actual Kubernetes version.

Karpenter requires provider infrastructure and may incur cloud charges; Velero needs an object storage provider; Longhorn needs prepared storage nodes; Falco needs kernel access. CoreDNS and runtimes are commonly installed by cluster bootstrap or managed providers: do not replace them on an existing cluster just to complete a lab. The 16 new labs are inline in their guides rather than blanket-apply directories under `examples/`.

---

## Graduated CNCF orchestration projects

Added from [Scheduling & Orchestration](https://landscape.cncf.io/guide#orchestration-management--scheduling-orchestration), with category membership checked against the [landscape source](https://github.com/cncf/landscape/blob/master/landscape.yml):

| Project | What to study | Lab |
|---------|---------------|-----|
| [Crossplane](https://www.cncf.io/projects/crossplane/) | Define a platform API and reconcile composed Kubernetes resources | [ConfigMap composition](crossplane-setup.md) — no cloud account required |
| [Karmada](https://www.cncf.io/projects/karmada/) | Place workloads across member clusters; duplicate or divide replicas | [Two-member placement](karmada-setup.md) — requires a host and two member clusters |

Kubernetes and KEDA from this category were already covered. Graduation describes project maturity; each guide documents separate lab prerequisites.

## Stay Updated — Kubernetes News & Community

### Official Sources
| Source | URL | What you get |
|--------|-----|-------------|
| **Kubernetes Blog** | https://kubernetes.io/blog/ | Release notes, SIGs updates, deprecation notices |
| **Kubernetes Changelog** | https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/ | Every API change per release |
| **CNCF Blog** | https://www.cncf.io/blog/ | Ecosystem project news and case studies |
| **CNCF Landscape** | https://landscape.cncf.io/ | Track graduated/incubating projects |

### Newsletters (Weekly)
| Newsletter | URL | Why subscribe |
|-----------|-----|---------------|
| **KubeWeekly** | https://kubeweekly.io/ | Curated K8s links every Friday (official CNCF newsletter) |
| **Last Week in Kubernetes Development** | https://lwkd.info/ | Deep-dive into merged PRs and upstream changes |
| **DevOps Bulletin** | https://devopsbulletin.com/ | Broader platform engineering news |
| **Cloud Native News** | https://cloudnative.news/ | CNCF-focused, daily updates |

### Podcasts
| Podcast | URL | Best for |
|---------|-----|---------|
| **Kubernetes Podcast (Google)** | https://kubernetespodcast.com/ | Official Google K8s podcast; interviews with SIG leads |
| **Ship It! (changelog.fm)** | https://changelog.com/shipit | Platform engineering, GitOps, K8s war stories |
| **Cloud Native Podcast** | https://cloudnativepodcast.com/ | CNCF project deep dives |
| **The Kubelist Podcast** | https://www.heavybit.com/library/podcasts/the-kubelist-podcast | K8s ecosystem startups and tools |

### YouTube Channels
| Channel | URL | Content |
|---------|-----|---------|
| **CNCF (official)** | https://www.youtube.com/@cncf | KubeCon talks, project intros |
| **TechWorld with Nana** | https://www.youtube.com/@TechWorldwithNana | Beginner-friendly K8s tutorials |
| **KodeKloud** | https://www.youtube.com/@KodeKloud | CKA/CKAD exam prep |
| **Rawkode Academy** | https://www.youtube.com/@RawkodeAcademy | Cilium, OpenTelemetry, cloud-native deep dives |

### Community Forums & Discussions
| Platform | URL | Best for |
|----------|-----|---------|
| **Kubernetes Slack** | https://slack.k8s.io/ | `#sig-network`, `#sig-argo`, `#cilium`, `#keda` |
| **CNCF Slack** | https://cloud-native.slack.com/ | Cross-project community discussions |
| **Reddit: r/kubernetes** | https://www.reddit.com/r/kubernetes/ | Q&A, career advice, tool comparisons |
| **GitHub Discussions** | https://github.com/kubernetes/kubernetes/discussions | Upstream design discussions |

### Release Trackers
| Tool | URL | Purpose |
|------|-----|---------|
| **endoflife.date/kubernetes** | https://endoflife.date/kubernetes | K8s version support windows |
| **ArtifactHub** | https://artifacthub.io/ | Find and track Helm chart versions |
| **Renovate / Dependabot** | GitHub Apps | Automate dependency updates in your repos |

### Top Blogs to Follow
| Blog | URL | Focus |
|------|-----|-------|
| **Learnk8s** | https://learnk8s.io/blog | In-depth K8s architecture articles |
| **Iximiuz Labs** | https://iximiuz.com/en/ | Low-level container & K8s internals |
| **Containerized Me** | https://containerized.me/ | Practical K8s guides |
| **The New Stack** | https://thenewstack.io/kubernetes/ | Industry news and trends |
| **Cilium Blog** | https://cilium.io/blog/ | eBPF, CNI, network security |
| **ArgoCD Blog** | https://blog.argoproj.io/ | GitOps patterns and releases |

---

## Release Snapshot — October 29, 2026

| Tool | Verified stable release | Official source | Upgrade notes |
|------|-------------------------|-----------------|---------------|
| Kubernetes | 1.37.2 | [Release](https://github.com/kubernetes/kubernetes/releases/tag/v1.37.2) | Maintained: 1.35, 1.36, 1.37; 1.34 reached EOL October 27 |
| ArgoCD | v3.5.6 | [Release](https://github.com/argoproj/argo-cd/releases/tag/v3.5.6) | Includes 3.5.4 critical fixes; review Kustomize/OCI restrictions |
| Calico | v3.33.0 | [Release](https://github.com/projectcalico/calico/releases/tag/v3.33.0) | Separate CRD chart; consolidated images; eBPF kernel requirements |
| cert-manager | v1.21.3 | [Release](https://github.com/cert-manager/cert-manager/releases/tag/v1.21.3) | Compromised CA distrust, Secret ownership, and ARI fixes |
| Cilium | v1.20.4 | [Release](https://github.com/cilium/cilium/releases/tag/v1.20.4) | Security patch; fixes BackendTLSPolicy regression |
| Gateway API | v1.7.0 upstream; v1.6.3 Cilium lab | [Release](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.7.0) | Match CRDs to controller support; Experimental APIs changed |
| Istio | 1.31.3 | [Release](https://github.com/istio/istio/releases/tag/1.31.3) | Security-patched baseline; 1.29 reached EOL October 15 |
| KEDA | v2.21.0 | [Release](https://github.com/kedacore/keda/releases/tag/v2.21.0) | Critical token-audience fix; three breaking changes |
| Crossplane | v2.4.3 | [Release](https://github.com/crossplane/crossplane/releases/tag/v2.4.3) | Security and package-download/RBAC fixes |
| Karmada | v1.19.0 | [Release](https://github.com/karmada-io/karmada/releases/tag/v1.19.0) | Graduated September 2026; multi-cluster lab |
| ingress-nginx | controller-v1.15.1 (retired) | [Archived repository](https://github.com/kubernetes/ingress-nginx) | Migrate to a maintained Gateway API implementation |
| kube-prometheus-stack | 92.16.0 (chart) | [Release](https://github.com/prometheus-community/helm-charts/releases/tag/kube-prometheus-stack-92.16.0) | 92.x adds Linux node selectors and restarts workloads |
| Helm | v4.3.1 | [Release](https://github.com/helm/helm/releases/tag/v4.3.1) | CLI version, not a chart version |
| Kustomize | v5.8.3 standalone | [Release](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize/v5.8.3) | kubectl's embedded version can differ |
| Flux | v2.10.0 | [Release](https://github.com/fluxcd/flux2/releases/tag/v2.10.0) | Notification v1 migration and workload-identity RBAC changes |
| Envoy Gateway | v1.9.3 | [Release](https://github.com/envoyproxy/gateway/releases/tag/v1.9.3) | Check supported Gateway API CRDs |
| Kyverno | v1.19.2 | [Release](https://github.com/kyverno/kyverno/releases/tag/v1.19.2) | 24 published security advisories addressed |
| Trivy | v0.76.1 | [Release](https://github.com/aquasecurity/trivy/releases/tag/v0.76.1) | Security update; update scanner and database |
| OpenTelemetry Collector distributions | v0.164.0 | [Release](https://github.com/open-telemetry/opentelemetry-collector-releases/releases/tag/v0.164.0) | Separate from SDK, Operator, and chart versions |
| Fluent Bit | v5.1.5 | [Release](https://github.com/fluent/fluent-bit/releases/tag/v5.1.5) | Inspect chart appVersion and output plugins |
| Loki | v3.7.9 application; 20.0.3 chart | [App release](https://github.com/grafana/loki/releases/tag/v3.7.9), [chart release](https://github.com/grafana-community/helm-charts/releases/tag/loki-20.0.3) | Chart 20 removes bundled MinIO and rejects obsolete values |
| Falco | 0.45.2 | [Release](https://github.com/falcosecurity/falco/releases/tag/0.45.2) | Match chart, driver, rules, plugins, and kernel |
| Longhorn | v1.13.0 | [Release](https://github.com/longhorn/longhorn/releases/tag/v1.13.0) | Kubernetes 1.34+; sharded V2 volumes remain evaluation-only |
| Velero | v1.18.4 | [Release](https://github.com/vmware-tanzu/velero/releases/tag/v1.18.4) | Check provider plugin compatibility and test restores |
| Karpenter AWS provider | v1.15.1 | [Release](https://github.com/aws/karpenter-provider-aws/releases/tag/v1.15.1) | Provider-specific release; verify CRDs and IAM |
| containerd | v2.4.2 | [Release](https://github.com/containerd/containerd/releases/tag/v2.4.2) | Security fixes; use the provider-supported runtime branch |
| CRI-O | v1.37.2 | [Release](https://github.com/cri-o/cri-o/releases/tag/v1.37.2) | Match runtime minor to Kubernetes, not this upstream latest pin |
| CoreDNS | v1.15.0 | [Release](https://github.com/coredns/coredns/releases/tag/v1.15.0) | Security fixes; respect distribution-managed DNS versions |

This snapshot records published stable versions, not cluster-tested compatibility. [Istio 1.31 supports Kubernetes 1.32–1.37](https://istio.io/latest/docs/releases/supported-releases/), while 1.30 stops at 1.36. [Flux 2.10](https://github.com/fluxcd/flux2/releases/tag/v2.10.0) requires at least Kubernetes 1.35.2, 1.36.1, or 1.37.0 on those respective minors. [Cilium specifies Gateway API 1.6.3](https://docs.cilium.io/en/stable/network/servicemesh/gateway-api/gateway-api/), so its lab does not blindly adopt upstream 1.7.0. Check each component independently.

See [DEPRECATIONS.md](DEPRECATIONS.md) for the October security, deprecation, and ecosystem news update.

---

**Last Updated**: October 29, 2026

## Website content

The website keeps setup guides, learning paths, admin references, and YAML examples on the site as styled HTML pages. Each learning path opens its section of the complete study guide. Manifest pages include copy and download controls.

Markdown files and `examples/` remain the source of truth. After changing them, regenerate the website and commit the generated files in `docs/`:

```bash
python3 -m pip install -r scripts/requirements.txt
python3 scripts/build_site.py
python3 scripts/check_site.py
```

Preview locally with `python3 -m http.server 8765 --directory docs`, then open `http://localhost:8765/`. GitHub Pages continues to serve `main` → `/docs`; no server or runtime Markdown dependency is needed.
