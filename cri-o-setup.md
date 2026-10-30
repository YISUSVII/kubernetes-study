# CRI-O Setup Notes

> **October 29, 2026 release check**: [CRI-O v1.37.2](https://github.com/cri-o/cri-o/releases/tag/v1.37.2). Match CRI-O's minor release to Kubernetes; this is not the correct runtime pin for a 1.35/1.36 study cluster. Select the corresponding supported, patched runtime branch instead.

CRI-O implements Kubernetes' Container Runtime Interface using OCI-compatible runtimes. It focuses on Kubernetes workloads rather than Docker's general-purpose developer interface. containerd and CRI-O are alternative node runtimes; you do not install both as competing kubelet endpoints on the same study node.

## Prerequisites and installation boundaries

Start with a disposable Linux VM and a CRI-O release supported for the intended Kubernetes minor. CRI-O release branches align with Kubernetes minors; consult the [compatibility guidance](https://github.com/cri-o/cri-o#compatibility-matrix-cri-o--kubernetes) rather than assuming any newer runtime will work. Use the [official packaging instructions](https://github.com/cri-o/packaging) for your distribution and selected release. Do not reuse obsolete Kubic repository instructions from old tutorials.

Install the supported package, runtime dependencies, and your Kubernetes distribution's required host configuration before joining the node. Choose a compatible CNI separately. Review `/etc/crio/crio.conf` and drop-ins under `/etc/crio/crio.conf.d/`; package defaults and distribution overrides can differ. The common CRI socket is `/var/run/crio/crio.sock`. Configure kubelet to use the actual socket and match the runtime's cgroup driver, normally systemd on systemd hosts.

On a new kubeadm node with multiple runtimes installed, specify the intended CRI socket explicitly in kubeadm configuration; do not guess from the presence of a running service. Do not reconfigure a production node's kubelet endpoint as a study exercise.

## Lab

First identify the runtime reported by Kubernetes:

```bash
kubectl get nodes -o custom-columns=NAME:.metadata.name,RUNTIME:.status.nodeInfo.containerRuntimeVersion
```

The following diagnostics run on an authorized CRI-O Linux node, not in a local Windows PowerShell session. Install a supported `crictl` and use the actual socket path:

```bash
crio --version
systemctl status crio --no-pager
crictl --runtime-endpoint unix:///var/run/crio/crio.sock \
  --image-endpoint unix:///var/run/crio/crio.sock info
crictl --runtime-endpoint unix:///var/run/crio/crio.sock pods
crictl --runtime-endpoint unix:///var/run/crio/crio.sock ps -a
journalctl -u crio -n 100 --no-pager
```

Use your approved host access workflow if socket permissions require elevation. Expect successful CRI calls and RuntimeReady; pod NetworkReady additionally depends on CNI installation. Never grant untrusted users access to the runtime socket.

From a terminal with cluster access, target a node you verified is running CRI-O. This Bash example uses a node selector, leaving scheduling and runtime lifecycle with Kubernetes:

```bash
export CRIO_NODE='<verified-crio-node-name>'
kubectl create namespace crio-study
kubectl run runtime-check -n crio-study --image=busybox:1.37 \
  --restart=Never \
  --overrides="{\"spec\":{\"nodeSelector\":{\"kubernetes.io/hostname\":\"${CRIO_NODE}\"}}}" \
  -- /bin/sh -c 'echo hello-crio; sleep 300'
kubectl wait --for=condition=Ready pod/runtime-check -n crio-study --timeout=120s
kubectl logs runtime-check -n crio-study
```

Use the node's `kubernetes.io/hostname` label value if it differs from its name. Expect `hello-crio` and a matching sandbox/container in that node's `crictl` output. This does not install CRI-O on an existing containerd node.

## Troubleshooting and cleanup

For failed sandbox creation, inspect CRI-O and kubelet logs, CNI configuration, cgroup driver agreement, image availability, and SELinux/AppArmor denials. Prefer supported policies and package fixes rather than disabling host security. A ready runtime cannot compensate for missing networking or incompatible kubelet configuration.

```bash
kubectl delete namespace crio-study
```

Delete Kubernetes workloads through Kubernetes, not through runtime commands. Dispose of the standalone VM after the lab. For a real runtime upgrade, follow the distribution's supported drain/upgrade/rollback process; do not uninstall a runtime beneath active workloads. Exercise: compare CRI-O and containerd's CRI diagnostics without changing the Pod's Kubernetes API definition.

## References

- [CRI-O project and release policy](https://cri-o.io/)
- [CRI-O packaging](https://github.com/cri-o/packaging)
- [Kubernetes runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)
- [containerd comparison lab](containerd-setup.md)