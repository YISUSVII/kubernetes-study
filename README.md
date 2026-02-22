# Kubernetes Study Repository

> A structured study guide covering production-grade Kubernetes tooling for 2025/2026.  
> Compatible with **Kubernetes 1.34 / 1.35**.

## Contents

| Guide | Description |
|-------|-------------|
| [STUDY_GUIDE.md](STUDY_GUIDE.md) | Main learning paths, exercises, and best practices |
| [argocd-setup.md](argocd-setup.md) | GitOps with ArgoCD v2.14+ |
| [calico-setup.md](calico-setup.md) | Network policies with Calico |
| [cert-manager-setup.md](cert-manager-setup.md) | TLS automation with cert-manager v1.17+ |
| [cilium-setup.md](cilium-setup.md) | eBPF networking with Cilium (2025 standard CNI) |
| [gateway-api-setup.md](gateway-api-setup.md) | Gateway API v1.2+ |
| [istio-setup.md](istio-setup.md) | Service mesh with Istio 1.24+ |
| [keda-setup.md](keda-setup.md) | Event-driven autoscaling with KEDA v2.15+ |
| [kubernetes-admin-tools-reference.md](kubernetes-admin-tools-reference.md) | kubectl, Helm, k9s, and more |
| [nginx-ingress-setup.md](nginx-ingress-setup.md) | NGINX Ingress Controller |
| [prometheus-grafana-setup.md](prometheus-grafana-setup.md) | Monitoring stack |
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

| Tool | Tested Version | K8s 1.34 | K8s 1.35 |
|------|---------------|----------|----------|
| ArgoCD | v2.14 | ✅ | ✅ |
| cert-manager | v1.17 | ✅ | ✅ |
| Cilium | v1.17 | ✅ | ✅ |
| Gateway API | v1.2.1 | ✅ | ✅ |
| Istio | v1.24 | ✅ | ✅ |
| KEDA | v2.15 | ✅ | ✅ |
| NGINX Ingress | v1.11 | ✅ | ✅ |
| kube-prometheus-stack | v0.77 | ✅ | ✅ |

---

**Last Updated**: February 22, 2026
