# ArgoCD Setup Notes

> **October 2026 update**: stable is [ArgoCD v3.5.3](https://github.com/argoproj/argo-cd/releases/tag/v3.5.3). Review the [3.4 → 3.5 upgrade guide](https://argo-cd.readthedocs.io/en/stable/operator-manual/upgrading/3.4-3.5/) for Helm 4, OCI registry settings, and Source Integrity migration before upgrading. See [DEPRECATIONS.md](DEPRECATIONS.md).

## Prerequisites
```bash
# Add ArgoCD Helm repository (optional - can use kubectl apply directly)
helm repo add argo https://argoproj.github.io/argo-helm

# Update Helm repositories
helm repo update
```

## Installation

### 1. Create argocd namespace
```bash
kubectl create namespace argocd
```

### 2. Install ArgoCD using kubectl (recommended for simplicity)
```bash
kubectl apply --server-side -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v3.5.3/manifests/install.yaml
```

### Alternative: Install using Helm
```bash
# Select a chart version whose appVersion matches v3.5.3 (chart and app versions differ).
helm search repo argo/argo-cd --versions
helm show chart argo/argo-cd --version <CHART_VERSION>
helm install argocd argo/argo-cd --namespace argocd --version <CHART_VERSION>
```

## Verify Installation
```bash
# Check ArgoCD pods
kubectl get pods -n argocd

# Check services
kubectl get svc -n argocd

# Check if all pods are running
kubectl wait --for=condition=ready pod -l app.kubernetes.io/part-of=argocd -n argocd --timeout=300s
```

## Access ArgoCD UI

### 1. Get initial admin password
```bash
# Extract password from secret
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

### 2. Port-forward to ArgoCD API server
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

### 3. Access the UI
- URL: `https://localhost:8080`
- Username: `admin`
- Password: (from step 1)

## Change Admin Password
```bash
# First port-forward to ArgoCD server
kubectl port-forward svc/argocd-server -n argocd 8080:443 &

# Login and change password via CLI
argocd login localhost:8080 --insecure --username admin --password <initial-password>
argocd account update-password --account admin --new-password <new-password>
```

## Create Application Example

### 1. Basic Application (from Git repository)
```bash
kubectl apply -f - <<EOF
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/myrepo
    targetRevision: HEAD
    path: manifests/
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
EOF
```

### 2. Application with Helm chart
```bash
kubectl apply -f - <<EOF
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: prometheus-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/myrepo
    targetRevision: main
    path: helm/prometheus
    helm:
      releaseName: prometheus
      values: |
        prometheus:
          retention: 30d
  destination:
    server: https://kubernetes.default.svc
    namespace: monitoring
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - CreateNamespace=true
EOF
```

### 3. Application with Kustomize
```bash
kubectl apply -f - <<EOF
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-kustomize-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/myorg/myrepo
    targetRevision: main
    path: kustomize/overlays/production
  destination:
    server: https://kubernetes.default.svc
    namespace: default
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
    - RespectIgnoreDifferences=true
EOF
```

## Useful Commands
```bash
# List applications
kubectl get applications -n argocd

# Describe application
kubectl describe app <app-name> -n argocd

# Get application status
kubectl get app <app-name> -n argocd -o yaml

# Sync application manually
argocd app sync <app-name>

# Rollback application
argocd app rollback <app-name>

# Get ArgoCD CLI version
argocd version

# View application history
argocd app history <app-name>

# Check logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-server -f
```

## AppProject for Multi-tenancy

### Create separate projects for teams
```bash
kubectl apply -f - <<EOF
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: team-a
  namespace: argocd
spec:
  description: Team A project
  sourceRepos:
  - 'https://github.com/team-a/*'
  destinations:
  - namespace: 'team-a-*'
    server: https://kubernetes.default.svc
  clusterResourceWhitelist:
  - group: ''
    kind: Namespace
  namespaceResourceWhitelist:
  - group: '*'
    kind: '*'
EOF
```

## Notifications and Webhooks

### 1. Configure GitHub webhook
```bash
# Get ArgoCD server URL
ARGOCD_URL=$(kubectl get svc argocd-server -n argocd -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

# Set webhook URL in GitHub repo settings:
# https://$ARGOCD_URL/api/webhook

# Or use port-forward:
# https://localhost:8080/api/webhook
```

### 2. Enable notifications (optional)
```bash
# Create notifications configmap
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: argocd-notifications-cm
  namespace: argocd
data:
  trigger.on-sync-failed: |
    - when: app.status.operationState.phase in ['Error', 'Failed']
      send: [app-health-degraded]
  trigger.on-deployed: |
    - when: app.status.operationState.phase in ['Succeeded']
      send: [app-deployed]
EOF
```

## Monitoring ArgoCD

### 1. Enable Prometheus metrics
```bash
# ArgoCD exposes metrics by default on port 8083
# Create ServiceMonitor for Prometheus
kubectl apply -f - <<EOF
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: argocd-metrics
  namespace: argocd
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: argocd-metrics
  endpoints:
  - port: metrics
    interval: 30s
EOF
```

## Repository Credentials

### 1. Add private Git repository
```bash
# Create repository secret
kubectl create secret generic git-credentials \
  --from-literal=type=git \
  --from-literal=url=https://github.com/myorg/private-repo \
  --from-literal=password=<github-token> \
  --from-literal=username=not-used \
  -n argocd

# Label the secret so ArgoCD can discover it
kubectl label secret git-credentials \
  argocd.argoproj.io/secret-type=repository \
  -n argocd
```

### 2. Add private Helm repository
```bash
kubectl create secret generic helm-credentials \
  --from-literal=type=helm \
  --from-literal=url=https://charts.example.com \
  --from-literal=username=<username> \
  --from-literal=password=<password> \
  -n argocd

kubectl label secret helm-credentials \
  argocd.argoproj.io/secret-type=repository \
  -n argocd
```

## Troubleshooting

### Application not syncing
```bash
# Check application status
kubectl describe app <app-name> -n argocd

# View sync logs
argocd app logs <app-name>

# Check ArgoCD controller logs
kubectl logs -n argocd -l app.kubernetes.io/name=argocd-application-controller -f
```

### Stuck in sync
```bash
# Force refresh
argocd app diff <app-name>

# Clear cache
argocd repo remove-cache <repo-url>

# Restart ArgoCD
kubectl rollout restart deployment argocd-application-controller -n argocd
```

## Best Practices
1. Use separate AppProjects for teams/environments
2. Implement GitOps workflows (Git as source of truth)
3. Use branch protection rules in Git repositories
4. Enable auto-sync for reliable deployments
5. Implement prune and selfHeal policies
6. Monitor ArgoCD with Prometheus metrics
7. Use separate Git repositories for each environment
8. Document Application manifests clearly
9. Regularly backup ArgoCD configuration
10. Use pull request workflows for changes

## Security Best Practices
1. Change default admin password immediately
2. Rotate authentication tokens regularly
3. Use RBAC for multi-user access
4. Store secrets in sealed-secrets or external vault
5. Audit all ArgoCD actions
6. Use HTTPS for all connections
7. Implement network policies for ArgoCD
8. Regularly update ArgoCD

## Resources
- **Official Documentation**: https://argo-cd.readthedocs.io/
- **GitHub Repository**: https://github.com/argoproj/argo-cd
- **ArgoCD Community**: https://github.com/argoproj/argo-cd/discussions

## Notes
- ArgoCD implements GitOps principles
- Enables declarative, version-controlled deployments
- Supports multiple source types (Git, Helm, Kustomize)
- Provides automatic sync and rollback capabilities
- Essential for continuous deployment workflows
