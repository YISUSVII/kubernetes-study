# Envoy Gateway Setup Notes

> **October 29, 2026 release check**: [Envoy Gateway v1.9.3](https://github.com/envoyproxy/gateway/releases/tag/v1.9.3). Keep the chart and quickstart artifacts on the same release; use its compatibility matrix for Gateway API CRDs rather than installing upstream v1.7.0 automatically.

Envoy Gateway is a Kubernetes Gateway API implementation. Its controller translates Gateway API configuration into Envoy proxy configuration; Envoy proxies carry application traffic. Installing Gateway API CRDs alone does not install a traffic-serving controller.

## Prerequisites and installation

Use a disposable cluster, Helm with OCI support, kubectl, curl, and Bash. Check the [compatibility matrix](https://gateway.envoyproxy.io/news/releases/matrix/) for both Kubernetes and Gateway API versions. If your provider manages Gateway API CRDs, follow the provider-managed CRD instructions instead of taking ownership of them with another chart.

The [official quickstart](https://gateway.envoyproxy.io/docs/tasks/quickstart/) currently demonstrates `v1.9.3`; this is a documentation reference, not a claim that the release was tested on your cluster. Review its chart and release notes before installing.

```bash
export ENVOY_GATEWAY_VERSION=v1.9.3
helm show chart oci://docker.io/envoyproxy/gateway-helm --version "$ENVOY_GATEWAY_VERSION"
helm install eg oci://docker.io/envoyproxy/gateway-helm \
  --version "$ENVOY_GATEWAY_VERSION" \
  --namespace envoy-gateway-system --create-namespace --wait --timeout 5m
kubectl get pods -n envoy-gateway-system
```

## Lab

Use a fresh namespace and the matching upstream sample, which includes the GatewayClass, Gateway, HTTPRoute, and backend. Download and review the manifest before applying it.

```bash
kubectl create namespace envoy-study
curl -fL "https://github.com/envoyproxy/gateway/releases/download/${ENVOY_GATEWAY_VERSION}/quickstart.yaml" \
  -o /tmp/envoy-quickstart.yaml
kubectl apply -n envoy-study -f /tmp/envoy-quickstart.yaml
kubectl wait -n envoy-study --for=condition=Available deployment --all --timeout=180s
kubectl get gateway,httproute -n envoy-study
kubectl describe gateway eg -n envoy-study
kubectl describe httproute backend -n envoy-study
```

Expect Accepted and ResolvedRefs conditions on the route and Programmed on the Gateway when the environment supports address provisioning. If the sample's route name changes, use the name from `kubectl get httproute`. Without a LoadBalancer implementation, discover the generated Envoy Service and port-forward it:

```bash
kubectl get service -n envoy-gateway-system \
  -l gateway.envoyproxy.io/owning-gateway-namespace=envoy-study,gateway.envoyproxy.io/owning-gateway-name=eg
```

In another terminal, substitute that Service name in `kubectl port-forward -n envoy-gateway-system svc/<ENVOY_SERVICE> 8888:80`. Then test the hostname expected by the HTTPRoute:

```bash
curl -v -H 'Host: www.example.com' http://localhost:8888/get
```

## Troubleshooting and cleanup

A 404 usually means hostname/path mismatch or an unattached route; 503 often means no ready backend endpoints. Inspect route parent conditions, Service ports, and EndpointSlices before changing proxy settings. Exercise: add a header match or weighted backends using the [Gateway API guide](gateway-api-setup.md).

```bash
kubectl delete -n envoy-study -f /tmp/envoy-quickstart.yaml
kubectl delete namespace envoy-study
helm uninstall eg -n envoy-gateway-system
```

Delete only this lab's resources. GatewayClass is cluster-scoped; use an isolated cluster so the sample cannot conflict with other installations. Do not remove shared Gateway API CRDs during cleanup.

## References

- [Envoy Gateway documentation](https://gateway.envoyproxy.io/docs/)
- [Helm installation and CRD ownership](https://gateway.envoyproxy.io/docs/install/install-helm/)
- [Gateway API examples](examples/GatewayAPI/)