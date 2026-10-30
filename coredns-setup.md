# CoreDNS Setup Notes

> **October 29, 2026 release check**: [CoreDNS v1.15.0](https://github.com/coredns/coredns/releases/tag/v1.15.0) includes Go security updates and compromised eMudhra CA distrust. Kubernetes distributions can intentionally ship another supported version; use their upgrade mechanism rather than replacing cluster DNS independently.

CoreDNS commonly provides Kubernetes service discovery. Its `kubernetes` plugin answers cluster service names, while `forward` usually sends external queries to upstream resolvers. The Service may still be named `kube-dns` even when its implementation is CoreDNS.

## Prerequisites and installation boundaries

Most cluster distributions install and manage DNS during bootstrap. Inspect the existing installation before adding another DNS server; do not install a competing Helm release into `kube-system`. For a new kubeadm cluster, use the [DNS addon workflow](https://kubernetes.io/docs/tasks/administer-cluster/coredns/). For managed Kubernetes, follow the provider's addon/version policy. Standalone CoreDNS is a different deployment model and does not automatically configure kubelet's cluster DNS setting.

```bash
kubectl get deployment,daemonset,service -n kube-system
kubectl get pods -n kube-system -l k8s-app=kube-dns
kubectl get configmap coredns -n kube-system -o yaml
```

Names and labels vary by distribution, and NodeLocal DNSCache can sit between Pods and CoreDNS. If the ConfigMap or label is absent, identify the provider's DNS implementation rather than creating replacements blindly. Check the CoreDNS release bundled with your cluster instead of upgrading its image independently.

## Lab

This Bash-compatible lab creates a Service with a known DNS record and queries it from another Pod. It assumes the standard `cluster.local` domain; substitute your configured cluster domain if different.

```bash
kubectl create namespace dns-study
kubectl create deployment web -n dns-study --image=nginx:stable-alpine
kubectl expose deployment web -n dns-study --port=80
kubectl run dns-client -n dns-study --image=busybox:1.37 \
  --restart=Never -- /bin/sh -c 'sleep 3600'
kubectl wait --for=condition=Ready pod/dns-client -n dns-study --timeout=120s
kubectl exec -n dns-study dns-client -- cat /etc/resolv.conf
kubectl exec -n dns-study dns-client -- nslookup kubernetes.default.svc.cluster.local
kubectl exec -n dns-study dns-client -- nslookup web.dns-study.svc.cluster.local
kubectl exec -n dns-study dns-client -- nslookup example.com
kubectl get service web -n dns-study -o wide
```

Expect the Service DNS result to match the web Service's ClusterIP. Internal DNS success with external failure points toward forwarding/upstream DNS, while failure of both suggests a cluster DNS path problem. External resolution may intentionally be blocked in restricted labs. Service name resolution does not prove the application's HTTP endpoint is healthy.

## Troubleshooting

```bash
kubectl get endpointslices -n kube-system -l kubernetes.io/service-name=kube-dns
kubectl logs -n kube-system -l k8s-app=kube-dns --tail=100
kubectl get networkpolicy -n dns-study
```

Check the resolver address in the Pod, DNS Service endpoints, node-local caching, CoreDNS readiness, CNI connectivity, and UDP **and** TCP port 53 policies. An egress default-deny policy needs DNS allowances appropriate to the actual DNS path; allowing only UDP can break larger responses or fallback. A successful lookup from the node is not proof that the Pod network can reach DNS.

Corefile changes are cluster-wide. Before a change, export the existing ConfigMap to a protected local backup and follow the provider's configuration mechanism; some providers overwrite direct edits. Validate plugin syntax and roll out only in a disposable cluster. A `loop` failure may indicate forwarding back to the same resolver, including host stub-resolver mistakes. Avoid blindly forwarding to `/etc/resolv.conf` without inspecting what it points at.

## Cleanup and exercise

```bash
kubectl delete namespace dns-study
```

Leave the shared DNS addon installed. Exercise: apply a namespace-scoped egress deny policy, reproduce the DNS failure, then add a DNS allowance using the [Calico examples](examples/Calico/) or [Cilium guide](cilium-setup.md). Record the difference between DNS resolution failure and inability to connect to the resolved address.

## References

- [Kubernetes DNS debugging](https://kubernetes.io/docs/tasks/administer-cluster/dns-debugging-resolution/)
- [CoreDNS Kubernetes plugin](https://coredns.io/plugins/kubernetes/)
- [CoreDNS forward plugin](https://coredns.io/plugins/forward/)