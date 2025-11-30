# Calico Network Policy Setup Notes

## Prerequisites
```bash
# Add Calico Helm repository
helm repo add projectcalico https://projectcalico.docs.tigera.io/charts

# Update Helm repositories
helm repo update
```

## Installation

### 1. Create tigera-operator namespace
```bash
kubectl create namespace tigera-operator
```

### 2. Install Calico using Helm
```bash
helm install calico projectcalico/tigera-operator --namespace tigera-operator
```

### 3. Verify Installation
```bash
# Check Calico pods
kubectl get pods -n calico-system
kubectl get pods -n tigera-operator

# Check Calico CRDs
kubectl get crds | grep calico

# Verify network connectivity
kubectl run -it --rm debug --image=busybox --restart=Never -- ping 8.8.8.8
```

## Network Policy Examples

### 1. Deny all ingress traffic by default
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-ingress
spec:
  podSelector: {}
  policyTypes:
  - Ingress
EOF
```

### 2. Allow traffic from specific namespace
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-from-namespace
spec:
  podSelector:
    matchLabels:
      app: myapp
  policyTypes:
  - Ingress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: allowed-namespace
    ports:
    - protocol: TCP
      port: 8080
EOF
```

### 3. Allow specific pod communication
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-specific-pods
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 5000
EOF
```

### 4. Allow egress to specific service
```bash
kubectl apply -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-egress-dns
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: kube-system
    ports:
    - protocol: UDP
      port: 53
EOF
```

### 5. Calico GlobalNetworkPolicy (cluster-wide)
```bash
kubectl apply -f - <<EOF
apiVersion: crd.projectcalico.org/v1
kind: GlobalNetworkPolicy
metadata:
  name: deny-cross-namespace
spec:
  order: 1
  selector: "all()"
  namespaceSelector: ""
  types:
  - Ingress
  ingress:
  - action: Deny
    source:
      namespaceSelector: "kubernetes.io/metadata.name != 'kube-system'"
    destination: {}
EOF
```

## Useful Commands
```bash
# View Calico nodes
calicoctl get nodes

# View Calico workloads (pods)
calicoctl get workloadendpoints

# View IP pools
calicoctl get ippools

# View Network Policies
kubectl get networkpolicy --all-namespaces

# Describe NetworkPolicy
kubectl describe networkpolicy <policy-name>

# Check Calico logs
kubectl logs -n calico-system -l k8s-app=calico-node -f

# Access Calico Manager UI (if installed)
# kubectl port-forward -n calico-system svc/calico-typha 5055:5055
```

## Advanced Configurations

### 1. Enable Calico IP autodetection
```bash
# Check current autodetection
calicoctl get felixconfig default -o yaml | grep autodetectionMethod

# Set autodetection method
kubectl patch felixconfig default --type merge -p '{"spec":{"autodetectionMethod":"kubernetes"}}'
```

### 2. Increase MTU for better performance
```bash
kubectl set env daemonset/calico-node -n calico-system FELIX_XDPMODE=native
```

### 3. Enable encryption between pods
```bash
kubectl patch installation default --type merge -p '{"spec":{"calicoNetwork":{"encryption":"wireguard"}}}'
```

## Network Policy Best Practices
1. Start with deny-all policies, then allow specific traffic
2. Use labels for pod selection (more maintainable)
3. Separate ingress and egress policies
4. Test policies in development before production
5. Monitor network policy violations with logs
6. Document policy purposes with annotations
7. Use namespace-level policies for coarse-grained control

## Debugging Commands
```bash
# Test connectivity between pods
kubectl exec -it <pod> -- ping <target-pod-ip>

# Check iptables rules (Calico uses iptables internally)
kubectl exec -it <pod> -- iptables -L -n

# View packet drops
kubectl logs -n calico-system -l k8s-app=calico-node | grep "drop"

# Verify DNS resolution
kubectl exec -it <pod> -- nslookup kubernetes.default
```

## Resources
- **Official Documentation**: https://docs.tigera.io/
- **Calico Network Policies**: https://docs.tigera.io/reference/resources/networkpolicy
- **GitHub Repository**: https://github.com/projectcalico/calico

## Notes
- Calico provides both network policies and BGP routing
- Supports both overlay and non-overlay networking
- Can work alongside other CNI plugins
- Essential for security in multi-tenant Kubernetes clusters
- Integrates well with Kubernetes RBAC
