# Nginx Ingress Controller Setup Notes

> ⚠️ **RETIRED PROJECT (March 24, 2026)**: `kubernetes/ingress-nginx` has been archived and is now read-only. The final releases are `controller-v1.15.1` / `helm-chart-4.15.1`. Do **not** start new projects on ingress-nginx — migrate to **Gateway API** (see [gateway-api-setup.md](gateway-api-setup.md)) with a maintained implementation (e.g. Envoy Gateway, Cilium Gateway API, or Istio Gateway). Kubernetes SIG-Network provides an [ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway) migration tool. See [DEPRECATIONS.md](DEPRECATIONS.md) for full details. This guide is kept for historical/study reference only.

## Prerequisites
```bash
# Add Nginx Helm repository
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx

# Update Helm repositories
helm repo update
```

## Installation

### 1. Create ingress-nginx namespace
```bash
kubectl create namespace ingress-nginx
```

### 2. Install Nginx Ingress Controller
```bash
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --version 4.15.1 \
  --set controller.service.type=LoadBalancer
```

### Alternative: Install with NodePort (for development)
```bash
helm install nginx-ingress ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --set controller.service.type=NodePort \
  --set controller.service.nodePort.http=30080 \
  --set controller.service.nodePort.https=30443
```

## Verify Installation
```bash
# Check Nginx Ingress pods
kubectl get pods -n ingress-nginx

# Check service
kubectl get svc -n ingress-nginx

# Get external IP (LoadBalancer)
kubectl get svc -n ingress-nginx ingress-nginx-controller
```

## Basic Ingress Examples

### 1. Simple HTTP Ingress
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: simple-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp
            port:
              number: 80
EOF
```

### 2. HTTPS Ingress with TLS
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: secure-ingress
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - myapp.example.com
    secretName: myapp-tls
  rules:
  - host: myapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: myapp
            port:
              number: 8080
EOF
```

### 3. Multiple backends with path-based routing
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: multi-backend-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 8080
      - path: /admin
        pathType: Prefix
        backend:
          service:
            name: admin-service
            port:
              number: 3000
      - path: /
        pathType: Prefix
        backend:
          service:
            name: web-service
            port:
              number: 80
EOF
```

### 4. Multiple hosts (virtual hosting)
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: multi-host-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: app1.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app1-service
            port:
              number: 80
  - host: app2.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app2-service
            port:
              number: 80
EOF
```

## Advanced Annotations

### 1. Rate limiting
```bash
annotations:
  nginx.ingress.kubernetes.io/limit-rps: "10"
  nginx.ingress.kubernetes.io/limit-connections: "5"
```

### 2. Authentication
```bash
annotations:
  nginx.ingress.kubernetes.io/auth-type: basic
  nginx.ingress.kubernetes.io/auth-secret: basic-auth
  nginx.ingress.kubernetes.io/auth-realm: 'Authentication Required'
```

### 3. CORS
```bash
annotations:
  nginx.ingress.kubernetes.io/enable-cors: "true"
  nginx.ingress.kubernetes.io/cors-allow-origin: "*"
  nginx.ingress.kubernetes.io/cors-allow-credentials: "true"
```

### 4. Rewrite URL
```bash
annotations:
  nginx.ingress.kubernetes.io/rewrite-target: /$2
```

### 5. Redirect HTTP to HTTPS
```bash
annotations:
  nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
  nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.2 TLSv1.3"
```

### 6. Custom headers
```bash
annotations:
  nginx.ingress.kubernetes.io/configuration-snippet: |
    more_set_headers "Server: My Custom Server";
    more_set_headers "X-Frame-Options: DENY";
```

## Useful Commands
```bash
# List ingresses
kubectl get ingress --all-namespaces

# Describe ingress
kubectl describe ingress <ingress-name>

# Check ingress details with verbose output
kubectl get ingress <ingress-name> -o yaml

# Check Nginx controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx -f

# Access Nginx metrics
kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 10254:10254
# Access at http://localhost:10254/metrics

# Test ingress routing
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl -H "Host: myapp.example.com" http://<ingress-ip>/
```

## Monitoring

### 1. Expose metrics for Prometheus
```bash
# Metrics are available at :10254/metrics
# Add to Prometheus scrape config:
- job_name: 'nginx-ingress'
  static_configs:
  - targets: ['ingress-nginx-controller.ingress-nginx:10254']
```

### 2. View controller status
```bash
kubectl get deployment -n ingress-nginx
kubectl top pod -n ingress-nginx
```

## Configuration Examples

### Example: Full-featured Ingress with Cert-Manager
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: production-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/limit-rps: "100"
    nginx.ingress.kubernetes.io/enable-cors: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    secretName: api-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api
            port:
              number: 8080
EOF
```

## Troubleshooting

### Ingress not routing traffic
```bash
# Check ingress status
kubectl describe ingress <name>

# Check if endpoints are available
kubectl get endpoints <service-name>

# Check Nginx config
kubectl exec -it -n ingress-nginx <nginx-pod> -- cat /etc/nginx/nginx.conf

# Test service connectivity from Nginx pod
kubectl exec -it -n ingress-nginx <nginx-pod> -- curl <service-name>:<port>
```

## Best Practices
1. Use ingressClassName: nginx for clarity
2. Always use TLS in production (with cert-manager)
3. Implement rate limiting for public endpoints
4. Use namespaced ingresses for multi-tenancy
5. Monitor ingress controller metrics
6. Regularly update Nginx ingress controller
7. Test ingress rules in development first
8. Document ingress routing architecture

## Resources
- **Official Documentation**: https://kubernetes.github.io/ingress-nginx/
- **Annotations Reference**: https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/
- **GitHub Repository**: https://github.com/kubernetes/ingress-nginx

## Notes
- Nginx Ingress Controller is most popular ingress solution
- Supports both L7 (HTTP) and L4 (TCP/UDP) routing
- Can be scaled horizontally
- Integrates well with cert-manager for TLS
- Provides detailed metrics for monitoring
