# Kubernetes Admin Tools Reference Guide

## Essential Tools Overview

This guide provides an overview of recommended Kubernetes administration and monitoring tools for production clusters.

## Core Infrastructure Tools

### Monitoring & Observability
- **Prometheus** (`prometheus-grafana-setup.md`) - Metrics collection and alerting
- **Grafana** - Metrics visualization and dashboards
- **Kiali** - Istio service mesh visualization (included with Istio)
- **Jaeger** - Distributed tracing

### Service Mesh
- **Istio** (`istio-setup.md`) - Advanced traffic management and observability
  - Traffic splitting and canary deployments
  - Advanced routing policies
  - Mutual TLS between services
  - Retry logic and circuit breaking

### Ingress & Load Balancing
- **Nginx Ingress Controller** (`nginx-ingress-setup.md`) - HTTP(S) routing
  - Virtual hosting
  - TLS termination
  - Rate limiting and authentication

### Certificate Management
- **Cert-Manager** (`cert-manager-setup.md`) - Automated TLS certificate management
  - Let's Encrypt integration
  - Certificate renewal automation

### Network Policies
- **Calico** (`calico-setup.md`) - Network security policies
  - Pod-to-pod communication control
  - Cluster-wide policies

### Auto-scaling
- **KEDA** (`keda-setup.md`) - Event-driven autoscaling
  - CPU/Memory scaling
  - Queue-based scaling (Kafka, RabbitMQ, AWS SQS)
  - Custom metrics scaling

### GitOps & Deployment
- **ArgoCD** (`argocd-setup.md`) - Continuous deployment
  - Git-based deployment workflows
  - Application lifecycle management
  - Multi-environment support

## Installation Priority for Production Cluster

### Phase 1: Foundation (Required)
1. **Prometheus + Grafana** - Observability is critical for operations
2. **Nginx Ingress Controller** - Essential for external traffic routing
3. **Cert-Manager** - Required for HTTPS in production

### Phase 2: Advanced (Highly Recommended)
4. **Calico** - Network security (especially for multi-tenant clusters)
5. **ArgoCD** - GitOps workflow automation
6. **KEDA** - Application auto-scaling

### Phase 3: Optional (Situational)
7. **Istio** - Service mesh (complex, use only if needed for advanced features)

## Quick Reference: Tool Selection Matrix

| Use Case | Tool | File |
|----------|------|------|
| Real-time metrics & dashboards | Prometheus + Grafana | prometheus-grafana-setup.md |
| External HTTP/HTTPS routing | Nginx Ingress | nginx-ingress-setup.md |
| TLS certificate automation | Cert-Manager | cert-manager-setup.md |
| Pod-level network security | Calico | calico-setup.md |
| Event-driven auto-scaling | KEDA | keda-setup.md |
| Service-to-service traffic control | Istio | istio-setup.md |
| GitOps deployments | ArgoCD | argocd-setup.md |

## Common Admin Tasks

### 1. Monitor Cluster Health
```bash
# Check node status
kubectl get nodes -o wide

# Check cluster resources
kubectl top nodes
kubectl top pods --all-namespaces

# Access Grafana for dashboard view
kubectl port-forward -n monitoring svc/prometheus-grafana 3000:80
# Visit http://localhost:3000
```

### 2. Deploy Application with GitOps
```bash
# Create ArgoCD application
# See argocd-setup.md for examples

# Manage with Nginx Ingress
# See nginx-ingress-setup.md for examples

# Secure with auto-generated TLS
# See cert-manager-setup.md for examples
```

### 3. Setup Auto-scaling
```bash
# Configure KEDA for event-based scaling
# See keda-setup.md for examples

# Monitor with Prometheus metrics
kubectl port-forward -n monitoring svc/prometheus-server 9090:80
```

### 4. Implement Network Policies
```bash
# Create Calico policies for security
# See calico-setup.md for examples

# Test connectivity
kubectl run debug --image=busybox -it -- sh
```

### 5. Advanced Traffic Management
```bash
# Use Istio for advanced routing
# See istio-setup.md for examples

# View with Kiali dashboard
kubectl port-forward -n istio-system svc/kiali 20000:20000
```

## Namespace Organization Best Practices

```bash
# Monitoring namespace
kubectl create namespace monitoring

# GitOps namespace
kubectl create namespace argocd

# Ingress namespace
kubectl create namespace ingress-nginx

# Service mesh namespace
kubectl create namespace istio-system

# Application namespaces
kubectl create namespace production
kubectl create namespace staging
kubectl create namespace development
```

## Useful Helm Commands

```bash
# Add all recommended repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add jetstack https://charts.jetstack.io
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo add projectcalico https://projectcalico.docs.tigera.io/charts
helm repo add kedacore https://kedacore.github.io/charts
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo add argo https://argoproj.github.io/argo-helm

# Update all repositories
helm repo update

# List all installed releases
helm list --all-namespaces

# Check for chart updates
helm repo update && helm outdated
```

## Monitoring Commands

```bash
# Check pod status across all namespaces
kubectl get pods --all-namespaces --sort-by=.metadata.creationTimestamp

# Monitor pod events
kubectl get events --all-namespaces --sort-by='.lastTimestamp'

# Check resource requests vs actual usage
kubectl top pod --all-namespaces

# Find pods with issues
kubectl get pods --all-namespaces --field-selector=status.phase!=Running
```

## Troubleshooting Commands

```bash
# Get cluster info
kubectl cluster-info

# Describe cluster status
kubectl get componentstatuses

# Check kubelet status on nodes
kubectl describe node <node-name>

# View API server logs (if self-hosted)
kubectl logs -n kube-system -l component=kube-apiserver

# Debug network connectivity
kubectl run -it --rm debug --image=nicolaka/netshoot --restart=Never -- bash

# Check service endpoints
kubectl get endpoints --all-namespaces
```

## Backup & Disaster Recovery

### Backup Configuration
```bash
# Backup all manifests
kubectl get all --all-namespaces -o yaml > cluster-backup.yaml

# Backup persistent data
kubectl get pvc --all-namespaces -o yaml > pvc-backup.yaml

# Backup secrets (be careful!)
kubectl get secrets --all-namespaces -o yaml > secrets-backup.yaml

# Backup ArgoCD applications
kubectl get applications -n argocd -o yaml > argocd-apps-backup.yaml
```

### Restore Configuration
```bash
# Restore from backup
kubectl apply -f cluster-backup.yaml
```

## Security Best Practices

1. **Enable RBAC**: Implement role-based access control
2. **Use Network Policies**: Deploy Calico for pod-level security
3. **Enable Pod Security Policies**: Control pod capabilities
4. **Use Secrets Management**: Never commit secrets to Git
5. **Enable Audit Logging**: Track API access
6. **Use HTTPS**: Deploy Cert-Manager for TLS
7. **Implement Service Mesh Security**: Use Istio for mTLS
8. **Regular Updates**: Keep all tools updated

## Additional Resources

- **Kubernetes Official Docs**: https://kubernetes.io/docs/
- **Helm Hub**: https://hub.helm.sh/
- **CNCF Landscape**: https://landscape.cncf.io/
- **Kubernetes Best Practices**: https://kubernetes.io/docs/concepts/cluster-administration/

## Tool Combination Recipes

### Minimal Production Setup
- Prometheus + Grafana (monitoring)
- Nginx Ingress + Cert-Manager (ingress & TLS)
- Calico (network security)

### Full-Featured Production Setup
- All tools from Minimal setup, plus:
- KEDA (auto-scaling)
- ArgoCD (GitOps)

### Advanced Enterprise Setup
- All tools above, plus:
- Istio (service mesh)
- Kiali (mesh visualization)
- Jaeger (distributed tracing)

## Notes
- Start with essential tools, add others as needed
- Each tool solves specific problems - evaluate your needs
- All listed tools are open-source and widely adopted
- Combine tools for comprehensive cluster management
- Regular training and documentation is essential for teams
