# Cilium Setup Notes - 2025/2026 Best Practices
#
# Cilium is the most adopted CNI in 2025/2026:
# - Default CNI on AWS EKS, GKE Autopilot, Azure AKS (optional), KIND
# - CNCF Graduated project (2023)
# - Built on eBPF for high-performance, kernel-level networking
#
# Key advantages over Calico (2025):
# - Native eBPF datapath (no iptables, lower latency)
# - Built-in Gateway API support
# - L7 (HTTP/gRPC/Kafka) network policies
# - Hubble: real-time network observability
# - WireGuard transparent encryption
# - Better Kubernetes Gateway API integration
#
# Install via Helm (recommended):
#   helm repo add cilium https://helm.cilium.io/
#   helm install cilium cilium/cilium --version 1.19.x \
#     --namespace kube-system \
#     --set kubeProxyReplacement=true \
#     --set gatewayAPI.enabled=true \
#     --set hubble.enabled=true \
#     --set hubble.relay.enabled=true \
#     --set hubble.ui.enabled=true
#
# This file contains example policies organized as:
# - 01-ciliumnetworkpolicy-basic.yaml     → L4/L7 namespace-scoped policies
# - 02-ciliumclusterwidenetworkpolicy.yaml → Cluster-wide policies
# - 03-hubble-observability.yaml           → Network observability config
