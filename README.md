# Kubernetes Study Repository

> A structured study guide covering production-grade Kubernetes tooling, updated for **mid-2026**.  
> Compatible with **Kubernetes 1.34 / 1.35**.

> 🌐 **Website**: browse this repo as a visual, searchable site at **https://yisusvii.github.io/kubernetes-study/** (source in [`docs/`](docs/)). To enable it on your own fork: repo **Settings → Pages → Source: Deploy from a branch → Branch: `main` / folder: `/docs`**.

> ⚠️ **Deprecation notice**: `ingress-nginx` (the project used in [nginx-ingress-setup.md](nginx-ingress-setup.md)) was **archived/retired by Kubernetes on March 24, 2026**. See [DEPRECATIONS.md](DEPRECATIONS.md) for details and migration guidance before using it in new projects.

## Contents

| Guide | Description |
|-------|-------------|
| [STUDY_GUIDE.md](STUDY_GUIDE.md) | Main learning paths, exercises, and best practices |
| [DEPRECATIONS.md](DEPRECATIONS.md) | **2026 update**: deprecated/retired/outdated resources and migration notes |
| [argocd-setup.md](argocd-setup.md) | GitOps with ArgoCD v3.4+ |
| [calico-setup.md](calico-setup.md) | Network policies with Calico v3.32+ |
| [cert-manager-setup.md](cert-manager-setup.md) | TLS automation with cert-manager v1.21+ |
| [cilium-setup.md](cilium-setup.md) | eBPF networking with Cilium v1.19+ (standard CNI) |
| [gateway-api-setup.md](gateway-api-setup.md) | Gateway API v1.6+ |
| [istio-setup.md](istio-setup.md) | Service mesh with Istio 1.30+ |
| [keda-setup.md](keda-setup.md) | Event-driven autoscaling with KEDA v2.20+ |
| [kubernetes-admin-tools-reference.md](kubernetes-admin-tools-reference.md) | kubectl, Helm, k9s, and more |
| [nginx-ingress-setup.md](nginx-ingress-setup.md) | NGINX Ingress Controller ⚠️ **retired, see DEPRECATIONS.md** |
| [prometheus-grafana-setup.md](prometheus-grafana-setup.md) | Monitoring stack (kube-prometheus-stack chart v87+) |
| [examples/](examples/) | Ready-to-use YAML manifests for all technologies |

---

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

## Version Compatibility Matrix

| Tool | Latest Stable (Jul 2026) | K8s 1.34 | K8s 1.35 | Notes |
|------|---------------|----------|----------|-------|
| ArgoCD | v3.4.5 (v3.5 in RC) | ✅ | ✅ | Major bump from v2.x — see [DEPRECATIONS.md](DEPRECATIONS.md) |
| Calico | v3.32.1 | ✅ | ✅ | |
| cert-manager | v1.21.0 | ✅ | ✅ | v1.19/v1.20 got a HIGH severity RBAC security patch — upgrade |
| Cilium | v1.19.6 (v1.20 in RC) | ✅ | ✅ | v1.17.x is approaching EOL |
| Gateway API | v1.6.1 | ✅ | ✅ | TCPRoute/UDPRoute graduated to GA (`v1`); `v1alpha2` deprecated |
| Istio | v1.30.3 | ✅ | ✅ | v1.24 is long past EOL (Istio supports ~4 minor releases) |
| KEDA | v2.20.1 | ✅ | ✅ | Events now use `events.k8s.io` — RBAC update required |
| NGINX Ingress (ingress-nginx) | controller-v1.15.1 | ⚠️ | ⚠️ | **Project retired/archived March 24, 2026** |
| kube-prometheus-stack (Helm chart) | 87.21.0 | ✅ | ✅ | Chart jumped from ~79.x |

---

**Last Updated**: July 29, 2026
