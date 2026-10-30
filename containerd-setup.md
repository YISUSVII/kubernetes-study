# containerd Setup Notes

> **October 29, 2026 release check**: [containerd v2.4.2](https://github.com/containerd/containerd/releases/tag/v2.4.2) includes runtime security fixes. Use your distribution/provider's supported patched branch; do not replace a managed runtime or paste 1.x configuration into 2.x without migration review.

containerd is a container runtime used by Kubernetes through the Container Runtime Interface (CRI). It manages images, containers, and runtime shims; an OCI runtime such as runc executes containers. A healthy `ctr` command does not prove that the CRI service kubelet needs is healthy.

## Prerequisites and installation boundaries

Inspect your cluster's runtime before changing anything:

```bash
kubectl get nodes -o custom-columns=NAME:.metadata.name,RUNTIME:.status.nodeInfo.containerRuntimeVersion
```

For installation, use a fresh, disposable Linux VM and follow the [containerd getting-started guide](https://github.com/containerd/containerd/blob/main/docs/getting-started.md) plus your Kubernetes distribution's instructions. Select a supported containerd release for the Kubernetes minor, install compatible runc and CNI binaries, and use your distribution's systemd unit/package integration. containerd does not install a Kubernetes CNI network by itself.

The host configuration is commonly `/etc/containerd/config.toml` and the socket `/run/containerd/containerd.sock`; distributions can override both. Generate defaults using the installed binary's `containerd config default`, then review the result before placing it into service. Never overwrite an existing node's configuration with generic defaults.

Match kubelet and runtime cgroup drivers, normally `systemd` on systemd/cgroup-v2 hosts. For containerd 2.x, the generated configuration normally uses version 3 and the runtime options live under `plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options`. Older 1.x version-2 examples use `plugins.'io.containerd.grpc.v1.cri'.containerd.runtimes.runc.options`. Do not paste one path into the other version; inspect generated configuration and release documentation. Ensure CRI is not disabled.

## Lab

The following are host-level read-only diagnostics. Run them on a disposable containerd Linux node with authorized access, not in the Windows desktop shell. Install a supported [cri-tools/crictl](https://github.com/kubernetes-sigs/cri-tools) release first. Runtime socket access is highly privileged; do not make the socket world-writable.

```bash
containerd --version
systemctl status containerd --no-pager
crictl --runtime-endpoint unix:///run/containerd/containerd.sock \
  --image-endpoint unix:///run/containerd/containerd.sock info
crictl --runtime-endpoint unix:///run/containerd/containerd.sock pods
crictl --runtime-endpoint unix:///run/containerd/containerd.sock ps -a
ctr plugins ls
journalctl -u containerd -n 100 --no-pager
```

If permissions require elevation, run diagnostics yourself using your organization's authorized host access workflow. Expect CRI info to return successfully and RuntimeReady to be true. NetworkReady also depends on CNI setup; a new runtime-only VM may not have working pod networking yet.

From a terminal with cluster access, create one disposable workload:

```bash
kubectl create namespace runtime-study
kubectl run runtime-check -n runtime-study --image=busybox:1.37 \
  --restart=Never -- /bin/sh -c 'echo hello-containerd; sleep 300'
kubectl get pod runtime-check -n runtime-study -o wide
kubectl logs runtime-check -n runtime-study
```

On the node shown by the Pod's NODE field, inspect `crictl pods` and `crictl ps` again. Expect to find its sandbox/container and `hello-containerd` in workload logs. If a mixed-runtime cluster is in use, explicitly select a verified containerd node; this test does not change the runtime of the node it lands on.

## Troubleshooting and cleanup

For connection errors, check the socket configured in kubelet and the runtime service. For CRI errors with a working `ctr`, inspect CRI plugin status and disabled plugins. For sandbox failures, inspect CNI configuration, pause image availability, and cgroup settings. Image pulls can fail independently because of registry credentials, mirrors, or trust configuration.

Never delete Kubernetes containers with `ctr` or `crictl` as routine cleanup: kubelet owns their lifecycle. Do not restart or replace a managed node's runtime without the provider's maintenance process. Runtime upgrades require a planned drain, rollback path, and compatibility checks.

```bash
kubectl delete namespace runtime-study
```

Dispose of a standalone installation VM when finished; do not uninstall the runtime from a node that still belongs to a cluster. Exercise: explain why a successful `ctr images pull` may not reproduce kubelet's CRI registry settings.

## References

- [Kubernetes container runtime configuration](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)
- [containerd CRI configuration](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)