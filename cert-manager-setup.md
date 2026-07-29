# Cert-Manager Setup Notes

## Prerequisites
```bash
# Add Cert-Manager Helm repository
helm repo add jetstack https://charts.jetstack.io

# Update Helm repositories
helm repo update
```

## Installation

### 1. Create cert-manager namespace
```bash
kubectl create namespace cert-manager
```

### 2. Install Cert-Manager CRDs
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.21.0/cert-manager.crds.yaml
```

### 3. Install Cert-Manager using Helm
```bash
helm install cert-manager jetstack/cert-manager --namespace cert-manager --version v1.21.0
```

> **2026 update**: v1.21.0 is current stable (July 2026). If you're on v1.19.x/v1.20.x, upgrade at least to v1.19.6/v1.20.3 — those patch releases fix a HIGH severity RBAC issue ([GHSA-8rvj-mm4h-c258](https://github.com/cert-manager/cert-manager/security/advisories/GHSA-8rvj-mm4h-c258)) where `cert-manager-edit` allowed direct creation of ACME `Challenge`/`Order` resources. See [DEPRECATIONS.md](DEPRECATIONS.md) for breaking Helm value changes in v1.21.

## Verify Installation
```bash
# Check cert-manager pods
kubectl get pods -n cert-manager

# Check cert-manager CRDs
kubectl get crds | grep cert-manager

# Verify webhook
kubectl get validatingwebhookconfigurations | grep cert-manager
```

## Issuer Setup

### 1. Self-Signed Issuer (testing only)
```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: selfsigned-issuer
  namespace: default
spec:
  selfSigned: {}
EOF
```

### 2. Let's Encrypt Staging Issuer
```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-staging
  namespace: default
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-staging-key
    solvers:
    - http01:
        ingress:
          ingressClassName: nginx
EOF
```

### 3. Let's Encrypt Production Issuer
```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-prod
  namespace: default
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-key
    solvers:
    - http01:
        ingress:
          ingressClassName: nginx
EOF
```

### 4. ClusterIssuer (cluster-wide)
```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod-cluster
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@example.com
    privateKeySecretRef:
      name: letsencrypt-prod-key-cluster
    solvers:
    - http01:
        ingress:
          ingressClassName: nginx
    - dns01:
        cloudflare:
          apiTokenSecretRef:
            name: cloudflare-api-token-secret
            key: api-token
EOF
```

## Certificate Examples

### 1. Certificate with Ingress annotation (automatic)
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    cert-manager.io/issuer: "letsencrypt-prod"
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
              number: 80
EOF
```

### 2. Manual Certificate resource
```bash
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: myapp-cert
spec:
  secretName: myapp-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  dnsNames:
  - myapp.example.com
  - www.myapp.example.com
  duration: 2160h # 90d
  renewBefore: 720h # 30d
EOF
```

## Useful Commands
```bash
# List issuers
kubectl get issuer
kubectl get clusterissuer

# List certificates
kubectl get certificate

# Describe certificate status
kubectl describe certificate <cert-name>

# View certificate details
kubectl get secret <tls-secret-name> -o jsonpath='{.data.tls\.crt}' | base64 -d | openssl x509 -text -noout

# Check cert-manager logs
kubectl logs -n cert-manager -l app.kubernetes.io/instance=cert-manager -f

# Force certificate renewal
kubectl delete secret <tls-secret-name>

# Verify certificate expiry
kubectl get certificate -o wide
```

## Debugging

### Check Certificate Status
```bash
kubectl describe certificate <cert-name>
kubectl describe certificaterequest <cert-request-name>
kubectl describe order <order-name>
kubectl describe challenge <challenge-name>
```

### View Challenge Logs
```bash
kubectl describe challenge <challenge-name>
kubectl logs -n cert-manager -l app=cert-manager --tail=100
```

## Advanced Configurations

### 1. DNS01 with AWS Route53
```bash
kubectl create secret generic aws-route53-credentials \
  --from-literal=secret-access-key=$AWS_SECRET_ACCESS_KEY \
  -n cert-manager
```

Then use in ClusterIssuer:
```bash
dns01:
  route53:
    region: us-east-1
    accessKeyID: $AWS_ACCESS_KEY_ID
    secretAccessKeySecretRef:
      name: aws-route53-credentials
      key: secret-access-key
```

### 2. HTTP01 with multiple ingress classes
```bash
solvers:
- http01:
    ingress:
      ingressClassName: nginx
- http01:
    ingress:
      ingressClassName: istio
```

## Best Practices
1. Use Let's Encrypt staging for testing
2. Use production issuer only when confident
3. Set appropriate renewal periods (30 days before expiry)
4. Monitor certificate expiry dates
5. Use ClusterIssuer for cluster-wide certificates
6. Implement rate limiting to avoid Let's Encrypt limits
7. Test DNS challenges in non-production environments first
8. Keep cert-manager updated for security patches

## Resources
- **Official Documentation**: https://cert-manager.io/
- **Installation Guide**: https://cert-manager.io/docs/installation/
- **GitHub Repository**: https://github.com/cert-manager/cert-manager

## Notes
- Cert-manager automates TLS certificate management
- Works with multiple issuers (Let's Encrypt, Vault, private CAs)
- Automatically renews certificates before expiry
- Integrates with Ingress controllers
- Essential for production Kubernetes clusters with HTTPS
