# Kubernetes Gateway API Setup Notes

## Overview

**Gateway API** is the next-generation Kubernetes API for L4 and L7 routing, replacing the older Ingress API. It offers more expressive, extensible, and role-oriented traffic routing capabilities.

### Key Differences from Ingress

| Feature | Ingress | Gateway API |
|---------|---------|------------|
| **Maturity** | Stable (but limited) | Standard Channel (v0.5+) |
| **Route Matching** | Host and path only | Host, path, headers, methods, query params |
| **Traffic Splitting** | Via annotations | Native support |
| **TLS** | Via annotations | Native support |
| **Role-Oriented** | Single flat API | Separate resources for different roles |
| **Cross-Namespace** | Limited | Full support with ReferenceGrant |
| **Protocol Support** | HTTP/HTTPS | HTTP, HTTPS, gRPC, TCP, UDP |

## Core Concepts

### Three Main Personas
1. **Infrastructure Provider** - Manages shared infrastructure (cloud provider, cluster admin)
2. **Cluster Operator** - Manages cluster policies and networking
3. **Application Developer** - Manages application routing and services

### Resource Hierarchy
```
GatewayClass (Controller type) 
  ↓
Gateway (Instance of traffic handler)
  ↓
Route (HTTPRoute, GRPCRoute, TCPRoute, etc.)
  ↓
Service (Backend)
```

## Prerequisites

### 1. Install Gateway API CRDs
```bash
# Install Gateway API custom resources
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml

# Verify CRDs installation
kubectl get crd | grep gateway
```

### 2. Install a Gateway Controller Implementation

Popular implementations:
- **Nginx** - `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml`
- **Istio** - Works natively with Gateway API
- **Envoy Gateway** - Purpose-built implementation
- **Kong** - API gateway supporting Gateway API
- **AWS ALB** - AWS managed implementation

## Quick Start Example

### 1. Create GatewayClass (Infrastructure Provider)
```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: nginx-gateway
spec:
  controllerName: k8s.io/ingress-nginx
EOF
```

### 2. Create Gateway (Cluster Operator)
```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: mygateway
  namespace: default
spec:
  gatewayClassName: nginx-gateway
  listeners:
  - name: http
    protocol: HTTP
    port: 80
  - name: https
    protocol: HTTPS
    port: 443
    tls:
      mode: Terminate
      certificateRefs:
      - name: my-tls-cert
EOF
```

### 3. Create HTTPRoute (Application Developer)
```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: myapp-route
spec:
  parentRefs:
  - name: mygateway
  hostnames:
  - myapp.example.com
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /
    backendRefs:
    - name: myapp-service
      port: 8080
EOF
```

## Installation Methods

### Method 1: Install Standard CRDs Only
```bash
# Minimal installation (CRDs only, no controller)
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.1.0/standard-install.yaml

# Then install your preferred controller separately
```

### Method 2: Install with Nginx Ingress Controller
```bash
# Install Nginx with Gateway API support
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.enableGatewayApi=true
```

### Method 3: Install with Istio
```bash
# Istio comes with Gateway API support built-in
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm install istio-base istio/base -n istio-system --create-namespace
helm install istiod istio/istiod -n istio-system
```

### Method 4: Install Envoy Gateway (Purpose-built)
```bash
# Add Envoy Gateway repository
helm repo add envoy-gateway https://gateway.envoyproxy.io/charts
helm repo update

# Install Envoy Gateway
helm install envoy-gateway envoy-gateway/gateway -n envoy-gateway --create-namespace
```

## Advanced Examples

### 1. HTTPRoute with Header Matching
```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: api-route
spec:
  parentRefs:
  - name: mygateway
  hostnames:
  - api.example.com
  rules:
  - matches:
    - path:
        type: PathPrefix
        value: /api/v1
      headers:
      - name: X-Version
        value: beta
    backendRefs:
    - name: api-service
      port: 8080
    timeouts:
      request: 30s
      backendRequest: 25s
EOF
```

### 2. Traffic Splitting (Canary Deployment)
```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: canary-route
spec:
  parentRefs:
  - name: mygateway
  hostnames:
  - app.example.com
  rules:
  - backendRefs:
    - name: app-service-stable
      port: 8080
      weight: 90
    - name: app-service-canary
      port: 8080
      weight: 10
EOF
```

### 3. HTTPRoute with Redirects
```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: redirect-route
spec:
  parentRefs:
  - name: mygateway
  hostnames:
  - old-domain.com
  rules:
  - filters:
    - type: RequestRedirect
      requestRedirect:
        scheme: https
        hostname: new-domain.com
        statusCode: 301
EOF
```

### 4. HTTPRoute with Header Modifications
```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: header-route
spec:
  parentRefs:
  - name: mygateway
  rules:
  - filters:
    - type: RequestHeaderModifier
      requestHeaderModifier:
        add:
          X-Custom-Header: "custom-value"
        remove:
        - X-Internal-Header
    - type: ResponseHeaderModifier
      responseHeaderModifier:
        add:
          X-Server: "MyServer/1.0"
    backendRefs:
    - name: backend-service
      port: 8080
EOF
```

### 5. GRPCRoute Example
```bash
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: GRPCRoute
metadata:
  name: grpc-api-route
spec:
  parentRefs:
  - name: mygateway
  hostnames:
  - grpc.example.com
  rules:
  - matches:
    - method:
        service: com.example.Service
        method: GetData
    backendRefs:
    - name: grpc-backend
      port: 50051
EOF
```

### 6. Cross-Namespace Routing (with ReferenceGrant)
```bash
# Grant permission for backend in different namespace
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1beta1
kind: ReferenceGrant
metadata:
  name: allow-cross-namespace
  namespace: backend-namespace
spec:
  from:
  - group: gateway.networking.k8s.io
    kind: HTTPRoute
    namespace: gateway-namespace
  to:
  - group: ""
    kind: Service
EOF

# HTTPRoute in gateway-namespace can now reference backend-namespace services
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: cross-ns-route
  namespace: gateway-namespace
spec:
  parentRefs:
  - name: mygateway
  rules:
  - backendRefs:
    - name: backend-service
      namespace: backend-namespace
      port: 8080
EOF
```

## Useful Commands

```bash
# List Gateway Classes
kubectl get gatewayclass

# List Gateways
kubectl get gateway --all-namespaces

# List HTTPRoutes
kubectl get httproute --all-namespaces

# List GRPCRoutes
kubectl get grpcroute --all-namespaces

# Describe Gateway
kubectl describe gateway <gateway-name>

# Describe HTTPRoute
kubectl describe httproute <route-name>

# Check Gateway status
kubectl get gateway -o wide

# View route status and conditions
kubectl get httproute -o jsonpath='{.items[*].status.parents}'

# Check if route is attached to gateway
kubectl get httproute <route-name> -o yaml | grep -A5 "status:"

# Install gwctl (Gateway API CLI)
go install github.com/kubernetes-sigs/gateway-api/gwctl/cmd/gwctl@latest

# Use gwctl for better visibility
gwctl get gatewayclasses
gwctl get gateways
gwctl get httproutes
```

## Migrating from Ingress to Gateway API

### Comparison: Ingress vs Gateway API

**Old Ingress:**
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: old-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - example.com
    secretName: example-tls
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
EOF
```

**New Gateway API:**
```bash
# Step 1: Create GatewayClass
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: nginx
spec:
  controllerName: k8s.io/ingress-nginx
EOF

# Step 2: Create Gateway
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
spec:
  gatewayClassName: nginx
  listeners:
  - name: https
    protocol: HTTPS
    port: 443
    tls:
      mode: Terminate
      certificateRefs:
      - name: example-tls
EOF

# Step 3: Create HTTPRoute
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: example-route
spec:
  parentRefs:
  - name: example-gateway
  hostnames:
  - example.com
  rules:
  - backendRefs:
    - name: web-service
      port: 80
EOF
```

## Role-Based Access Control (RBAC) Examples

```bash
# Infrastructure Provider role
kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: gateway-admin
rules:
- apiGroups: ["gateway.networking.k8s.io"]
  resources: ["gatewayclasses", "gateways"]
  verbs: ["*"]
EOF

# Cluster Operator role
kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: gateway-operator
rules:
- apiGroups: ["gateway.networking.k8s.io"]
  resources: ["gateways"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["gateway.networking.k8s.io"]
  resources: ["httproutes", "grpcroutes"]
  verbs: ["*"]
EOF

# Application Developer role
kubectl apply -f - <<EOF
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: gateway-developer
rules:
- apiGroups: ["gateway.networking.k8s.io"]
  resources: ["httproutes", "grpcroutes"]
  verbs: ["get", "list", "watch", "create", "update"]
EOF
```

## Troubleshooting

### Check Gateway Status
```bash
# See if gateway is ready
kubectl describe gateway <gateway-name>

# Check listeners status
kubectl get gateway <gateway-name> -o jsonpath='{.status.listeners}'

# Check gateway conditions
kubectl get gateway <gateway-name> -o jsonpath='{.status.conditions}'
```

### Check Route Attachment
```bash
# Verify if route is attached to gateway
kubectl get httproute <route-name> -o yaml | grep -A10 "status:"

# View route parents
kubectl get httproute <route-name> -o jsonpath='{.status.parents}'
```

### Common Issues

**Issue: Route not attaching to Gateway**
```bash
# Check if parentRef name matches
# Check if route namespace is allowed
# Verify ReferenceGrant if cross-namespace

kubectl describe httproute <route-name>
```

**Issue: Controller not managing Gateway**
```bash
# Verify GatewayClass controller name
kubectl get gatewayclass -o yaml

# Check controller logs
kubectl logs -n ingress-nginx -l app=ingress-nginx
```

## Best Practices

1. **Separate Concerns**: Use different namespaces for infrastructure, operators, and developers
2. **RBAC**: Implement proper RBAC for different personas
3. **Use ReferenceGrant**: For cross-namespace references in multi-tenant clusters
4. **Traffic Splitting**: Use for canary and blue-green deployments
5. **Monitoring**: Monitor Gateway and Route status
6. **Gradual Migration**: Migrate from Ingress to Gateway API incrementally
7. **Documentation**: Document your gateway classes and policies
8. **Policy Attachment**: Use policy attachment for cross-cutting concerns

## Implementations Comparison

| Implementation | Best For | Maturity | Features |
|---|---|---|---|
| **Nginx Gateway** | Traditional web apps | Stable | Core Gateway API |
| **Istio** | Service mesh + ingress | Stable | Advanced traffic, mesh |
| **Envoy Gateway** | Native Gateway API | Stable | Full Gateway API spec |
| **Kong** | API gateway use cases | Stable | API management + Gateway |
| **AWS ALB** | AWS-native deployments | Mature | Cloud-native integration |

## Resources

- **Official Documentation**: https://gateway-api.sigs.k8s.io/
- **GitHub Repository**: https://github.com/kubernetes-sigs/gateway-api
- **API Reference**: https://gateway-api.sigs.k8s.io/reference/spec/
- **Implementations**: https://gateway-api.sigs.k8s.io/implementations/
- **Migration Guide**: https://gateway-api.sigs.k8s.io/guides/migrating-from-ingress/
- **Kubernetes Docs**: https://kubernetes.io/docs/concepts/services-networking/gateway/

## Notes

- Gateway API is the **successor to Ingress** - more expressive and role-oriented
- **Multiple implementations available** - choose based on your needs
- **Backward compatible** - Ingress resources still work, but Gateway API is recommended for new deployments
- **Stable channel** - Safe for production use
- **Extensible** - Supports custom policies and backends
- **Better for multi-tenant clusters** - Cross-namespace support with proper RBAC
