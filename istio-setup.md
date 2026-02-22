# Istio Service Mesh Setup Notes

## Prerequisites
```bash
# Add Istio Helm repository
helm repo add istio https://istio-release.storage.googleapis.com/charts

# Update Helm repositories
helm repo update
```

## Installation Steps

### 1. Create Istio namespace
```bash
kubectl create namespace istio-system
```

### 2. Install Istio base chart (CRDs and operators)
```bash
helm install istio-base istio/base -n istio-system --set defaultRevision=default
```

### 3. Install Istio discovery (control plane)
```bash
helm install istiod istio/istiod -n istio-system
```

### 4. Install Istio ingress gateway
```bash
kubectl create namespace istio-ingress
helm install istio-ingressgateway istio/gateway -n istio-ingress
```

## Enable Sidecar Injection

### Inject Istio sidecar for entire namespace
```bash
kubectl label namespace default istio-injection=enabled
```

## Verify Installation
```bash
# Check Istio components
kubectl get pods -n istio-system

# Check ingress gateway
kubectl get pods -n istio-ingress

# Verify CRDs
kubectl get crds | grep istio
```

## Access Kiali Dashboard (Istio Visualization)
```bash
# Install Kiali add-on (use the version matching your Istio release)
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.24/samples/addons/kiali.yaml

# Port forward to Kiali
kubectl port-forward -n istio-system svc/kiali 20001:20001

# Access at http://localhost:20001
```

## Common Use Cases

> **API Note (Istio 1.22+)**: The `networking.istio.io/v1` API is now GA.
> `v1beta1` is **deprecated** and will be removed in a future release.
> Always use `networking.istio.io/v1` for new manifests targeting K8s 1.34+.

### Create a VirtualService
```bash
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
  - myapp
  http:
  - route:
    - destination:
        host: myapp
        port:
          number: 8080
EOF
```

### Create a Gateway
```bash
kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1
kind: Gateway
metadata:
  name: myapp-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "myapp.example.com"
EOF
```

### Enable Ambient Mode (Istio 1.22+, sidecar-free)
```bash
# Install Istio with ambient mode enabled (K8s 1.28+ required)
helm install istiod istio/istiod -n istio-system --set profile=ambient

# Install ztunnel (per-node proxy replacing sidecars)
helm install istio-cni istio/cni -n istio-system --set profile=ambient
helm install ztunnel istio/ztunnel -n istio-system

# Enable ambient mode for a namespace (no pod restart needed)
kubectl label namespace default istio.io/dataplane-mode=ambient

# Verify
kubectl get pods -n default  # No sidecar containers injected
istioctl ztunnel-config
```

## Useful Commands
```bash
# Check Istio version
istioctl version

# Verify configuration
istioctl analyze

# Get sidecar injection status
kubectl get namespaces --show-labels | grep istio

# Uninstall Istio
helm uninstall istiod -n istio-system
helm uninstall istio-base -n istio-system
helm uninstall istio-ingressgateway -n istio-ingress
```

## Recommended Add-ons
- **Kiali**: Service mesh visualization and troubleshooting
- **Jaeger**: Distributed tracing
- **Prometheus**: Metrics collection (already installed via kube-prometheus-stack)
- **Grafana**: Metrics visualization (already installed via kube-prometheus-stack)

## Resources
- **Official Documentation**: https://istio.io/latest/docs/
- **GitHub Repository**: https://github.com/istio/istio
- **Samples**: https://github.com/istio/istio/tree/master/samples

## Notes
- Istio adds sidecar containers to pods for traffic management
- Requires sufficient cluster resources (CRDs, controllers, gateways)
- Integrates well with Prometheus and Grafana for observability
- Can impact network latency - monitor performance
