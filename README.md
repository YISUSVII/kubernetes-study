# Kubernetes Study Repository

> A structured study guide covering production-grade Kubernetes tooling, updated for **October 1, 2026**.
> Study baseline: **Kubernetes 1.35 / 1.36**. Upstream also maintains **1.37**; check each add-on's support matrix before upgrading.

> 🌐 **Website**: browse this repo as a visual, searchable site at **https://yisusvii.github.io/kubernetes-study/** (source in [`docs/`](docs/)). To enable it on your own fork: repo **Settings → Pages → Source: Deploy from a branch → Branch: `main` / folder: `/docs`**.

> ⚠️ **Deprecation notice**: `ingress-nginx` (the project used in [nginx-ingress-setup.md](nginx-ingress-setup.md)) was **archived/retired by Kubernetes on March 24, 2026**. See [DEPRECATIONS.md](DEPRECATIONS.md) for details and migration guidance before using it in new projects.

## Contents

| Guide | Description |
|-------|-------------|
| [STUDY_GUIDE.md](STUDY_GUIDE.md) | Main learning paths, exercises, and best practices |
| [DEPRECATIONS.md](DEPRECATIONS.md) | **2026 update**: deprecated/retired/outdated resources and migration notes |
| [argocd-setup.md](argocd-setup.md) | GitOps with ArgoCD v3.5+ |
| [calico-setup.md](calico-setup.md) | Network policies with Calico v3.32+ |
| [cert-manager-setup.md](cert-manager-setup.md) | TLS automation with cert-manager v1.21+ |
| [cilium-setup.md](cilium-setup.md) | eBPF networking with Cilium v1.20+ (standard CNI) |
| [gateway-api-setup.md](gateway-api-setup.md) | Gateway API v1.6+ |
| [istio-setup.md](istio-setup.md) | Service mesh with Istio 1.31+ |
| [keda-setup.md](keda-setup.md) | Event-driven autoscaling with KEDA v2.21+ |
| [kubernetes-admin-tools-reference.md](kubernetes-admin-tools-reference.md) | kubectl, Helm, k9s, and more |
| [nginx-ingress-setup.md](nginx-ingress-setup.md) | NGINX Ingress Controller ⚠️ **retired, see DEPRECATIONS.md** |
| [prometheus-grafana-setup.md](prometheus-grafana-setup.md) | Monitoring stack (kube-prometheus-stack chart v91+) |
| [crossplane-setup.md](crossplane-setup.md) | Platform APIs with Crossplane v2.4.2 (CNCF Graduated) |
| [karmada-setup.md](karmada-setup.md) | Multi-cluster orchestration with Karmada v1.19.0 (CNCF Graduated) |
| [examples/](examples/) | Ready-to-use YAML manifests for all technologies |

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

## Release Snapshot — October 1, 2026

| Tool | Verified stable release | Official source | Upgrade notes |
|------|-------------------------|-----------------|---------------|
| Kubernetes | 1.37.1 | [Supported releases](https://kubernetes.io/releases/) | Maintained branches: 1.35, 1.36, 1.37 |
| ArgoCD | v3.5.3 | [Release](https://github.com/argoproj/argo-cd/releases/tag/v3.5.3) | Helm 4 and Source Integrity migration |
| Calico | v3.32.2 | [Release](https://github.com/projectcalico/calico/releases/tag/v3.32.2) | Patch update |
| cert-manager | v1.21.2 | [Release](https://github.com/cert-manager/cert-manager/releases/tag/v1.21.2) | Security hardening and renewal/webhook fixes |
| Cilium | v1.20.2 | [Release](https://github.com/cilium/cilium/releases/tag/v1.20.2) | 1.20 is stable; review minor upgrade notes |
| Gateway API | v1.6.2 | [Release](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.6.2) | Redirect conformance clarification |
| Istio | 1.31.1 | [Release](https://github.com/istio/istio/releases/tag/1.31.1) | 1.29 support expected to end October 12 |
| KEDA | v2.21.0 | [Release](https://github.com/kedacore/keda/releases/tag/v2.21.0) | Critical token-audience fix; three breaking changes |
| Crossplane | v2.4.2 | [Release](https://github.com/crossplane/crossplane/releases/tag/v2.4.2) | Namespaced v2 composite API lab |
| Karmada | v1.19.0 | [Release](https://github.com/karmada-io/karmada/releases/tag/v1.19.0) | Graduated September 2026; multi-cluster lab |
| ingress-nginx | controller-v1.15.1 (retired) | [Archived repository](https://github.com/kubernetes/ingress-nginx) | Migrate to a maintained Gateway API implementation |
| kube-prometheus-stack | 91.8.2 (chart) | [Release](https://github.com/prometheus-community/helm-charts/releases/tag/kube-prometheus-stack-91.8.2) | Review intervening major chart upgrade notes |

This snapshot records published versions, not cluster-tested compatibility. In particular, [Istio 1.31 lists Kubernetes 1.32–1.36 as supported](https://istio.io/latest/docs/releases/supported-releases/); do not assume Kubernetes 1.37 support across the stack.

See [DEPRECATIONS.md](DEPRECATIONS.md) for the October security, deprecation, and ecosystem news update.

---

**Last Updated**: October 1, 2026
