# Kustomize Setup Notes

> **October 29, 2026 release check**: standalone [Kustomize v5.8.3](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize/v5.8.3). The version embedded in kubectl can differ; record which renderer you use.

Kustomize transforms ordinary Kubernetes YAML without templates. A base defines shared resources; overlays customize names, replicas, images, and configuration. It is included in `kubectl` and can also run as a standalone CLI. ArgoCD and Flux can reconcile Kustomize output.

## Prerequisites

Use a disposable cluster, `kubectl`, and a Bash-compatible shell. Check `kubectl version --client` for the bundled Kustomize version; standalone Kustomize and kubectl can produce different output when their versions differ. Work in a temporary directory outside this repository.

## Lab

Create a base and an overlay:

```bash
mkdir -p /tmp/kustomize-study/base /tmp/kustomize-study/overlays/dev
cd /tmp/kustomize-study
cat > base/deployment.yaml <<'EOF'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  replicas: 1
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: web
          image: nginx:stable-alpine
          ports:
            - containerPort: 80
EOF
cat > base/kustomization.yaml <<'EOF'
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - deployment.yaml
EOF
cat > overlays/dev/kustomization.yaml <<'EOF'
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: kustomize-study
namePrefix: dev-
resources:
  - ../../base
replicas:
  - name: web
    count: 2
configMapGenerator:
  - name: settings
    literals:
      - environment=development
EOF
kubectl kustomize overlays/dev
kubectl create namespace kustomize-study
kubectl apply --dry-run=server -k overlays/dev
kubectl apply -k overlays/dev
kubectl rollout status deployment/dev-web -n kustomize-study --timeout=120s
kubectl get deployments,configmaps -n kustomize-study
```

Expect `dev-web` with two replicas and a generated ConfigMap whose name includes a content hash. The ConfigMap is deliberately not consumed by the application yet. Exercise: reference it with `envFrom.configMapRef` in the base and verify that Kustomize rewrites the reference to the generated name. Pin the nginx image to a reviewed digest for reproducible deployments.

## Troubleshooting and cleanup

Use `kubectl kustomize` before applying: missing files, incorrectly targeted patches, and paths outside allowed roots fail during rendering. Prefer current `resources` and `patches` fields rather than deprecated `bases`, `patchesStrategicMerge`, or `patchesJson6902`. Deleting a resource from a kustomization does not automatically delete it from a cluster when using plain `kubectl apply -k`; GitOps pruning requires separate configuration.

```bash
kubectl delete -k overlays/dev
kubectl delete namespace kustomize-study
```

## References

- [Kustomize documentation](https://kubectl.docs.kubernetes.io/references/kustomize/)
- [Kubernetes Kustomize tasks](https://kubernetes.io/docs/tasks/manage-kubernetes-objects/kustomization/)
- [ArgoCD integration](argocd-setup.md)