# Karmada Setup Notes

Karmada schedules Kubernetes resources across member clusters. This lab compares duplicating a workload in two clusters with dividing its replicas between them. ArgoCD can deliver resources to the Karmada API; Karmada decides their placement.

[CNCF graduated status](https://www.cncf.io/projects/karmada/) verified October 1, 2026: graduated September 3, 2026. It belongs to [Scheduling & Orchestration](https://landscape.cncf.io/guide#orchestration-management--scheduling-orchestration). Release pin: [v1.19.0](https://github.com/karmada-io/karmada/releases/tag/v1.19.0).

## Prepare the control plane

Use a disposable host Kubernetes cluster and two member clusters. Their API endpoints must be reachable from the Karmada controllers. Prepare host/member kubeconfig files; verify version support using the release documentation. Download the matching `karmadactl` binary for your OS/architecture from the release assets and put it on PATH.

On a Linux administration host with the host kubeconfig at `/absolute/path/host.config`:

```bash
sudo karmadactl init --kubeconfig /absolute/path/host.config \
  --crds https://github.com/karmada-io/karmada/releases/download/v1.19.0/crds.tar.gz \
  --karmada-controller-manager-image docker.io/karmada/karmada-controller-manager:v1.19.0 \
  --karmada-scheduler-image docker.io/karmada/karmada-scheduler:v1.19.0 \
  --karmada-webhook-image docker.io/karmada/karmada-webhook:v1.19.0 \
  --karmada-aggregated-apiserver-image docker.io/karmada/karmada-aggregated-apiserver:v1.19.0
```

Sources: [installation with CLI](https://karmada.io/docs/installation/install-with-cli/) and [init flag reference](https://karmada.io/docs/reference/karmadactl/karmadactl-commands/karmadactl_init/). The default data directory is `/etc/karmada`; protect the generated kubeconfig and certificates. This is a study setup with local etcd storage; use the upstream HA guidance for durable installations.

## Register members

Use the generated **Karmada API** kubeconfig, rather than the host cluster kubeconfig, for joins and policy operations. Run on the administration host with access to the generated file:

```bash
export KARMADA_CONFIG=/etc/karmada/karmada-apiserver.config
karmadactl --kubeconfig "$KARMADA_CONFIG" join member1 --cluster-kubeconfig /absolute/path/member1.config
karmadactl --kubeconfig "$KARMADA_CONFIG" join member2 --cluster-kubeconfig /absolute/path/member2.config
kubectl --kubeconfig "$KARMADA_CONFIG" get clusters
```

Wait until both members show Ready. Registration uses push mode; see [cluster registration](https://karmada.io/docs/userguide/clustermanager/cluster-registration/) for other modes.

## Compare replica placement

Run from the repository root. The manifests name members `member1` and `member2`; change those names if needed.

```bash
kubectl --kubeconfig "$KARMADA_CONFIG" apply -f examples/Karmada/01-workload.yaml
kubectl --kubeconfig "$KARMADA_CONFIG" apply -f examples/Karmada/02-propagation-policy.yaml
kubectl --kubeconfig /absolute/path/member1.config get deployments,services -n karmada-study
kubectl --kubeconfig /absolute/path/member2.config get deployments,services -n karmada-study
```

The policy duplicates the Deployment's two replicas in each member. Karmada propagates the namespace and selected Service as well. Services remain local to each member; this lab does not create cross-cluster networking or global traffic routing.

```bash
# Replace the existing policy to divide two total replicas with equal weights.
kubectl --kubeconfig "$KARMADA_CONFIG" apply -f examples/Karmada/03-divided-replicas.yaml
```

Check both members again: with two healthy eligible clusters, each receives one replica. The third file updates the same policy; do not apply the entire example directory as one batch. Source: [propagation and replica scheduling](https://karmada.io/docs/userguide/scheduling/propagation-policy/).

## Troubleshooting and cleanup

For missing workloads, check member Ready status, the policy's selectors, and `kubectl --kubeconfig "$KARMADA_CONFIG" get resourcebindings -n karmada-study`. Inspect host-cluster pods in `karmada-system` for controller errors. An unreachable member API cannot receive resources.

```bash
# Remove templates while placement policy and controllers still exist.
kubectl --kubeconfig "$KARMADA_CONFIG" delete -f examples/Karmada/01-workload.yaml
kubectl --kubeconfig "$KARMADA_CONFIG" delete -f examples/Karmada/02-propagation-policy.yaml --ignore-not-found
```

Confirm workload cleanup in each member. Keep the Karmada control plane and registrations if other workloads use them.
