# Kubernetes Examples Directory

This directory contains organized YAML examples for all Kubernetes tools and technologies documented in the setup guides. Updated for **K8s 1.35/1.36 study baseline (October 2026)**. See [../DEPRECATIONS.md](../DEPRECATIONS.md) for version history and retired components.

## Directory Structure

```
examples/
├── ArgoCD/          # GitOps - ArgoCD v3.5+
├── Calico/          # Network policies (+ AdminNetworkPolicy)
├── CertManager/     # TLS certificates - cert-manager v1.21+
├── Cilium/          # eBPF-based CNI (most popular CNI)
├── Crossplane/      # Namespaced platform API and ConfigMap composition
├── Karmada/         # Multi-cluster placement and replica scheduling
├── GatewayAPI/      # Gateway API v1.6+
├── Istio/           # Service mesh - Istio 1.30+ (v1 APIs)
├── KEDA/            # Event-driven autoscaling - KEDA v2.21+
├── NginxIngress/    # Traditional Ingress Controller ⚠️ retired project, see DEPRECATIONS.md
├── Prometheus/      # Monitoring - kube-prometheus-stack
└── README.md
```

## File Naming Convention

All example files use the following naming convention:
```
NN-description.yaml
```

Where:
- `NN` = Sequential number (01, 02, 03, etc.)
- `description` = Short description of what the file contains
- `.yaml` = YAML extension (standard for Kubernetes)

## New graduated orchestration labs

| Folder | Files | Apply order |
|--------|-------|-------------|
| [Crossplane/](Crossplane/) | RBAC, Function/XRD, Composition, AppConfig | Follow [setup](../crossplane-setup.md); wait for Function and generated CRD before applying the request |
| [Karmada/](Karmada/) | Workload, duplicated placement, divided placement | Follow [setup](../karmada-setup.md); file 03 replaces file 02 as a second exercise |

These labs require their controllers. Karmada resources target the Karmada API, while Crossplane resources target the cluster hosting Crossplane. Do not apply either whole directory before completing the setup steps.

## Technology Folders

### ArgoCD/
GitOps continuous deployment examples (ArgoCD v3.5+)
- `01-basic-app.yaml` - Basic application from Git repository
- `02-helm-app.yaml` - Application with Helm chart
- `03-kustomize-app.yaml` - Application with Kustomize
- `04-appproject-team-a.yaml` - Multi-tenancy AppProject
- `05-notifications-cm.yaml` - Notifications configuration
- `06-servicemonitor-metrics.yaml` - Prometheus metrics integration
- `07-applicationset.yaml` - **NEW** ApplicationSet (multi-app/multi-cluster, 2025)
- `08-image-updater.yaml` - **NEW** ArgoCD Image Updater (GitOps image promotion)

**Usage:**
```bash
kubectl apply -f ArgoCD/01-basic-app.yaml
```

### CertManager/
TLS certificate management examples
- `01-issuer-selfsigned.yaml` - Self-signed issuer (testing)
- `02-issuer-letsencrypt-staging.yaml` - Let's Encrypt staging
- `03-clusterissuer-letsencrypt-prod.yaml` - Let's Encrypt production
- `04-certificate.yaml` - Manual certificate definition

**Usage:**
```bash
kubectl apply -f CertManager/03-clusterissuer-letsencrypt-prod.yaml
```

### Calico/
Network security policies (+ K8s native AdminNetworkPolicy)
- `01-networkpolicy-deny-all.yaml` - Deny all ingress by default
- `02-networkpolicy-allow-namespace.yaml` - Allow from specific namespace
- `03-networkpolicy-pod-to-pod.yaml` - Pod-to-pod communication
- `04-networkpolicy-egress-dns.yaml` - Egress DNS access
- `05-globalnetworkpolicy.yaml` - Calico cluster-wide policies
- `06-adminnetworkpolicy.yaml` - **NEW** K8s AdminNetworkPolicy (1.31+ beta)
- `07-networkpolicy-port-range.yaml` - **NEW** Port ranges with `endPort` (K8s 1.25+)

**Usage:**
```bash
kubectl apply -f Calico/01-networkpolicy-deny-all.yaml
```

### Cilium/
**NEW** eBPF-based CNI - most popular CNI in 2025/2026 (CNCF Graduated)
- `README.md` - Cilium overview and setup commands
- `01-ciliumnetworkpolicy-basic.yaml` - L4/L7 network policies with FQDN support
- `02-ciliumclusterwidenetworkpolicy.yaml` - Cluster-wide eBPF policies
- `03-hubble-observability.yaml` - Real-time network observability

**Usage:**
```bash
kubectl apply -f Cilium/01-ciliumnetworkpolicy-basic.yaml
```
Next-generation Kubernetes ingress (Gateway API v1.6+)
- `01-gatewayclass.yaml` - Gateway controller definition
- `02-gateway-basic.yaml` - Basic gateway with HTTP/HTTPS
- `03-httproute-basic.yaml` - Simple HTTP routing
- `04-httproute-header-matching.yaml` - Header-based routing
- `05-httproute-traffic-splitting.yaml` - Canary deployments
- `06-httproute-redirects.yaml` - HTTP redirects
- `07-httproute-header-modifications.yaml` - Request/response header modification
- `08-grpcroute.yaml` - gRPC routing
- `09-referencegrant.yaml` - Cross-namespace routing permissions
- `10-backendtlspolicy.yaml` - BackendTLSPolicy (backend TLS, standard since v1.3)
- `11-httproute-retries-timeouts.yaml` - Retry policies and timeouts (v1.1+)

**Usage:**
```bash
kubectl apply -f GatewayAPI/01-gatewayclass.yaml
kubectl apply -f GatewayAPI/02-gateway-basic.yaml
kubectl apply -f GatewayAPI/03-httproute-basic.yaml
```

### Istio/
Service mesh examples (networking.istio.io/v1 - GA since Istio 1.22)
- `01-virtualservice-basic.yaml` - Traffic management (updated to v1 API)
- `02-gateway-basic.yaml` - Istio gateway with TLS (updated to v1 API)
- `03-destinationrule.yaml` - **NEW** Load balancing, circuit breaking, mTLS
- `04-peerauthentication.yaml` - **NEW** mTLS enforcement + AuthorizationPolicy

**Usage:**
```bash
kubectl apply -f Istio/01-virtualservice-basic.yaml
```

### KEDA/
Event-driven autoscaling (KEDA v2.21+; review token-audience migration before upgrading)
- `01-scaledobject-cpu.yaml` - CPU-based scaling (updated with modern fields)
- `02-scaledobject-memory.yaml` - Memory-based scaling (updated)
- `03-scaledobject-prometheus.yaml` - Prometheus metrics scaling (updated)
- `04-scaledobject-kafka.yaml` - Kafka topic lag scaling (updated with auth)
- `05-scaledobject-http.yaml` - **NEW** HTTP Add-on (scale to zero for HTTP)
- `06-scaledjob.yaml` - **NEW** ScaledJob for batch processing

**Usage:**
```bash
kubectl apply -f KEDA/01-scaledobject-cpu.yaml
```

### NginxIngress/
⚠️ **Retired project** (archived March 24, 2026) — traditional Kubernetes Ingress Controller, kept for study/reference. Prefer Gateway API for new work.
- `01-ingress-simple-http.yaml` - Basic HTTP ingress
- `02-ingress-https.yaml` - HTTPS with TLS
- `03-ingress-multi-backend.yaml` - Path-based routing
- `04-ingress-multi-host.yaml` - Virtual hosting
- `05-ingress-advanced.yaml` - Advanced annotations

**Usage:**
```bash
kubectl apply -f NginxIngress/01-ingress-simple-http.yaml
```

### Prometheus/
Monitoring and alerting (kube-prometheus-stack chart v87+)
- `01-servicemonitor-basic.yaml` - Basic service monitoring
- `02-prometheusrule-alerts.yaml` - Alert rules
- `03-podmonitor-recording-rules.yaml` - **NEW** PodMonitor + recording rules (performance)

**Usage:**
```bash
kubectl apply -f Prometheus/01-servicemonitor-basic.yaml
```

## How to Use

### 1. View Example Contents
```bash
cat ArgoCD/01-basic-app.yaml
```

### 2. Apply Example to Cluster
```bash
kubectl apply -f ArgoCD/01-basic-app.yaml
```

### 3. Apply Multiple Examples
```bash
kubectl apply -f GatewayAPI/
```

### 4. Deploy with Customization
```bash
# Download and customize
curl -s https://path-to-repo/examples/ArgoCD/01-basic-app.yaml | \
  sed 's/myapp/myapp-prod/g' | \
  kubectl apply -f -
```

## File Modification Workflow

When using these examples:

1. **Copy the example** to your working directory
2. **Customize** the values for your environment:
   - Repository URLs
   - Namespaces
   - Domain names
   - Service names
   - Port numbers
3. **Validate** the YAML:
   ```bash
   kubectl apply -f <file> --dry-run=client
   ```
4. **Apply** to your cluster:
   ```bash
   kubectl apply -f <file>
   ```

## Quick Reference by Use Case

### Setting up Ingress
- Traditional: Use `NginxIngress/` examples
- Modern: Use `GatewayAPI/` examples (recommended)
- SSL/TLS: Apply `CertManager/` examples first

### Setting up Security
- Network policies: Use `Calico/` examples
- Start with `01-networkpolicy-deny-all.yaml`

### Setting up Autoscaling
- Event-driven: Use `KEDA/` examples
- Start with `01-scaledobject-cpu.yaml`

### Setting up GitOps
- Use `ArgoCD/` examples
- Start with `01-basic-app.yaml`

### Setting up Monitoring
- Use `Prometheus/` examples
- Use `ArgoCD/06-servicemonitor-metrics.yaml` for ArgoCD monitoring

## YAML Best Practices

### Comments in Files
Each YAML file includes a comment header:
```yaml
# Technology Name - Brief Description
apiVersion: ...
```

### Common Fields to Customize

When using examples, typically change:
- **metadata.name** - Resource name
- **metadata.namespace** - Kubernetes namespace
- **spec.host/spec.hosts** - Domain names
- **spec.repoURL** - Git repository URLs
- **spec.backendRefs[].name** - Service names
- **spec.email** - Email addresses (for cert-manager)
- **spec.image** - Container images

## Validation

Before deploying, always validate YAML syntax:

```bash
# Syntax check
kubectl apply -f <file> --dry-run=client -o yaml

# Full validation with server-side rules
kubectl apply -f <file> --dry-run=server

# Kube-linter (additional checks)
kube-linter lint <file>
```

## Combining Examples

You can create multi-resource files by combining YAML documents:

```bash
cat GatewayAPI/01-gatewayclass.yaml \
    GatewayAPI/02-gateway-basic.yaml \
    GatewayAPI/03-httproute-basic.yaml > combined.yaml

kubectl apply -f combined.yaml
```

## Documentation Reference

For each technology, refer to the corresponding setup guide:
- ArgoCD → `../argocd-setup.md`
- Cert-Manager → `../cert-manager-setup.md`
- Calico/NetworkPolicy → `../calico-setup.md`
- **Cilium (NEW)** → `../cilium-setup.md`
- Gateway API → `../gateway-api-setup.md`
- Istio → `../istio-setup.md`
- KEDA → `../keda-setup.md`
- Nginx Ingress → `../nginx-ingress-setup.md`
- Prometheus → `../prometheus-grafana-setup.md`

---
**Last Updated**: October 1, 2026 — Compatible with K8s 1.35/1.36 study baseline

## Troubleshooting

### Example doesn't apply?
1. Check namespace exists: `kubectl get namespace <namespace>`
2. Validate YAML: `kubectl apply -f <file> --dry-run=client`
3. Check permissions: `kubectl auth can-i create <kind>`

### Resource not ready?
```bash
# Check status
kubectl get <kind> <name>
kubectl describe <kind> <name>
kubectl logs -l app=<label>
```

## Contributing

When adding new examples:
1. Follow the naming convention: `NN-description.yaml`
2. Add a comment header with description
3. Use meaningful, customizable values
4. Test before committing
5. Update this README

## License

These examples are provided as-is for reference and educational purposes.
