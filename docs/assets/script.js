/* ==========================================================================
   Kubernetes Study Repository — 2026 site logic
   ========================================================================== */

const REPO = "https://github.com/YISUSVII/kubernetes-study/blob/main";
const REPO_TREE = "https://github.com/YISUSVII/kubernetes-study/tree/main";

/* ---------------- Data ---------------- */

const TECHNOLOGIES = [
  {
    id: "argocd", icon: "🔄", name: "ArgoCD", tagline: "Declarative GitOps continuous delivery for Kubernetes.",
    version: "v3.5.3", note: "Helm 4; review upgrade guide", status: "major-update", statusLabel: "Major update from v2.14",
    install: "kubectl apply --server-side -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.5.3/manifests/install.yaml",
    setup: `${REPO}/argocd-setup.md`, examples: `${REPO_TREE}/examples/ArgoCD`,
  },
  {
    id: "calico", icon: "🛡️", name: "Calico", tagline: "Network policy enforcement, including AdminNetworkPolicy.",
    version: "v3.32.2", note: "current stable", status: "stable", statusLabel: "Stable",
    install: "helm install calico projectcalico/tigera-operator -n tigera-operator --version v3.32.2",
    setup: `${REPO}/calico-setup.md`, examples: `${REPO_TREE}/examples/Calico`,
  },
  {
    id: "cert-manager", icon: "🔐", name: "cert-manager", tagline: "Automated TLS certificate issuance and renewal.",
    version: "v1.21.2", note: "security hardening and renewal fixes", status: "attention", statusLabel: "Security fix — upgrade",
    install: "helm install cert-manager jetstack/cert-manager -n cert-manager --version v1.21.2",
    setup: `${REPO}/cert-manager-setup.md`, examples: `${REPO_TREE}/examples/CertManager`,
  },
  {
    id: "cilium", icon: "⚡", name: "Cilium", tagline: "eBPF-based CNI with native Gateway API and Hubble observability.",
    version: "v1.20.2", note: "1.20 stable", status: "stable", statusLabel: "Stable",
    install: "helm install cilium cilium/cilium --version 1.20.2 -n kube-system",
    setup: `${REPO}/cilium-setup.md`, examples: `${REPO_TREE}/examples/Cilium`,
  },
  {
    id: "gateway-api", icon: "🌐", name: "Gateway API", tagline: "The role-oriented successor to Ingress: HTTPRoute, GRPCRoute, TCPRoute/UDPRoute.",
    version: "v1.6.2", note: "TCPRoute/UDPRoute now GA", status: "stable", statusLabel: "Stable",
    install: "kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.6.2/standard-install.yaml",
    setup: `${REPO}/gateway-api-setup.md`, examples: `${REPO_TREE}/examples/GatewayAPI`,
  },
  {
    id: "istio", icon: "🕸️", name: "Istio", tagline: "Full-featured service mesh: mTLS, traffic shaping, observability.",
    version: "v1.31.1", note: "was 1.24 (past EOL)", status: "major-update", statusLabel: "Multiple releases behind",
    install: "helm install istiod istio/istiod -n istio-system --version 1.31.1",
    setup: `${REPO}/istio-setup.md`, examples: `${REPO_TREE}/examples/Istio`,
  },
  {
    id: "keda", icon: "📈", name: "KEDA", tagline: "Event-driven autoscaling for Kubernetes workloads.",
    version: "v2.21.0", note: "critical token-audience fix", status: "attention", statusLabel: "Security and breaking changes",
    install: "helm install keda kedacore/keda -n keda --version 2.21.0",
    setup: `${REPO}/keda-setup.md`, examples: `${REPO_TREE}/examples/KEDA`,
  },
  {
    id: "nginx-ingress", icon: "🪦", name: "NGINX Ingress", tagline: "Classic Ingress controller — kept for historical/study reference.",
    version: "controller-v1.15.1", note: "final release", status: "retired", statusLabel: "Retired March 2026",
    install: "# Do not deploy for new projects — migrate to Gateway API",
    setup: `${REPO}/nginx-ingress-setup.md`, examples: `${REPO_TREE}/examples/NginxIngress`,
  },
  {
    id: "prometheus", icon: "📊", name: "Prometheus & Grafana", tagline: "Metrics, alerting, and dashboards via kube-prometheus-stack.",
    version: "chart 91.8.2", note: "was chart 79.9.0", status: "stable", statusLabel: "Stable",
    install: "helm install prometheus prometheus-community/kube-prometheus-stack -n monitoring --create-namespace --version 91.8.2",
    setup: `${REPO}/prometheus-grafana-setup.md`, examples: `${REPO_TREE}/examples/Prometheus`,
  },
];

const PATHS = [
  { n: 1, title: "Web Application Deployment", desc: "Ingress, TLS with cert-manager, and your first production-ready deploy.", diff: 1, time: "2–3 weeks" },
  { n: 2, title: "Continuous Deployment & GitOps", desc: "ArgoCD Applications, AppProjects, ApplicationSets, and Image Updater.", diff: 2, time: "3–4 weeks" },
  { n: 3, title: "Advanced Networking & Service Mesh", desc: "Gateway API, Istio traffic policies, and zero-trust with Calico/Cilium.", diff: 3, time: "4–6 weeks" },
  { n: 4, title: "Observability & Monitoring", desc: "ServiceMonitors, PrometheusRules, recording rules, and alerting.", diff: 2, time: "2–3 weeks" },
  { n: 5, title: "Auto-scaling & High Availability", desc: "KEDA scalers, ScaledJobs, and canary rollouts with traffic splitting.", diff: 2, time: "2–3 weeks" },
];

const VERSIONS = [
  { tool: "Kubernetes", version: "v1.37.1", status: "ok", note: "Maintained: 1.35 / 1.36 / 1.37", source: "https://kubernetes.io/releases/" },
  ...TECHNOLOGIES.map((t) => ({
    tool: t.name, version: t.version, status: t.status === "retired" ? "danger" : "ok", note: t.note,
    source: `${REPO}/DEPRECATIONS.md`,
  })),
];

const DEPRECATIONS = [
  { tool: "KEDA 2.21 token audiences", severity: "Critical fix", detail: "CVE-2026-77524 affects Vault Kubernetes auth and bound service account tokens. Review dedicated audience mappings before upgrading; Temporal and Azure Pipelines also have breaking changes." },
  { tool: "ArgoCD 3.5", severity: "Upgrade", detail: "Helm 4 changes plain HTTP OCI registry handling. AppProject signatureKeys is deprecated in favor of sourceIntegrity." },
  { tool: "Istio support window", severity: "Plan ahead", detail: "1.29 support is expected to end October 12, 2026. Istio 1.31 lists Kubernetes 1.32–1.36 as supported." },
  { tool: "cert-manager 1.21.2", severity: "Security", detail: "September patch hardens issuer responses and ambient AWS credentials and fixes renewal, webhook, and Gateway listener issues." },
  { tool: "Gateway API 1.6.2", severity: "Conformance", detail: "Redirect codes 303, 307, and 308 require Extended conformance. Check your controller's supported features." },
  { tool: "Cilium 1.20", severity: "Stable release", detail: "1.20 is now stable; 1.20.2 includes networking and policy fixes. Review minor upgrade requirements before replacing a CNI." },
];

const EXAMPLE_FOLDERS = [
  { name: "ArgoCD", emoji: "🔄", count: "8 manifests", link: `${REPO_TREE}/examples/ArgoCD` },
  { name: "Calico", emoji: "🛡️", count: "7 manifests", link: `${REPO_TREE}/examples/Calico` },
  { name: "CertManager", emoji: "🔐", count: "4 manifests", link: `${REPO_TREE}/examples/CertManager` },
  { name: "Cilium", emoji: "⚡", count: "3 manifests", link: `${REPO_TREE}/examples/Cilium` },
  { name: "GatewayAPI", emoji: "🌐", count: "11 manifests", link: `${REPO_TREE}/examples/GatewayAPI` },
  { name: "Istio", emoji: "🕸️", count: "4 manifests", link: `${REPO_TREE}/examples/Istio` },
  { name: "KEDA", emoji: "📈", count: "6 manifests", link: `${REPO_TREE}/examples/KEDA` },
  { name: "NginxIngress", emoji: "🪦", count: "5 manifests (retired)", link: `${REPO_TREE}/examples/NginxIngress` },
  { name: "Prometheus", emoji: "📊", count: "3 manifests", link: `${REPO_TREE}/examples/Prometheus` },
];

/* ---------------- Renderers ---------------- */

function renderTechGrid() {
  const grid = document.getElementById("techGrid");
  grid.innerHTML = TECHNOLOGIES.map((t) => `
    <article class="tech-card reveal" data-status="${t.status}" data-name="${t.name.toLowerCase()}" data-tagline="${t.tagline.toLowerCase()}">
      <div class="tech-card-top">
        <div class="tech-icon">${t.icon}</div>
        <span class="badge badge-${t.status}">${t.statusLabel}</span>
      </div>
      <h3>${t.name}</h3>
      <p class="tech-tagline">${t.tagline}</p>
      <p class="tech-version">Latest: <strong>${t.version}</strong> ${t.note ? `· ${t.note}` : ""}</p>
      <div class="tech-install">
        <code>${escapeHtml(t.install)}</code>
        <button class="copy-btn" data-copy="${encodeURIComponent(t.install)}" title="Copy command" aria-label="Copy install command">⧉</button>
      </div>
      <div class="tech-links">
        <a href="${t.setup}" target="_blank" rel="noopener">Setup guide</a>
        <a href="${t.examples}" target="_blank" rel="noopener">Examples</a>
      </div>
    </article>
  `).join("");
  observeReveal(grid.querySelectorAll(".reveal"));
}

function renderPaths() {
  const list = document.getElementById("pathList");
  list.innerHTML = PATHS.map((p) => `
    <div class="path-item reveal">
      <div class="path-num">${String(p.n).padStart(2, "0")}</div>
      <div>
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
      <div class="path-meta">
        <span class="path-difficulty">${"★".repeat(p.diff)}${"☆".repeat(3 - p.diff)}</span>
        <span class="path-time">${p.time}</span>
      </div>
    </div>
  `).join("");
  observeReveal(list.querySelectorAll(".reveal"));
}

function renderVersionTable() {
  const tbody = document.querySelector("#versionTable tbody");
  tbody.innerHTML = VERSIONS.map((v) => `
    <tr>
      <td>${v.tool}</td>
      <td><code>${v.version}</code></td>
      <td><a href="${v.source}" target="_blank" rel="noopener">Release / upgrade notes</a></td>
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
    <a class="example-card reveal" href="${e.link}" target="_blank" rel="noopener">
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
