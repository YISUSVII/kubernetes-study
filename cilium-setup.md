# Cilium Setup Notes (2025/2026)

## Overview

Cilium is the most widely deployed CNI in 2025/2026:
- Default CNI on **AWS EKS**, **GKE Autopilot**, and cloud-managed clusters
- **CNCF Graduated** project (2023), backed by Isovalent/Cisco
- Built on **eBPF** — kernel-level networking, no iptables chains
- Native support for **Kubernetes Gateway API**, **NetworkPolicy**, and **AdminNetworkPolicy**
- Built-in observability via **Hubble**

### Why Cilium over Calico in 2025?

| Feature | Calico | Cilium |
|---------|--------|--------|
| **Datapath** | iptables / IPVS | eBPF (kernel bypass) |
| **L7 Policies** | ❌ | ✅ HTTP, gRPC, Kafka |
| **FQDN Egress** | ✅ | ✅ |
| **Gateway API** | Partial | ✅ Native |
| **Observability** | Limited | ✅ Hubble (real-time flows) |
| **Wireguard Encryption** | ✅ | ✅ |
| **AdminNetworkPolicy** | ✅ v3.29+ | ✅ v1.16+ |
| **Performance** | Good | Excellent (eBPF) |

## Prerequisites

```bash
# Add Cilium Helm repository
helm repo add cilium https://helm.cilium.io/
helm repo update
```

## Installation

### 1. Quick Install (new cluster)
```bash
# Install Cilium with recommended settings for K8s 1.34+
helm install cilium cilium/cilium \
  --version 1.17.x \
  --namespace kube-system \
  --set ipam.mode=kubernetes \
  --set kubeProxyReplacement=true \
  --set gatewayAPI.enabled=true \
  --set hubble.enabled=true \
  --set hubble.relay.enabled=true \
  --set hubble.ui.enabled=true \
  --set encryption.enabled=true \
  --set encryption.type=wireguard \
  --set k8sServiceHost=${KUBERNETES_SERVICE_HOST} \
  --set k8sServicePort=${KUBERNETES_SERVICE_PORT}
```

### 2. Install with Hubble only (existing cluster)
```bash
helm install cilium cilium/cilium \
  --version 1.17.x \
  --namespace kube-system \
  --set hubble.enabled=true \
  --set hubble.relay.enabled=true \
  --set hubble.ui.enabled=true
```

### 3. Verify Installation
```bash
# Check Cilium pods
kubectl get pods -n kube-system -l k8s-app=cilium

# Check all components
kubectl get pods -n kube-system | grep -E "cilium|hubble"

# Validate connectivity
cilium connectivity test
```

## Install Cilium CLI

```bash
# macOS
brew install cilium-cli

# Linux
CILIUM_CLI_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/cilium-cli/main/stable.txt)
curl -L --fail --remote-name-all \
  https://github.com/cilium/cilium-cli/releases/download/${CILIUM_CLI_VERSION}/cilium-linux-amd64.tar.gz
sudo tar xzvf cilium-linux-amd64.tar.gz -C /usr/local/bin
```

## Hubble Observability

### Access Hubble UI
```bash
# Port-forward Hubble UI
cilium hubble ui

# Or manually
kubectl port-forward -n kube-system svc/hubble-ui 12000:80
# Access at http://localhost:12000
```

### Hubble CLI
```bash
# Install hubble CLI (macOS)
brew install hubble

# Set up relay forwarding
cilium hubble port-forward &

# Observe all flows
hubble observe

# Filter by namespace
hubble observe --namespace production

# Filter by protocol
hubble observe --protocol http
hubble observe --protocol dns

# Watch specific pod traffic
hubble observe --from-pod default/frontend --to-pod default/backend

# Watch for dropped flows
hubble observe --verdict DROPPED

# Get flow statistics
hubble observe --output json | jq '.flow.verdict' | sort | uniq -c
```

## Network Policy Examples

### 1. Basic L4 Policy (same as standard NetworkPolicy)
```bash
kubectl apply -f - <<EOF
apiVersion: "cilium.io/v2"
kind: CiliumNetworkPolicy
metadata:
  name: backend-allow-frontend
  namespace: default
spec:
  endpointSelector:
    matchLabels:
      app: backend
  ingress:
  - fromEndpoints:
    - matchLabels:
        app: frontend
    toPorts:
    - ports:
      - port: "8080"
        protocol: TCP
EOF
```

### 2. L7 HTTP Policy
```bash
kubectl apply -f - <<EOF
apiVersion: "cilium.io/v2"
kind: CiliumNetworkPolicy
metadata:
  name: api-l7-policy
  namespace: default
spec:
  endpointSelector:
    matchLabels:
      app: api
  ingress:
  - fromEndpoints:
    - matchLabels:
        app: frontend
    toPorts:
    - ports:
      - port: "8080"
        protocol: TCP
      rules:
        http:
        - method: "GET"
          path: "/api/.*"
        - method: "POST"
          path: "/api/data"
EOF
```

### 3. FQDN Egress Policy
```bash
kubectl apply -f - <<EOF
apiVersion: "cilium.io/v2"
kind: CiliumNetworkPolicy
metadata:
  name: allow-external
  namespace: default
spec:
  endpointSelector:
    matchLabels:
      app: myapp
  egress:
  - toFQDNs:
    - matchName: "api.example.com"
    - matchPattern: "*.amazonaws.com"
    toPorts:
    - ports:
      - port: "443"
        protocol: TCP
EOF
```

## Gateway API with Cilium

Cilium natively implements Gateway API v1.2+ without needing NGINX:
```bash
# Cilium Gateway API is enabled with --set gatewayAPI.enabled=true
# Create a GatewayClass that uses Cilium
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: GatewayClass
metadata:
  name: cilium
spec:
  controllerName: io.cilium/gateway-controller
EOF

# Create a Gateway
kubectl apply -f - <<EOF
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: cilium-gateway
  namespace: default
spec:
  gatewayClassName: cilium
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

## Useful Commands

```bash
# Check Cilium status
cilium status

# Check connectivity
cilium connectivity test

# Monitor in real-time
cilium monitor

# Show endpoint policies
cilium endpoint list
cilium policy get

# Check network map
hubble observe --output json | head -20

# Troubleshoot dropped packets
hubble observe --verdict DROPPED --last 100

# Check encryption status
cilium encrypt status

# View service mesh
cilium service list
```

## Metrics & Monitoring

```bash
# Cilium exposes Prometheus metrics on port 9090
# Apply ServiceMonitor for kube-prometheus-stack
kubectl apply -f examples/Cilium/03-hubble-observability.yaml
```

Key Cilium Grafana dashboards (import by ID):
- **16611** - Cilium v1.x Overview
- **16612** - Cilium Operator
- **16613** - Hubble L7 HTTP Metrics

## Migration from Calico to Cilium

```bash
# 1. Install Cilium in migration mode alongside Calico
helm install cilium cilium/cilium \
  --set policyEnforcementMode=never \
  --set ipam.mode=kubernetes

# 2. Migrate CNI (node by node - requires node restart)
# Drain node
kubectl drain <node> --ignore-daemonsets --delete-emptydir-data

# 3. Remove Calico annotations from node
kubectl annotate node <node> projectcalico.org/IPv4Address-
kubectl annotate node <node> projectcalico.org/IPv4IPIPTunnelAddr-

# 4. Uncordon node
kubectl uncordon <node>

# 5. After all nodes migrated, remove Calico
helm uninstall calico -n kube-system
```

## Troubleshooting

### Pod connectivity issues
```bash
# Check endpoint status
cilium endpoint list | grep <pod-ip>

# Check policy on endpoint
cilium endpoint get <endpoint-id>

# Test connectivity
cilium connectivity test --test pod-to-pod

# View policy verdicts
hubble observe --verdict DROPPED --namespace <ns>
```

### DNS resolution issues
```bash
# Check Cilium DNS proxy
cilium monitor --type drop | grep dns

# Verify kube-dns is accessible
hubble observe --protocol dns
```

## Best Practices (2025/2026)

1. Enable **kubeProxyReplacement** for eBPF-based kube-proxy replacement
2. Enable **WireGuard encryption** for zero-trust networking
3. Use **Hubble** for network observability instead of tcpdump
4. Use **CiliumNetworkPolicy** for L7 policies (HTTP/gRPC)
5. Use standard **NetworkPolicy** for L4 policies (CNI-portable)
6. Enable **Gateway API** instead of Ingress for new deployments
7. Enable **AdminNetworkPolicy** for platform-level network control
8. Monitor with Hubble + Prometheus + Grafana dashboards
9. Use **FQDN policies** for external service allowlisting
10. Regularly run **cilium connectivity test** after cluster changes

## Resources

- **Official Documentation**: https://docs.cilium.io/
- **GitHub Repository**: https://github.com/cilium/cilium
- **Hubble**: https://github.com/cilium/hubble
- **Cilium Blog**: https://cilium.io/blog/
- **Interactive Lab**: https://play.instruqt.com/isovalent/tracks/cilium-getting-started
- **Slack**: https://slack.cilium.io/

## Notes

- Cilium requires Linux kernel 4.19+ (5.15+ recommended for all features)
- K8s 1.34+ has excellent Cilium support
- eBPF programs are loaded as kernel extensions — no iptables rules created
- Hubble provides ServiceMap and network flow visualization out of the box
- Cilium Mesh supports multi-cluster connectivity (ClusterMesh)
