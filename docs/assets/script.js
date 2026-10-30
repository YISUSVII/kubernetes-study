/* ==========================================================================
   Kubernetes Study Repository — 2026 site logic
   ========================================================================== */

const GUIDES = "guides";
const EXAMPLES = "examples";

/* ---------------- Data ---------------- */

const TECHNOLOGIES = [
  {
    id: "argocd", icon: "🔄", name: "ArgoCD", tagline: "Declarative GitOps continuous delivery for Kubernetes.",
    version: "v3.5.6", note: "includes critical 3.5.4 fixes", status: "attention", statusLabel: "Security update",
    install: "kubectl apply --server-side -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.5.6/manifests/install.yaml",
    setup: `${GUIDES}/argocd-setup.html`, examples: `${EXAMPLES}/ArgoCD/index.html`,
  },
  {
    id: "calico", icon: "🛡️", name: "Calico", tagline: "Network policy enforcement, including AdminNetworkPolicy.",
    version: "v3.33.0", note: "separate CRDs; image and kernel changes", status: "major-update", statusLabel: "Review migration",
    install: "# Install the pinned CRD chart before tigera-operator; follow the setup guide",
    setup: `${GUIDES}/calico-setup.html`, examples: `${EXAMPLES}/Calico/index.html`,
  },
  {
    id: "cert-manager", icon: "🔐", name: "cert-manager", tagline: "Automated TLS certificate issuance and renewal.",
    version: "v1.21.3", note: "CA distrust, Secret ownership, ARI fixes", status: "attention", statusLabel: "Security fix — upgrade",
    install: "helm install cert-manager jetstack/cert-manager -n cert-manager --version v1.21.3",
    setup: `${GUIDES}/cert-manager-setup.html`, examples: `${EXAMPLES}/CertManager/index.html`,
  },
  {
    id: "cilium", icon: "⚡", name: "Cilium", tagline: "eBPF-based CNI with native Gateway API and Hubble observability.",
    version: "v1.20.4", note: "security and BackendTLSPolicy fixes", status: "attention", statusLabel: "Security update",
    install: "helm install cilium cilium/cilium --version 1.20.4 -n kube-system",
    setup: `${GUIDES}/cilium-setup.html`, examples: `${EXAMPLES}/Cilium/index.html`,
  },
  {
    id: "gateway-api", icon: "🌐", name: "Gateway API", tagline: "The role-oriented successor to Ingress: HTTPRoute, GRPCRoute, TCPRoute/UDPRoute.",
    version: "v1.7.0", note: "upstream; Cilium lab uses v1.6.3", status: "attention", statusLabel: "Check controller support",
    install: "kubectl apply --server-side -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.6.3/standard-install.yaml",
    setup: `${GUIDES}/gateway-api-setup.html`, examples: `${EXAMPLES}/GatewayAPI/index.html`,
  },
  {
    id: "istio", icon: "🕸️", name: "Istio", tagline: "Full-featured service mesh: mTLS, traffic shaping, observability.",
    version: "v1.31.3", note: "1.29 reached EOL October 15", status: "attention", statusLabel: "Security update",
    install: "helm install istiod istio/istiod -n istio-system --version 1.31.3",
    setup: `${GUIDES}/istio-setup.html`, examples: `${EXAMPLES}/Istio/index.html`,
  },
  {
    id: "keda", icon: "📈", name: "KEDA", tagline: "Event-driven autoscaling for Kubernetes workloads.",
    version: "v2.21.0", note: "critical token-audience fix", status: "attention", statusLabel: "Security and breaking changes",
    install: "helm install keda kedacore/keda -n keda --version 2.21.0",
    setup: `${GUIDES}/keda-setup.html`, examples: `${EXAMPLES}/KEDA/index.html`,
  },
  {
    id: "nginx-ingress", icon: "🪦", name: "NGINX Ingress", tagline: "Classic Ingress controller — kept for historical/study reference.",
    version: "controller-v1.15.1", note: "final release", status: "retired", statusLabel: "Retired March 2026",
    install: "# Do not deploy for new projects — migrate to Gateway API",
    setup: `${GUIDES}/nginx-ingress-setup.html`, examples: `${EXAMPLES}/NginxIngress/index.html`,
  },
  {
    id: "prometheus", icon: "📊", name: "Prometheus & Grafana", tagline: "Metrics, alerting, and dashboards via kube-prometheus-stack.",
    version: "chart 92.16.0", note: "92.x Linux placement and rollout changes", status: "major-update", statusLabel: "Review chart upgrade",
    install: "helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace --version 92.16.0",
    setup: `${GUIDES}/prometheus-grafana-setup.html`, examples: `${EXAMPLES}/Prometheus/index.html`,
  },
  {
    id: "crossplane", icon: "🧩", name: "Crossplane", tagline: "Build platform APIs using namespaced composite Kubernetes resources.",
    version: "v2.4.3", note: "CA distrust and package/RBAC fixes", status: "attention", statusLabel: "Security update",
    install: "helm install crossplane crossplane-stable/crossplane -n crossplane-system --create-namespace --version 2.4.3 --wait",
    setup: `${GUIDES}/crossplane-setup.html`, examples: `${EXAMPLES}/Crossplane/index.html`,
  },
  {
    id: "karmada", icon: "🌍", name: "Karmada", tagline: "Multi-cluster scheduling, workload propagation, and replica placement.",
    version: "v1.19.0", note: "CNCF Graduated September 2026", status: "stable", statusLabel: "CNCF Graduated",
    install: "# Follow the setup guide: host cluster, two members, and karmadactl v1.19.0",
    setup: `${GUIDES}/karmada-setup.html`, examples: `${EXAMPLES}/Karmada/index.html`,
  },
];

const ECOSYSTEM_GUIDES = [
  { id: "helm", icon: "HE", name: "Helm", version: "v4.3.1", note: "CLI; review chart compatibility", tagline: "Chart rendering, release history, upgrades, and rollback." },
  { id: "kustomize", icon: "KU", name: "Kustomize", version: "v5.8.3", note: "standalone; kubectl embeds another version", tagline: "Template-free bases, overlays, and generated configuration." },
  { id: "flux", icon: "FL", name: "Flux", version: "v2.10.0", note: "notification v1 and identity RBAC migration", tagline: "GitOps source reconciliation and declarative workload delivery." },
  { id: "envoy-gateway", icon: "EG", name: "Envoy Gateway", version: "v1.9.3", note: "match controller and CRD support", tagline: "Gateway API controller, Envoy data plane, and HTTP routing." },
  { id: "opentelemetry", icon: "OT", name: "OpenTelemetry", version: "Collector v0.164.0", note: "not the SDK, Operator, or chart version", tagline: "OTel Collector pipelines and OTLP telemetry ingestion." },
  { id: "fluent-bit", icon: "FB", name: "Fluent Bit", version: "v5.1.5", note: "application version", tagline: "Node-level container log collection and forwarding to Loki." },
  { id: "loki", icon: "LO", name: "Loki", version: "v3.7.9 / chart 20.0.3", note: "chart 20 removes bundled MinIO", tagline: "Label-based log storage, ingestion, and LogQL queries." },
  { id: "longhorn", icon: "LH", name: "Longhorn", version: "v1.13.0", note: "requires Kubernetes 1.34+", tagline: "CSI persistent storage, volume replicas, and data lifecycle." },
  { id: "velero", icon: "VE", name: "Velero", version: "v1.18.4", note: "match provider plugin; verify restores", tagline: "Object-storage backups and verified Kubernetes resource restores." },
  { id: "karpenter", icon: "KA", name: "Karpenter", version: "AWS v1.15.1", note: "AWS-specific provider release", tagline: "Provider-aware node provisioning, capacity, and consolidation." },
  { id: "kyverno", icon: "KY", name: "Kyverno", version: "v1.19.2", note: "24 security advisories addressed", tagline: "Admission policy auditing, reporting, and enforcement." },
  { id: "falco", icon: "FA", name: "Falco", version: "0.45.2", note: "match drivers and host kernel", tagline: "Kernel event monitoring and runtime security alerts." },
  { id: "trivy", icon: "TR", name: "Trivy", version: "v0.76.1", note: "security update; refresh scanner and DB", tagline: "Image vulnerability and Kubernetes manifest misconfiguration scanning." },
  { id: "coredns", icon: "DNS", name: "CoreDNS", version: "v1.15.0", note: "respect distribution-managed DNS", tagline: "Cluster service discovery, upstream forwarding, and DNS diagnostics." },
  { id: "containerd", icon: "CD", name: "containerd", version: "v2.4.2", note: "security fixes; provider-supported branch", tagline: "Container runtime configuration and node-level CRI diagnostics." },
  { id: "cri-o", icon: "CR", name: "CRI-O", version: "v1.37.2", note: "match runtime minor to Kubernetes", tagline: "Kubernetes-focused OCI runtime and node compatibility checks." },
];

TECHNOLOGIES.push(...ECOSYSTEM_GUIDES.map((guide) => ({
  ...guide,
  status: "study", statusLabel: "Study lab",
  setup: `${GUIDES}/${guide.id}-setup.html`,
  examples: `${GUIDES}/${guide.id}-setup.html#lab`, examplesLabel: "Lab",
})));

const PATHS = [
  { n: 1, title: "Web Application Deployment", desc: "Ingress, TLS with cert-manager, and your first production-ready deploy.", diff: 1, time: "2–3 weeks" },
  { n: 2, title: "Continuous Deployment & GitOps", desc: "ArgoCD Applications, AppProjects, ApplicationSets, and Image Updater.", diff: 2, time: "3–4 weeks" },
  { n: 3, title: "Advanced Networking & Service Mesh", desc: "Gateway API, Istio traffic policies, and zero-trust with Calico/Cilium.", diff: 3, time: "4–6 weeks" },
  { n: 4, title: "Observability & Monitoring", desc: "ServiceMonitors, PrometheusRules, recording rules, and alerting.", diff: 2, time: "2–3 weeks" },
  { n: 5, title: "Auto-scaling & High Availability", desc: "KEDA scalers, ScaledJobs, and canary rollouts with traffic splitting.", diff: 2, time: "2–3 weeks" },
  { n: 6, title: "Platform APIs & Multi-cluster Orchestration", desc: "Crossplane compositions and Karmada workload placement with duplicated and divided replicas.", diff: 3, time: "2–3 weeks" },
];

const VERSIONS = [
  { tool: "Kubernetes", version: "v1.37.2", status: "ok", note: "Maintained: 1.35 / 1.36 / 1.37; 1.34 EOL October 27", source: "https://github.com/kubernetes/kubernetes/releases/tag/v1.37.2" },
  ...TECHNOLOGIES.filter((t) => t.version).map((t) => ({
    tool: t.name, version: t.version, status: t.status === "retired" ? "danger" : "ok", note: t.note,
    source: t.setup,
  })),
];

const DEPRECATIONS = [
  { tool: "KEDA 2.21 token audiences", severity: "Critical fix", detail: "CVE-2026-77524 affects Vault Kubernetes auth and bound service account tokens. Review dedicated audience mappings before upgrading; Temporal and Azure Pipelines also have breaking changes." },
  { tool: "ArgoCD 3.5.6", severity: "Security", detail: "Includes critical 3.5.4 fixes. Kustomize Helm configHome is no longer honored; OCI manifests over 4 MiB are rejected. Review Helm 4 and Source Integrity migration." },
  { tool: "Istio support window", severity: "EOL", detail: "1.29 reached EOL October 15. Supported patched baselines are 1.30.7+ and 1.31.3+. Istio 1.31 supports Kubernetes 1.32–1.37." },
  { tool: "October CA distrust patches", severity: "Security", detail: "cert-manager 1.21.3, Cilium 1.20.4, Crossplane 2.4.3, and Istio 1.31.3 remove compromised eMudhra CA trust. Review release-specific fixes and certificate chains." },
  { tool: "Gateway API 1.7.0", severity: "Compatibility", detail: "HTTPRoute retries are Standard; Experimental session-persistence APIs changed. Cilium's documented lab baseline remains 1.6.3; choose CRDs by controller support." },
  { tool: "Calico 3.33", severity: "Migration", detail: "Install CRDs separately before the operator. Audit consolidated images and eBPF kernel requirements; defaultFelixConfiguration and BIRD-owned IPIP routes are deprecated." },
  { tool: "Flux 2.10", severity: "Migration", detail: "Notification APIs graduate to v1. Workload identity requires explicit token RBAC where needed. Check minimum Kubernetes patch versions before upgrading." },
  { tool: "Loki chart 20", severity: "Breaking", detail: "Bundled MinIO and its values are removed. Migrate storage on chart 19 first; chart 20 rejects unknown top-level values. Simple Scalable mode is being deprecated." },
  { tool: "Kyverno 1.19.2", severity: "Security", detail: "Addresses 24 advisories. Choose a chart with the patched application; chart and application versions differ." },
];

const EXAMPLE_FOLDERS = [
  { name: "Crossplane", emoji: "🧩", count: "4 manifests", link: `${EXAMPLES}/Crossplane/index.html` },
  { name: "Karmada", emoji: "🌍", count: "3 manifests", link: `${EXAMPLES}/Karmada/index.html` },
  { name: "ArgoCD", emoji: "🔄", count: "8 manifests", link: `${EXAMPLES}/ArgoCD/index.html` },
  { name: "Calico", emoji: "🛡️", count: "7 manifests", link: `${EXAMPLES}/Calico/index.html` },
  { name: "CertManager", emoji: "🔐", count: "4 manifests", link: `${EXAMPLES}/CertManager/index.html` },
  { name: "Cilium", emoji: "⚡", count: "3 manifests", link: `${EXAMPLES}/Cilium/index.html` },
  { name: "GatewayAPI", emoji: "🌐", count: "11 manifests", link: `${EXAMPLES}/GatewayAPI/index.html` },
  { name: "Istio", emoji: "🕸️", count: "4 manifests", link: `${EXAMPLES}/Istio/index.html` },
  { name: "KEDA", emoji: "📈", count: "6 manifests", link: `${EXAMPLES}/KEDA/index.html` },
  { name: "NginxIngress", emoji: "🪦", count: "5 manifests (retired)", link: `${EXAMPLES}/NginxIngress/index.html` },
  { name: "Prometheus", emoji: "📊", count: "3 manifests", link: `${EXAMPLES}/Prometheus/index.html` },
];

/* ---------------- Renderers ---------------- */

function renderTechGrid() {
  const grid = document.getElementById("techGrid");
  grid.innerHTML = TECHNOLOGIES.map((t) => `
    <article class="tech-card reveal" data-status="${t.status}" data-name="${t.name.toLowerCase()}" data-tagline="${t.tagline.toLowerCase()}">
      <div class="tech-card-top">
        <div class="tech-icon">${t.icon}</div>
        <span class="badge badge-${t.status === "study" ? "stable" : t.status}">${t.statusLabel}</span>
      </div>
      <h3>${t.name}</h3>
      <p class="tech-tagline">${t.tagline}</p>
      ${t.version ? `<p class="tech-version">Snapshot: <strong>${t.version}</strong> ${t.note ? `· ${t.note}` : ""}</p>` : ""}
      ${t.install ? `<div class="tech-install">
        <code>${escapeHtml(t.install)}</code>
        <button class="copy-btn" data-copy="${encodeURIComponent(t.install)}" title="Copy command" aria-label="Copy install command">⧉</button>
      </div>` : ""}
      <div class="tech-links">
        <a href="${t.setup}">Setup guide</a>
        <a href="${t.examples}">${t.examplesLabel || "Examples"}</a>
      </div>
    </article>
  `).join("");
  observeReveal(grid.querySelectorAll(".reveal"));
}

function renderPaths() {
  const list = document.getElementById("pathList");
  list.innerHTML = PATHS.map((p) => `
    <a class="path-item reveal" href="guides/study-guide.html#path-${p.n}">
      <div class="path-num">${String(p.n).padStart(2, "0")}</div>
      <div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
      <div class="path-meta">
        <span class="path-difficulty">${"★".repeat(p.diff)}${"☆".repeat(3 - p.diff)}</span>
        <span class="path-time">${p.time}</span>
        <span class="path-open">Open study path →</span>
      </div>
    </a>
  `).join("");
  observeReveal(list.querySelectorAll(".reveal"));
}

function renderVersionTable() {
  const tbody = document.querySelector("#versionTable tbody");
  tbody.innerHTML = VERSIONS.map((v) => `
    <tr>
      <td>${v.tool}</td>
      <td><code>${v.version}</code></td>
      <td><a href="${v.source}">Release / upgrade notes</a></td>
      <td><span class="${v.status === "ok" ? "ok-dot" : "warn-dot"}"></span> ${v.note || "&nbsp;"}</td>
    </tr>
  `).join("");
}

function renderDeprecations() {
  const grid = document.getElementById("deprecationGrid");
  grid.innerHTML = DEPRECATIONS.map((d) => `
    <div class="dep-card reveal">
      <div class="dep-tool">${d.tool} <span class="badge badge-attention">${d.severity}</span></div>
      <p>${d.detail}</p>
    </div>
  `).join("");
  observeReveal(grid.querySelectorAll(".reveal"));
}

function renderExamples() {
  const grid = document.getElementById("exampleGrid");
  grid.innerHTML = EXAMPLE_FOLDERS.map((e) => `
    <a class="example-card reveal" href="${e.link}">
      <span class="emoji">${e.emoji}</span>
      <div><strong>${e.name}</strong><small>${e.count}</small></div>
    </a>
  `).join("");
  observeReveal(grid.querySelectorAll(".reveal"));
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

/* ---------------- Interactivity ---------------- */

function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  const saved = localStorage.getItem("k8s-study-theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    if (current === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("k8s-study-theme", current);
  });
}

function initMobileNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function initScrollSpy() {
  const sections = ["technologies", "paths", "versions", "deprecations", "examples", "community"]
    .map((id) => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll("[data-nav]");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));
}

function initCountUp() {
  const nums = document.querySelectorAll(".stat-num");
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const duration = 900;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  nums.forEach((n) => io.observe(n));
}

function observeReveal(nodeList) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  nodeList.forEach((el) => io.observe(el));
}

function initFilters() {
  const search = document.getElementById("techSearch");
  const chips = document.querySelectorAll("#statusChips .chip");
  let activeStatus = "all";

  function applyFilters() {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll(".tech-card").forEach((card) => {
      const matchesStatus = activeStatus === "all" || card.dataset.status === activeStatus;
      const matchesQuery = !query || card.dataset.name.includes(query) || card.dataset.tagline.includes(query);
      card.classList.toggle("is-hidden", !(matchesStatus && matchesQuery));
    });
  }

  search.addEventListener("input", applyFilters);
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    activeStatus = chip.dataset.filter;
    applyFilters();
  }));
}

function initCopyButtons() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const text = decodeURIComponent(btn.dataset.copy);
    navigator.clipboard?.writeText(text).then(() => {
      const original = btn.textContent;
      btn.textContent = "✓";
      setTimeout(() => { btn.textContent = original; }, 1200);
    });
  });
}

/* ---------------- Init ---------------- */

document.addEventListener("DOMContentLoaded", () => {
  renderTechGrid();
  renderPaths();
  renderVersionTable();
  renderDeprecations();
  renderExamples();

  initThemeToggle();
  initMobileNav();
  initScrollSpy();
  initCountUp();
  initFilters();
  initCopyButtons();

  observeReveal(document.querySelectorAll(".hero .reveal, .alert-banner, .section-head, .filter-bar, .table-wrap, .callout, .community-grid"));
});
