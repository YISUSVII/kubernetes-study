# Kubernetes Learning Journey: Complete Study Guide

Welcome to your comprehensive Kubernetes study guide! This resource is designed to help you learn Kubernetes administration, networking, and deployment patterns at your own pace. All examples reference actual YAML files in the `examples/` directory.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Learning Paths](#learning-paths)
3. [Core Concepts](#core-concepts)
4. [Technologies Deep Dive](#technologies-deep-dive)
5. [Practical Exercises](#practical-exercises)
6. [Best Practices](#best-practices)
7. [Troubleshooting Guide](#troubleshooting-guide)
8. [Resources](#resources)

---

## Getting Started

### Prerequisites
- Kubernetes cluster (v1.35/v1.36 study baseline; check add-on support before using v1.37)
- `kubectl` installed and configured (use the same minor as your cluster)
- Docker or container runtime knowledge
- Basic understanding of networking concepts

### Your Learning Environment

```
Kubernetes/
├── setup guides/          # Detailed installation guides
├── examples/              # Practical YAML examples
│   ├── ArgoCD/           # GitOps examples
│   ├── CertManager/      # TLS certificate examples
│   ├── Calico/           # Network security examples
│   ├── GatewayAPI/       # Modern ingress examples
│   ├── Istio/            # Service mesh examples
│   ├── KEDA/             # Auto-scaling examples
│   ├── NginxIngress/     # Traditional ingress examples
│   ├── Prometheus/       # Monitoring examples
│   └── README.md         # Quick reference
└── kubernetes-admin-tools-reference.md
```

### How to Use This Guide

- **Reading Phase**: Start with the concept explanations below
- **Reference Phase**: Refer to setup guides for detailed information
- **Hands-On Phase**: Apply examples from the `examples/` directory
- **Practice Phase**: Complete exercises at the end of each section
- **Review Phase**: Revisit concepts periodically

---

## Learning Paths

### Path 1: Web Application Deployment (Beginner)
**Time: 2-3 weeks | Difficulty: ⭐**

This path teaches you to deploy a web application with external access.

1. **Week 1: Ingress & Networking**
   - Study: `NginxIngress/` examples
   - Learn: `nginx-ingress-setup.md`
   - Practice: Deploy a simple web app with Nginx Ingress
   - Reference: `NginxIngress/01-ingress-simple-http.yaml`

2. **Week 2: TLS & Security**
   - Study: `CertManager/` examples
   - Learn: `cert-manager-setup.md`
   - Practice: Add HTTPS to your deployment
   - Reference: `CertManager/03-clusterissuer-letsencrypt-prod.yaml`

3. **Week 3: Review & Polish**
   - Combine concepts
   - Add monitoring basics
   - Deploy production-ready application

---

### Path 2: Continuous Deployment & GitOps (Intermediate)
**Time: 3-4 weeks | Difficulty: ⭐⭐**

This path teaches you to automate deployments using Git.

1. **Week 1-2: ArgoCD Fundamentals**
   - Study: `ArgoCD/` examples starting with `01-basic-app.yaml`
   - Learn: `argocd-setup.md`
   - Practice: Deploy an application via ArgoCD
   - Reference: Follow `01` → `02` → `03` progression

2. **Week 2-3: Multi-Environment GitOps**
   - Study: `ArgoCD/04-appproject-team-a.yaml`
   - Practice: Manage staging and production
   - Reference: `argocd-setup.md` - AppProject section

3. **Week 3-4: Integration & Monitoring**
   - Study: `ArgoCD/05-notifications-cm.yaml` and `06-servicemonitor-metrics.yaml`
   - Practice: Add alerting and monitoring
   - Reference: Combine with Prometheus examples

---

### Path 3: Advanced Networking & Service Mesh (Advanced)
**Time: 4-6 weeks | Difficulty: ⭐⭐⭐**

This path teaches you service mesh and advanced traffic management.

1. **Week 1: Gateway API (Modern Ingress)**
   - Study: `GatewayAPI/01-gatewayclass.yaml` → `03-httproute-basic.yaml`
   - Learn: `gateway-api-setup.md` - Core concepts
   - Practice: Migrate from Ingress to Gateway API
   - Reference: Compare with `NginxIngress/` examples

2. **Week 2: Advanced Routing**
   - Study: `GatewayAPI/04-httproute-header-matching.yaml`
   - Study: `GatewayAPI/05-httproute-traffic-splitting.yaml`
   - Practice: Implement canary deployments
   - Reference: Header matching and traffic splitting sections

3. **Week 3-4: Service Mesh (Istio)**
   - Study: `Istio/01-virtualservice-basic.yaml` and `02-gateway-basic.yaml`
   - Learn: `istio-setup.md` - VirtualService and Gateway sections
   - Practice: Deploy services with traffic policies
   - Reference: Kiali dashboard visualization

4. **Week 5-6: Network Security**
   - Study: `Calico/` examples (start with `01-networkpolicy-deny-all.yaml`)
   - Learn: `calico-setup.md` - Network policies section
   - Practice: Implement zero-trust networking
   - Reference: Build from deny-all → allow specific traffic

---

### Path 4: Observability & Monitoring (Intermediate)
**Time: 2-3 weeks | Difficulty: ⭐⭐**

This path teaches you to monitor your cluster.

1. **Week 1: Prometheus & Grafana**
   - Study: `Prometheus/` examples
   - Learn: `prometheus-grafana-setup.md`
   - Practice: Monitor a sample application
   - Reference: `Prometheus/01-servicemonitor-basic.yaml`

2. **Week 2: Alerting**
   - Study: `Prometheus/02-prometheusrule-alerts.yaml`
   - Practice: Create and test alerts
   - Reference: Alert rules section in setup guide

3. **Week 3: Integration**
   - Combine with ArgoCD metrics: `ArgoCD/06-servicemonitor-metrics.yaml`
   - Monitor your deployments
   - Create custom dashboards

---

### Path 5: Auto-scaling & High Availability (Intermediate)
**Time: 2-3 weeks | Difficulty: ⭐⭐**

This path teaches you to scale applications automatically.

1. **Week 1: KEDA Basics**
   - Study: `KEDA/01-scaledobject-cpu.yaml` and `02-scaledobject-memory.yaml`
   - Learn: `keda-setup.md` - Scalers section
   - Practice: Scale based on CPU/Memory
   - Reference: Start with basic scalers

2. **Week 2: Event-Driven Scaling**
   - Study: `KEDA/03-scaledobject-prometheus.yaml`
   - Study: `KEDA/04-scaledobject-kafka.yaml`
   - Practice: Scale based on custom metrics
   - Reference: Advanced scalers section

3. **Week 3: Production Patterns**
   - Combine with Istio canary deployments
   - Reference: `GatewayAPI/05-httproute-traffic-splitting.yaml`
   - Practice: Blue-green and canary deployments

---

### Path 6: Platform APIs & Multi-cluster Orchestration (Advanced)

**Prerequisites:** Kubernetes CRDs/RBAC, Helm, and basic GitOps. Start with the single-cluster Crossplane lab, then prepare a Karmada host and two member clusters.

1. Follow [Crossplane setup](crossplane-setup.md) to install the controller and Function, define a namespaced AppConfig API, and compose a ConfigMap.
2. Change the request's message and verify reconciliation. Explain the roles of the XRD, Composition, Function, and composite resource.
3. Follow [Karmada setup](karmada-setup.md) to register members and propagate a Deployment and Service.
4. Replace duplicated replica scheduling with divided scheduling and compare desired replica counts in both members.
5. Explain how ArgoCD can deliver declarations to these control planes and why placement alone does not provide global traffic routing.

**Success criteria:** a reconciled ConfigMap, two Ready Karmada members, and observed replica counts matching both placement policies. Delete lab requests before removing their controllers or permissions.

---

## Core Concepts

### 1. Kubernetes Networking Fundamentals

#### The OSI Model in Kubernetes
```
Layer 7 (Application)      ← HTTPRoute, GRPCRoute (Gateway API)
Layer 6 (Presentation)     ← TLS/mTLS (Cert-Manager, Istio)
Layer 5 (Session)          ← Connection management
Layer 4 (Transport)        ← TCP/UDP (Service, Ingress)
Layer 3 (Network)          ← IP routing (CNI, Calico)
Layer 2 (Data Link)        ← MAC addresses
Layer 1 (Physical)         ← Network hardware
```

**Study Exercise**: 
- Read: `gateway-api-setup.md` - "Core Concepts"
- Compare: How Ingress (L7) differs from Gateway API (L7 enhanced)
- Reference: `NginxIngress/01-ingress-simple-http.yaml` vs `GatewayAPI/03-httproute-basic.yaml`

#### Traffic Flow Patterns

**North-South Traffic** (External → Internal)
- What: Traffic from outside cluster to services inside
- How: Ingress, Gateway API, or Service LoadBalancer
- Examples: `NginxIngress/`, `GatewayAPI/`, `Istio/02-gateway-basic.yaml`
- Study: Trace the request path in `gateway-api-setup.md` - "Request flow"

**East-West Traffic** (Service → Service)
- What: Inter-service communication within cluster
- How: Service DNS, service mesh (Istio), network policies
- Examples: `Istio/01-virtualservice-basic.yaml`, `Calico/`
- Study: Compare direct calls vs service mesh in `istio-setup.md`

---

### 2. Ingress Evolution

#### Generation 1: Traditional Ingress
**Status**: Stable but limited  
**Best for**: Simple HTTP/HTTPS routing  

```yaml
# Legacy approach - Ingress with annotations
# See: NginxIngress/01-ingress-simple-http.yaml
# Limitation: Complex features need annotations
```

**Key limitations**:
- No native traffic splitting
- No header matching beyond regex
- Flat resource model
- Rate limiting via annotations

**Study**: 
- Read: `nginx-ingress-setup.md` - First section
- Example: `NginxIngress/05-ingress-advanced.yaml` - Shows annotation complexity

#### Generation 2: Gateway API (Current Best Practice)
**Status**: Stable and recommended  
**Best for**: Production Kubernetes clusters  

```yaml
# Modern approach - Role-oriented, expressive
# See: GatewayAPI/01-gatewayclass.yaml → 03-httproute-basic.yaml
# Advantages: No annotations, native features, role-based
```

**Key improvements**:
- Native traffic splitting
- Header and query param matching
- Role-oriented (Infrastructure Provider, Operator, Developer)
- Protocol-aware (HTTP, HTTPS, gRPC, TCP, UDP)
- Cross-namespace with ReferenceGrant

**Study**:
- Read: `gateway-api-setup.md` - "Key Differences from Ingress"
- Example: Progression from `GatewayAPI/03-httproute-basic.yaml` to `05-httproute-traffic-splitting.yaml`
- Compare: See both approaches side-by-side in `gateway-api-setup.md` - "Migrating from Ingress"

**Exercise**:
1. Deploy using Ingress: `NginxIngress/01-ingress-simple-http.yaml`
2. Deploy using Gateway API: `GatewayAPI/03-httproute-basic.yaml`
3. Notice the differences in resource structure and capabilities

---

### 3. Security Layers

#### Layer 1: Network Policies (Firewall)
**Purpose**: Control traffic at Pod level  
**Tool**: Calico (or any CNI with NetworkPolicy support)  

```yaml
# Start: Deny all traffic
# See: Calico/01-networkpolicy-deny-all.yaml

# Then: Selectively allow
# See: Calico/02-networkpolicy-allow-namespace.yaml
```

**Learning sequence**:
1. Understand concept: Read `calico-setup.md` - "Network Policy Examples"
2. Apply deny-all: `Calico/01-networkpolicy-deny-all.yaml`
3. Test with pods: See troubleshooting section
4. Add allow rules: `Calico/02-networkpolicy-allow-namespace.yaml`
5. Advanced: `Calico/05-globalnetworkpolicy.yaml` - Cluster-wide policies

**Key concepts**:
- **podSelector**: Which pods this policy applies to
- **policyTypes**: Ingress (incoming) or Egress (outgoing)
- **from/to**: Source/destination selectors
- **ports**: Protocol and port numbers

**Study Exercise**:
- Create a test deployment
- Apply `Calico/01-networkpolicy-deny-all.yaml`
- Observe that nothing can reach the pod
- Gradually add allow rules
- Understand the principle of least privilege

#### Layer 2: mTLS (Encryption)
**Purpose**: Encrypt and authenticate service-to-service communication  
**Tool**: Istio or Cert-Manager + Istio  

```yaml
# See: istio-setup.md - "Advanced" section
# Istio automatically handles certificate rotation
```

**Learning sequence**:
1. Understand certificate management: `cert-manager-setup.md` - Introduction
2. See how Istio uses certificates: `istio-setup.md` - Encryption section
3. Compare Istio mTLS vs manual cert management

#### Layer 3: RBAC (Authorization)
**Purpose**: Control who can do what  
**Tool**: Kubernetes native RBAC  

```yaml
# See: gateway-api-setup.md - "Role-Based Access Control"
# Infrastructure Provider, Cluster Operator, Developer roles
```

---

### 4. Deployment Patterns

#### Pattern 1: Blue-Green Deployment
**Purpose**: Zero-downtime deployments  
**How it works**: Keep two identical production environments, switch traffic

```yaml
# See: GatewayAPI/05-httproute-traffic-splitting.yaml
# Set weights: stable=100, canary=0 initially
# Then: stable=0, canary=100 after verification
```

**Learning steps**:
1. Read: `gateway-api-setup.md` - "Traffic Splitting" section
2. Study: `GatewayAPI/05-httproute-traffic-splitting.yaml` - Understand weight field
3. Practice: Deploy v1 and v2, switch traffic 100→0 and 0→100

#### Pattern 2: Canary Deployment
**Purpose**: Gradual rollout to catch issues early  
**How it works**: Send small percentage of traffic to new version

```yaml
# See: GatewayAPI/05-httproute-traffic-splitting.yaml
# Example: stable=90%, canary=10%
# Gradually increase: 90→80, 80→70, etc.
```

**Learning steps**:
1. Read: `keda-setup.md` - Monitor canary deployment health
2. Study: Combine `GatewayAPI/05` with `Prometheus/02-prometheusrule-alerts.yaml`
3. Practice: Set up alerts for canary health metrics

#### Pattern 3: Rolling Deployment
**Purpose**: Update one pod at a time  
**How it works**: Native Kubernetes - updates pods in sequence

```yaml
# See: ArgoCD examples
# ArgoCD can manage rolling updates through Git
```

**Learning steps**:
1. Read: `argocd-setup.md` - Sync policies section
2. Understand: How ArgoCD manages progressive deployments

---

### 5. GitOps Philosophy

#### Core Principles

**Principle 1: Git as Single Source of Truth**
- What: All infrastructure described in Git
- Why: Auditable, version-controlled, reproducible
- How: ArgoCD watches Git, applies changes automatically

**Principle 2: Declarative Configuration**
- What: Describe desired state, not how to achieve it
- Why: Kubernetes handles the "how"
- How: Use YAML manifests

**Principle 3: Continuous Reconciliation**
- What: System constantly ensures actual state matches desired state
- Why: Self-healing, automatic recovery
- How: ArgoCD continuously compares Git vs cluster

**Study Exercise**:
```bash
1. Study: ArgoCD/01-basic-app.yaml (basic structure)
2. Read: argocd-setup.md - "Best Practices" section
3. Understand: syncPolicy.automated fields
   - prune: true (delete resources not in Git)
   - selfHeal: true (revert manual changes)
```

#### Implementing GitOps

**Repository Structure**:
```
myrepo/
├── base/                    # Shared configurations
│   ├── deployment.yaml
│   └── service.yaml
├── overlays/
│   ├── dev/
│   │   └── kustomization.yaml
│   ├── staging/
│   │   └── kustomization.yaml
│   └── production/
│       └── kustomization.yaml
└── argocd/
    ├── dev-app.yaml         # ArgoCD Application resource
    ├── staging-app.yaml
    └── prod-app.yaml
```

**Study**:
- Read: `argocd-setup.md` - "Application Examples" section
- Compare: `ArgoCD/01-basic-app.yaml` (simple) vs `03-kustomize-app.yaml` (complex)
- Understand: How Kustomize overlays work

---

## Technologies Deep Dive

### Gateway API - Modern Ingress (Recommended for New Projects)

#### Why Gateway API?

**Comparison Table**:
```
Feature                  Ingress    Gateway API
─────────────────────────────────────────────────
Traffic Splitting        Via code   Native ✓
Header Matching          Via regex  Native ✓
Rate Limiting            Via anno   Via policies ✓
Role-Oriented Design     No         Yes ✓
Cross-Namespace Support  Limited    Full ✓
Protocol Support         HTTP/HTTPS HTTP/HTTPS/gRPC/TCP/UDP ✓
```

#### Learning Progression

**Level 1: Basic Routing**
```yaml
# Learn: How traffic flows from outside to service
# Study: GatewayAPI/01-gatewayclass.yaml
#        GatewayAPI/02-gateway-basic.yaml
#        GatewayAPI/03-httproute-basic.yaml
# Understand: 3 resources, 3 roles, hierarchical
```

**Level 2: Advanced Matching**
```yaml
# Learn: Route based on headers, paths, hostnames
# Study: GatewayAPI/04-httproute-header-matching.yaml
# Practice: Deploy with multiple routing rules
```

**Level 3: Traffic Control**
```yaml
# Learn: Split traffic for canary deployments
# Study: GatewayAPI/05-httproute-traffic-splitting.yaml
# Learn: Redirect traffic between domains
# Study: GatewayAPI/06-httproute-redirects.yaml
```

**Level 4: Advanced Features**
```yaml
# Learn: Modify headers, implement gRPC
# Study: GatewayAPI/07-httproute-header-modifications.yaml
#        GatewayAPI/08-grpcroute.yaml
# Learn: Cross-namespace routing
# Study: GatewayAPI/09-referencegrant.yaml
```

#### Implementation Example

**Scenario**: Deploy a web app with multiple services

```yaml
# Step 1: Define Gateway (who controls the traffic handler)
# File: GatewayAPI/02-gateway-basic.yaml
# Concepts: Class, listeners, TLS

# Step 2: Define Routes (who gets to use the gateway)
# File: GatewayAPI/03-httproute-basic.yaml
# Concepts: Parent refs, host matching, backend services

# Step 3: Add advanced features
# File: GatewayAPI/04-httproute-header-matching.yaml
# Concepts: Match rules, conditional routing

# Step 4: Deploy and test
# Commands: kubectl apply -f, kubectl get gateway/httproute
```

---

### ArgoCD - GitOps Continuous Deployment

#### Why ArgoCD?

**Traditional Deployment Flow** ❌
```
Developer → Git Push → CI/CD Pipeline → Kubectl Apply
                       ↑
                  Separate system
```

**GitOps Flow with ArgoCD** ✓
```
Developer → Git Push → ArgoCD Watches Git → Kubectl Apply
                       ↑                     ↑
                    In-cluster          Automated
```

#### Learning Progression

**Level 1: Basic Deployment**
```yaml
# Learn: Deploy application from Git repository
# Study: ArgoCD/01-basic-app.yaml
# Concepts: Project, source, destination, sync policy
```

**Level 2: Helm Integration**
```yaml
# Learn: Deploy Helm charts via ArgoCD
# Study: ArgoCD/02-helm-app.yaml
# Concepts: Release name, values, Helm integration
```

**Level 3: Kustomize Overlays**
```yaml
# Learn: Manage multiple environments
# Study: ArgoCD/03-kustomize-app.yaml
# Concepts: Environment-specific configurations
```

**Level 4: Multi-Tenancy**
```yaml
# Learn: Manage multiple teams
# Study: ArgoCD/04-appproject-team-a.yaml
# Concepts: AppProject, namespace restrictions, source repos
```

**Level 5: Observability**
```yaml
# Learn: Monitor ArgoCD and applications
# Study: ArgoCD/05-notifications-cm.yaml
#        ArgoCD/06-servicemonitor-metrics.yaml
# Concepts: Notifications, Prometheus integration
```

#### Implementation Example

**Scenario**: Deploy 3 environments (dev, staging, prod) using GitOps

```yaml
# Step 1: Install ArgoCD
# Read: argocd-setup.md - Installation section

# Step 2: Create repository secret
# Read: argocd-setup.md - Repository Credentials section

# Step 3: Create applications for each environment
# Deploy: ArgoCD/01-basic-app.yaml (dev)
#         ArgoCD/02-helm-app.yaml (staging)
#         ArgoCD/03-kustomize-app.yaml (prod)

# Step 4: Add monitoring
# Deploy: ArgoCD/06-servicemonitor-metrics.yaml

# Step 5: Monitor via Prometheus/Grafana
# See: prometheus-grafana-setup.md
```

---

### Certificate Management - TLS Automation

#### Why Cert-Manager?

**Problem**: Manual TLS certificate management is error-prone
- Expires without warning
- Manual renewal process
- Hard to track across services

**Solution**: Cert-Manager automates everything

#### Learning Progression

**Level 1: Self-Signed Certificates (Testing)**
```yaml
# Learn: Create certificates for testing
# Study: CertManager/01-issuer-selfsigned.yaml
# Use: Development environments only
```

**Level 2: Let's Encrypt (Free, Real Certificates)**
```yaml
# Learn: Get real certificates from Let's Encrypt
# Study: CertManager/02-issuer-letsencrypt-staging.yaml
# Use: Test with staging first, then production
```

**Level 3: Production Certificates**
```yaml
# Learn: Automatic production certificates
# Study: CertManager/03-clusterissuer-letsencrypt-prod.yaml
# Use: Production workloads
```

**Level 4: Certificate Management**
```yaml
# Learn: Explicit certificate resources
# Study: CertManager/04-certificate.yaml
# Concepts: Duration, renewal periods, DNS names
```

#### Integration Points

```yaml
# Cert-Manager integrates with:
# 1. Ingress - via annotations
#    See: nginx-ingress-setup.md - "Cert-Manager integration"
#    Example: cert-manager.io/cluster-issuer annotation

# 2. Gateway API - via certificateRefs
#    See: GatewayAPI/02-gateway-basic.yaml
#    Example: spec.listeners[].tls.certificateRefs

# 3. Service accounts - for mTLS
#    See: istio-setup.md - "mTLS" section
```

---

### Networking Security - Calico Network Policies

#### Why Network Policies?

**Principle**: Zero-Trust Networking
- Deny all by default
- Allow only necessary traffic
- Treat internal network like external internet

#### Learning Progression

**Level 1: Deny All (Foundation)**
```yaml
# Learn: Block all traffic by default
# Study: Calico/01-networkpolicy-deny-all.yaml
# Concepts: podSelector, policyTypes, Ingress
# Practice: Apply and see everything blocked
```

**Level 2: Allow Specific Sources**
```yaml
# Learn: Allow traffic from specific namespaces
# Study: Calico/02-networkpolicy-allow-namespace.yaml
# Concepts: namespaceSelector, from rules
# Practice: Gradually allow necessary traffic
```

**Level 3: Pod-to-Pod Communication**
```yaml
# Learn: Allow specific pod-to-pod connections
# Study: Calico/03-networkpolicy-pod-to-pod.yaml (referenced)
# Concepts: podSelector in ingress rules
```

**Level 4: Egress Control**
```yaml
# Learn: Control outgoing traffic
# Study: Calico/04-networkpolicy-egress-dns.yaml
# Concepts: Egress policies, DNS access control
# Practice: Allow DNS but restrict other outbound
```

**Level 5: Cluster-Wide Policies**
```yaml
# Learn: GlobalNetworkPolicy for cluster admin control
# Study: Calico/05-globalnetworkpolicy.yaml
# Concepts: Global scope, priority-based rules
```

#### Implementation Strategy

**Step 1: Audit Current Traffic**
```bash
# What traffic currently flows?
# Use Kubernetes events and logs
```

**Step 2: Implement Deny-All**
```bash
# Deploy: Calico/01-networkpolicy-deny-all.yaml
# Result: Nothing works initially (expected)
```

**Step 3: Whitelist Traffic**
```bash
# For each needed connection, create allow rule
# Use: Calico/02-networkpolicy-allow-namespace.yaml as template
```

**Step 4: Test and Iterate**
```bash
# Test connectivity between pods
# Adjust rules as needed
# Document each rule's purpose
```

---

### KEDA - Event-Driven Auto-Scaling

#### Why KEDA?

**Limitation of Default HPA**: Only CPU and Memory

```
Default HPA:
  If CPU > 70%
    → Add more pods
  
KEDA:
  If Kafka lag > 1000 messages
    → Add more consumers
  If HTTP requests/sec > 100
    → Add more pods
  If RabbitMQ queue depth > 50
    → Add more workers
```

#### Learning Progression

**Level 1: CPU-Based Scaling**
```yaml
# Learn: Scale based on CPU (like default HPA, but via KEDA)
# Study: KEDA/01-scaledobject-cpu.yaml
# Concepts: ScaledObject, trigger types, min/max replicas
```

**Level 2: Memory-Based Scaling**
```yaml
# Learn: Scale based on memory usage
# Study: KEDA/02-scaledobject-memory.yaml
# Concepts: Different metric, same pattern
```

**Level 3: Custom Metrics (Prometheus)**
```yaml
# Learn: Scale based on application metrics
# Study: KEDA/03-scaledobject-prometheus.yaml
# Concepts: Query-based scaling, custom thresholds
# Example: Scale on HTTP requests per second
```

**Level 4: Event-Driven (Kafka)**
```yaml
# Learn: Scale based on external events
# Study: KEDA/04-scaledobject-kafka.yaml
# Concepts: Message lag, consumer groups
# Use Case: Handle message queue backlogs
```

#### Implementation Example

**Scenario**: Auto-scale API based on request rate

```yaml
# Step 1: Install KEDA and Prometheus
# Read: keda-setup.md - Installation

# Step 2: Create Prometheus metric
# Deploy: Prometheus/01-servicemonitor-basic.yaml

# Step 3: Create scaling policy
# Deploy: KEDA/03-scaledobject-prometheus.yaml
# Customize: Query for your application

# Step 4: Test
# Generate load
# Watch pods scale up/down
```

---

### Monitoring & Observability - Prometheus & Grafana

#### Why Monitoring?

**The Four Golden Signals** (Google SRE):
1. **Latency** - How long does a request take?
2. **Traffic** - How many requests?
3. **Errors** - What percentage fail?
4. **Saturation** - How full is the system?

#### Learning Progression

**Level 1: Metrics Collection**
```yaml
# Learn: Scrape metrics from applications
# Study: Prometheus/01-servicemonitor-basic.yaml
# Concepts: ServiceMonitor, scrape intervals, endpoints
```

**Level 2: Alerting Rules**
```yaml
# Learn: Define alerts based on metrics
# Study: Prometheus/02-prometheusrule-alerts.yaml
# Concepts: Alert expressions, thresholds, annotations
# Example: Alert if memory > 90%
```

**Level 3: Visualization**
```yaml
# Learn: Create dashboards in Grafana
# Read: prometheus-grafana-setup.md - Access Grafana section
# Practice: Create dashboard showing your application health
```

**Level 4: Integration**
```yaml
# Learn: Monitor the monitoring stack itself
# Study: ArgoCD/06-servicemonitor-metrics.yaml
# Concepts: Monitor ArgoCD health and performance
```

#### Key Metrics to Monitor

```yaml
# Application Metrics
- http_requests_total         # Request count
- http_request_duration_seconds # Latency
- container_memory_usage_bytes # Memory usage
- container_cpu_usage_seconds # CPU usage

# Infrastructure Metrics
- node_cpu_usage              # Node CPU
- node_memory_free            # Node memory
- disk_usage_percent          # Disk space
- network_bytes_received      # Network I/O

# Custom Metrics
- business_metric (defined by app)
```

---

## Practical Exercises

### Exercise Set 1: Web Application Deployment

**Objective**: Deploy a web app accessible from the internet with HTTPS

**Time**: 2-3 hours | **Difficulty**: Beginner

**Step 1: Deploy Application**
```bash
# Create namespace
kubectl create namespace webapp

# Deploy simple web server
kubectl run web-server --image=nginx:latest \
  --labels=app=web \
  -n webapp

# Expose as service
kubectl expose pod web-server --port=80 --type=ClusterIP -n webapp
```

**Step 2: Expose via Ingress (Traditional Approach)**
```bash
# Apply example
kubectl apply -f examples/NginxIngress/01-ingress-simple-http.yaml

# Verify
kubectl get ingress -n default
```

**Step 3: Add HTTPS with Cert-Manager**
```bash
# Apply certificate issuer
kubectl apply -f examples/CertManager/03-clusterissuer-letsencrypt-prod.yaml

# Update ingress to use TLS (create new manifest based on 02-ingress-https.yaml)
```

**Step 4: Verify**
```bash
# Check certificate
kubectl get certificate -A

# Check ingress status
kubectl describe ingress <name>

# Test access
curl -k https://your-domain.com
```

**Learning Outcomes**:
- ✓ Understand Ingress resource structure
- ✓ Know how Cert-Manager integrates with Ingress
- ✓ Can troubleshoot certificate issues
- ✓ Familiar with TLS configuration

---

### Exercise Set 2: GitOps Deployment

**Objective**: Deploy and manage applications using ArgoCD

**Time**: 3-4 hours | **Difficulty**: Intermediate

**Step 1: Install ArgoCD**
```bash
# Follow: argocd-setup.md - Installation section
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

**Step 2: Create Git Repository**
```bash
# Create Git repo with structure:
# manifests/
#   ├── deployment.yaml
#   ├── service.yaml
#   └── ingress.yaml

# Push to GitHub
```

**Step 3: Create ArgoCD Application**
```bash
# Apply: examples/ArgoCD/01-basic-app.yaml
# Customize:
# - repoURL: Your GitHub repo
# - targetRevision: Your branch
# - path: manifests/

kubectl apply -f custom-app.yaml
```

**Step 4: Test GitOps Workflow**
```bash
# Modify manifest in Git
git push

# ArgoCD should sync automatically (or manually: argocd app sync <name>)

# Verify pod updated
kubectl get pods -w
```

**Step 5: Add Multi-Environment**
```bash
# Create staging and production overlays
# Deploy separate applications for each

# Reference: ArgoCD/03-kustomize-app.yaml
```

**Learning Outcomes**:
- ✓ Understand GitOps principles
- ✓ Can manage multiple environments
- ✓ Know how to structure Git repos
- ✓ Comfortable with ArgoCD workflows

---

### Exercise Set 3: Network Policies

**Objective**: Implement zero-trust networking with Calico

**Time**: 2-3 hours | **Difficulty**: Intermediate

**Step 1: Install Calico (if not already installed)**
```bash
# Follow: calico-setup.md - Installation section
```

**Step 2: Create Test Namespace**
```bash
kubectl create namespace policy-test
kubectl label namespace policy-test name=policy-test
```

**Step 3: Deny All**
```bash
# Apply: examples/Calico/01-networkpolicy-deny-all.yaml
kubectl apply -f examples/Calico/01-networkpolicy-deny-all.yaml
```

**Step 4: Test - Verify Blocked**
```bash
# Deploy test pods
kubectl run client --image=nicolaka/netshoot -n policy-test
kubectl run server --image=nginx -n policy-test

# Try to connect (should fail)
kubectl exec -it client -n policy-test -- curl server:80
# Result: timeout (connection blocked) ✓
```

**Step 5: Allow Specific Traffic**
```bash
# Deploy: examples/Calico/02-networkpolicy-allow-namespace.yaml
# Customize for your setup

# Test again (should work now)
kubectl exec -it client -n policy-test -- curl server:80
# Result: HTML response ✓
```

**Step 6: Advanced Policies**
```bash
# Add egress policies: examples/Calico/04-networkpolicy-egress-dns.yaml
# Test DNS works but other outbound doesn't
```

**Learning Outcomes**:
- ✓ Understand network policy structure
- ✓ Know how to implement zero-trust
- ✓ Can troubleshoot connectivity issues
- ✓ Comfortable with selectors and matchers

---

### Exercise Set 4: Canary Deployment

**Objective**: Deploy new version to small percentage of users

**Time**: 2-3 hours | **Difficulty**: Advanced

**Step 1: Deploy Stable Version**
```bash
# Deploy application version 1.0
kubectl create deployment myapp-stable --image=myapp:1.0
kubectl expose deployment myapp-stable --port=8080 --type=ClusterIP
```

**Step 2: Deploy Canary Version**
```bash
# Deploy application version 2.0
kubectl create deployment myapp-canary --image=myapp:2.0
kubectl expose deployment myapp-canary --port=8080 --type=ClusterIP
```

**Step 3: Create Traffic Split**
```bash
# Apply: examples/GatewayAPI/05-httproute-traffic-splitting.yaml
# Customize:
# - stable service: myapp-stable:8080 (weight: 90)
# - canary service: myapp-canary:8080 (weight: 10)

kubectl apply -f custom-traffic-split.yaml
```

**Step 4: Monitor**
```bash
# Generate traffic
# Watch for errors in canary deployment

# View current traffic split
kubectl describe httproute myapp-route
```

**Step 5: Gradual Rollout**
```bash
# Monitor metrics for 30 minutes
# If healthy: canary-weight 10 → 25
# If healthy: canary-weight 25 → 50
# If healthy: canary-weight 50 → 75
# If healthy: canary-weight 75 → 100
# Finally: Remove stable deployment
```

**Learning Outcomes**:
- ✓ Understand traffic splitting
- ✓ Know how to implement canary deployments
- ✓ Can monitor deployment health
- ✓ Comfortable with gradual rollouts

---

## Best Practices

### 1. Namespace Organization

**Pattern**:
```
Platform Namespaces (Cluster Admin)
├── kube-system          # Kubernetes core
├── kube-public          # Public resources
├── ingress-nginx        # Ingress controller
├── cert-manager         # Certificate management
├── monitoring           # Prometheus + Grafana
├── argocd              # GitOps deployment
└── istio-system        # Service mesh (optional)

Application Namespaces (Teams)
├── team-a-dev
├── team-a-staging
├── team-a-production
├── team-b-dev
└── team-b-production
```

**Benefits**:
- Clear separation of concerns
- Easier RBAC implementation
- Simplified resource quotas

---

### 2. RBAC Implementation

**Pattern**:
```yaml
# Infrastructure Provider Role
ClusterRole: gateway-admin
  - Create GatewayClass
  - Create Gateway (in specific namespaces)

# Cluster Operator Role
ClusterRole: gateway-operator
  - Get/List Gateway
  - Create/Update HTTPRoute
  - Create NetworkPolicy

# Application Developer Role
ClusterRole: gateway-developer
  - Get/List Gateway
  - Create/Update HTTPRoute (in own namespace only)
```

**See**: `gateway-api-setup.md` - "RBAC Examples"

---

### 3. GitOps Workflow

**Pattern**:
```
1. Developer creates feature branch
   git checkout -b feature/new-api
   
2. Developer modifies manifests
   vim manifests/deployment.yaml
   
3. Developer opens pull request
   Reviewers check changes
   
4. After approval, merge to main
   git merge feature/new-api
   
5. ArgoCD detects Git change
   Automatically syncs to cluster
   
6. Application updated
   kubectl get pods -w (shows new version)
```

**See**: `argocd-setup.md` - "Best Practices"

---

### 4. Monitoring Strategy

**Pattern**:
```yaml
Level 1: Infrastructure
  - Node metrics (CPU, Memory, Disk)
  - Pod resource usage
  - Network I/O

Level 2: Application
  - HTTP request latency
  - Error rate
  - Custom business metrics

Level 3: Platform
  - ArgoCD sync success rate
  - Certificate expiry dates
  - Ingress status
```

**See**: `prometheus-grafana-setup.md` - "Monitoring" section

---

### 5. Security Layers

**Pattern**:
```
Layer 1: Network Policies (Calico)
  ↓
Layer 2: TLS/mTLS (Cert-Manager + Istio)
  ↓
Layer 3: RBAC (Kubernetes native)
  ↓
Layer 4: Pod Security (Network policies + RBAC)
```

**Never skip**: Start with network policies (deny-all)

---

## Troubleshooting Guide

### Common Issues & Solutions

#### Issue 1: Ingress/Gateway Not Getting IP

**Symptoms**:
```bash
kubectl get ingress
NAME         HOSTS              ADDRESS       PORTS   AGE
myingress    example.com        <pending>     80      5m
```

**Diagnosis**:
```bash
# Check ingress controller status
kubectl get pods -n ingress-nginx

# Check service
kubectl get svc -n ingress-nginx

# Check logs
kubectl logs -n ingress-nginx -l app=ingress-nginx --tail=50
```

**Solutions**:
1. **LoadBalancer pending**: Cloud provider not responding
   - Check cloud account permissions
   - Verify quotas aren't exceeded

2. **Ingress controller not running**: 
   - Reinstall: `nginx-ingress-setup.md`
   - Check: `kubectl describe deployment -n ingress-nginx`

3. **For Gateway API**: Ensure correct GatewayClass
   - Check: `kubectl get gatewayclass -o yaml`
   - Verify: GatewayClass controller is running

---

#### Issue 2: Certificate Not Issuing

**Symptoms**:
```bash
kubectl describe certificate myapp-cert
Status:  False
Reason:  WaitingForIssuance
```

**Diagnosis**:
```bash
# Check certificate status
kubectl describe certificate <name>

# Check order
kubectl get order -A

# Check challenge
kubectl get challenge -A

# Check cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager -f
```

**Solutions**:
1. **DNS validation failing**: 
   - Verify DNS record exists
   - Check propagation: `nslookup your-domain.com`

2. **Rate limits hit**:
   - Use staging issuer first: `CertManager/02-issuer-letsencrypt-staging.yaml`
   - Wait 1 hour before retry

3. **Issuer configuration wrong**:
   - Verify email in issuer
   - Check private key secret exists

---

#### Issue 3: Pods Can't Communicate (Network Policies)

**Symptoms**:
```bash
kubectl exec pod1 -- curl pod2:8080
curl: (28) Connection timed out
```

**Diagnosis**:
```bash
# Check network policies
kubectl get networkpolicy -A

# Describe the policy
kubectl describe networkpolicy <name>

# Check pod labels
kubectl get pod --show-labels

# Test without policies
kubectl delete networkpolicy --all
# If works, then policy is issue
```

**Solutions**:
1. **Policy too restrictive**:
   - Start with: `Calico/01-networkpolicy-deny-all.yaml`
   - Then add: `Calico/02-networkpolicy-allow-namespace.yaml`

2. **Pod labels don't match**:
   - Check labels: `kubectl get pod --show-labels`
   - Update policy selectors

3. **Wrong protocol/port**:
   - Verify application listens on declared port
   - Check: `kubectl port-forward pod1 8080`

---

#### Issue 4: ArgoCD Not Syncing

**Symptoms**:
```bash
argocd app get myapp
STATUS: OutOfSync
SYNC STATUS: Unknown
```

**Diagnosis**:
```bash
# Check application status
kubectl get app myapp -n argocd -o yaml

# Check ArgoCD logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller -f

# Check Git access
kubectl get secret git-credentials -n argocd -o yaml
```

**Solutions**:
1. **Git credentials wrong**:
   - Recreate secret: `argocd-setup.md` - Repository section
   - Test: `kubectl exec -it argocd-repo-server -- git clone <url>`

2. **Application CRDs missing**:
   - Ensure source CRDs exist
   - Check: `kubectl get crd | grep <source-kind>`

3. **Destination cluster unreachable**:
   - Verify: `kubectl cluster-info`
   - Check: ArgoCD cluster settings

---

#### Issue 5: KEDA Not Scaling

**Symptoms**:
```bash
kubectl get hpa
NAME       REFERENCE          TARGETS      MINPODS  MAXPODS  REPLICAS  AGE
myapp-hpa  Deployment/myapp   <unknown>/60 1        10       1         5m
```

**Diagnosis**:
```bash
# Check ScaledObject
kubectl describe scaledobject <name>

# Check KEDA scaler status
kubectl logs -n keda -l app=keda-operator

# Test metric availability
kubectl top pod  # For CPU/memory
curl prometheus:9090/api/v1/query?query=http_requests_total  # For Prometheus
```

**Solutions**:
1. **Metrics server missing** (for CPU/memory):
   - Install: `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`

2. **Prometheus query wrong**:
   - Test query in Prometheus UI
   - Ensure metrics exist: `curl prometheus:9090/api/v1/labels`

3. **Scaler configuration error**:
   - Check: Metadata fields match scaler spec
   - Verify: Service account has permissions

---

### Debugging Commands Toolkit

**Universal debugging**:
```bash
# Get all resources
kubectl get all -n <namespace>

# Describe problematic resource
kubectl describe <kind> <name> -n <namespace>

# View logs
kubectl logs <pod> -n <namespace>
kubectl logs <pod> -n <namespace> --previous  # Crashed pod

# Execute commands in pod
kubectl exec -it <pod> -n <namespace> -- bash

# Port forward for debugging
kubectl port-forward <pod> 8080:8080 -n <namespace>

# Check events
kubectl get events -n <namespace> --sort-by='.lastTimestamp'

# Dry-run to validate
kubectl apply -f manifest.yaml --dry-run=client
```

**Networking debugging**:
```bash
# Launch debug pod
kubectl run debug --image=nicolaka/netshoot -it --rm -- bash

# Test DNS
nslookup service-name
nslookup service-name.namespace.svc.cluster.local

# Test connectivity
curl http://service-ip:port
telnet ip port

# View network policies
kubectl get networkpolicy -A
kubectl describe networkpolicy <name>
```

---

## Resources

### Official Documentation
- **Kubernetes**: https://kubernetes.io/docs/
- **Gateway API**: https://gateway-api.sigs.k8s.io/
- **ArgoCD**: https://argo-cd.readthedocs.io/
- **Istio**: https://istio.io/latest/docs/
- **Cert-Manager**: https://cert-manager.io/
- **KEDA**: https://keda.sh/
- **Calico**: https://docs.tigera.io/
- **Prometheus**: https://prometheus.io/docs/
- **Nginx Ingress**: https://kubernetes.github.io/ingress-nginx/

### Setup Guides (In This Repository)
- `prometheus-grafana-setup.md` - Monitoring
- `istio-setup.md` - Service mesh
- `keda-setup.md` - Auto-scaling
- `calico-setup.md` - Network policies
- `cert-manager-setup.md` - TLS certificates
- `nginx-ingress-setup.md` - Traditional ingress
- `argocd-setup.md` - GitOps
- `gateway-api-setup.md` - Modern ingress
- `kubernetes-admin-tools-reference.md` - Tool overview

### Example Files
All YAML examples are in: `/examples/`
- Organized by technology
- Numbered for learning progression
- Fully commented for understanding

### Learning Resources
- **Linux Academy**: Kubernetes courses
- **A Cloud Guru**: Hands-on labs
- **Kubernetes the Hard Way**: Deep dive setup
- **CKA Exam Prep**: Certification study

### Community
- **Kubernetes Slack**: #general, #help
- **Stack Overflow**: [kubernetes] tag
- **Reddit**: r/kubernetes
- **GitHub Issues**: Tool-specific repos

---

## Next Steps

### For Beginners
1. Start with **Path 1: Web Application Deployment**
2. Complete **Exercise Set 1**
3. Study **Gateway API** section
4. Practice deploying real applications

### For Intermediate Users
1. Choose **Path 2 or 3** based on interest
2. Complete corresponding exercise sets
3. Implement in your own cluster
4. Document your setup

### For Advanced Users
1. Combine multiple technologies
2. Optimize for your use case
3. Contribute back to community
4. Mentor others

---

## Continuous Learning

### Weekly Reviews
- **Monday**: Review setup guide for chosen technology
- **Tuesday**: Study examples and implementation patterns
- **Wednesday**: Complete practical exercise
- **Thursday**: Implement in test environment
- **Friday**: Document learnings and troubleshoot issues

### Monthly Projects
- **Month 1**: Deploy application with Ingress + TLS
- **Month 2**: Implement GitOps with ArgoCD
- **Month 3**: Add network policies with Calico
- **Month 4**: Implement monitoring with Prometheus
- **Month 5**: Add auto-scaling with KEDA
- **Month 6**: Consolidate learning in production setup

---

## Study Checklist

### Foundational Knowledge
- [ ] Understand Kubernetes resource model (Pods, Deployments, Services)
- [ ] Know Kubernetes networking basics
- [ ] Familiar with kubectl commands
- [ ] Can read and write basic YAML

### Ingress & Networking
- [ ] Understand Ingress concepts
- [ ] Can deploy Nginx Ingress Controller
- [ ] Know Gateway API advantages
- [ ] Can deploy Gateway and HTTPRoute

### Security
- [ ] Can implement network policies
- [ ] Understand TLS certificates
- [ ] Can set up Cert-Manager
- [ ] Know RBAC basics

### Deployment
- [ ] Can write Kubernetes manifests
- [ ] Understand GitOps principles
- [ ] Can use ArgoCD
- [ ] Know canary deployment patterns

### Observability
- [ ] Can write Prometheus queries
- [ ] Understand metrics and alerting
- [ ] Can create Grafana dashboards
- [ ] Know the four golden signals

### Advanced Topics
- [ ] Understand service mesh concepts
- [ ] Can configure Istio policies
- [ ] Know auto-scaling triggers
- [ ] Can troubleshoot complex issues

---

**Last Updated**: October 1, 2026
**Next Review**: 1 month  
**Status**: Study Material Ready ✓ — Updated for K8s 1.35/1.36 study baseline

---

## Quick Links by Use Case

**I want to expose my app to the internet**
→ `gateway-api-setup.md` (recommended) or `nginx-ingress-setup.md`
→ `examples/GatewayAPI/` or `examples/NginxIngress/`

**I want to add HTTPS to my app**
→ `cert-manager-setup.md`
→ `examples/CertManager/03-clusterissuer-letsencrypt-prod.yaml`

**I want to secure my cluster network**
→ `calico-setup.md`
→ `examples/Calico/01-networkpolicy-deny-all.yaml`

**I want to automate deployments**
→ `argocd-setup.md`
→ `examples/ArgoCD/01-basic-app.yaml`

**I want to monitor my cluster**
→ `prometheus-grafana-setup.md`
→ `examples/Prometheus/`

**I want to scale applications automatically**
→ `keda-setup.md`
→ `examples/KEDA/01-scaledobject-cpu.yaml`

**I want advanced traffic management**
→ `istio-setup.md`
→ `examples/Istio/`

---

Happy Learning! 🚀
