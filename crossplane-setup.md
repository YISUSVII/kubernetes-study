# Crossplane Setup Notes

Crossplane adds a declarative platform API to Kubernetes. This lab creates an `AppConfig` API that reconciles a ConfigMap, without provisioning cloud infrastructure. It complements ArgoCD: GitOps can deliver the API definitions and requests, while Crossplane reconciles their composed resources.

[CNCF graduated status](https://www.cncf.io/projects/crossplane/) and [Scheduling & Orchestration category](https://landscape.cncf.io/guide#orchestration-management--scheduling-orchestration) checked October 1, 2026. Release pin: [v2.4.2](https://github.com/crossplane/crossplane/releases/tag/v2.4.2).

## Install

Use a disposable Kubernetes cluster, Helm, and permission to install CRDs/RBAC. These instructions assume the chart's default ServiceAccount name `crossplane`.

```bash
helm repo add crossplane-stable https://charts.crossplane.io/stable
helm repo update
helm install crossplane crossplane-stable/crossplane \
  --namespace crossplane-system --create-namespace --version 2.4.2 --wait
kubectl get pods -n crossplane-system
```

Source: [official installation guide](https://docs.crossplane.io/latest/get-started/install/).

## Run the composition lab

Run commands from the repository root. Apply dependencies separately so the generated API exists before creating its first resource.

```bash
kubectl apply -f examples/Crossplane/01-lab-rbac.yaml
kubectl apply -f examples/Crossplane/02-function-and-xrd.yaml
kubectl wait --for=condition=Healthy function/function-patch-and-transform --timeout=180s
kubectl wait --for=condition=Established crd/appconfigs.study.example.org --timeout=120s
kubectl apply -f examples/Crossplane/03-composition.yaml
kubectl apply -f examples/Crossplane/04-appconfig.yaml
kubectl wait --for=condition=Ready appconfig/hello-platform -n crossplane-study --timeout=180s
kubectl get configmaps -n crossplane-study -l study.example.org/lab=crossplane -o yaml
```

Change `spec.message` in `04-appconfig.yaml`, apply it again, and observe the ConfigMap's data change. The composed ConfigMap gets a generated name and remains in the composite resource's namespace.

The lab uses a [namespaced v2 XRD](https://docs.crossplane.io/latest/whats-new/) and a [pipeline Composition](https://docs.crossplane.io/latest/composition/compositions/). Its [Patch and Transform function](https://docs.crossplane.io/latest/guides/function-patch-and-transform/) copies the requested message into ConfigMap data. `readinessChecks: None` suits ConfigMaps, which have no Ready condition; it would not establish application health for a Deployment. Function pin: [v0.10.8](https://github.com/crossplane-contrib/function-patch-and-transform/releases/tag/v0.10.8).

## Troubleshooting and cleanup

If reconciliation fails, describe the AppConfig and Function, then inspect `kubectl logs -n crossplane-system deployment/crossplane`. For Forbidden errors, verify the chart ServiceAccount and the lab RoleBinding. Function download failures usually require checking registry access.

```bash
kubectl delete -f examples/Crossplane/04-appconfig.yaml --wait=true
kubectl delete -f examples/Crossplane/03-composition.yaml
kubectl delete -f examples/Crossplane/02-function-and-xrd.yaml
kubectl delete -f examples/Crossplane/01-lab-rbac.yaml
```

Delete the request first so Crossplane can clean up composed resources while it still has permissions. Leave the controller installed if other compositions use it. For further exercises, extend the schema and composition to add another ConfigMap key, then explore [application composition](https://docs.crossplane.io/latest/get-started/get-started-with-composition/).
