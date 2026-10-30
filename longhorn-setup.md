# Longhorn Setup Notes

> **October 29, 2026 release check**: [Longhorn v1.13.0](https://github.com/longhorn/longhorn/releases/tag/v1.13.0) requires **Kubernetes 1.34 or later**. V2 sharded volumes remain evaluation-only and do not support backup/restore or several other volume workflows; use ordinary volumes for this lab and review the release's upgrade requirements before touching existing storage.

Longhorn provides distributed persistent block storage through CSI. Replicas improve availability but are not independent backups: deletion, corruption, and cluster loss still require a tested recovery strategy.

## Prerequisites and installation

Use disposable Linux VM nodes with persistent disks, enough free capacity, supported Kubernetes versions, and permission for privileged storage components. For the V1 data engine used here, prepare `open-iscsi` with a running `iscsid`, supported ext4/XFS storage, and mount propagation on every relevant node. RWX volumes additionally need NFS client support. Follow the [release-specific prerequisites](https://longhorn.io/docs/latest/deploy/install/), including host package compatibility warnings. Container-in-container clusters are not a substitute for checking these requirements.

Install the matching `longhornctl` from official releases and run `longhornctl check preflight` before installing the chart. Fix reported host issues first. V2/SPDK has different kernel, disk, CPU, and hugepage requirements and is outside this lab.

```bash
helm repo add longhorn https://charts.longhorn.io
helm repo update
helm search repo longhorn/longhorn --versions
export CHART_VERSION='<selected-chart-version>'
helm show chart longhorn/longhorn --version "$CHART_VERSION"
helm install longhorn longhorn/longhorn --version "$CHART_VERSION" \
  -n longhorn-system --create-namespace \
  --set defaultSettings.defaultReplicaCount=1 \
  --set persistence.defaultClass=false --wait --timeout 10m
kubectl get pods -n longhorn-system
```

Commands use Bash. One replica is a single-node study concession, not an HA configuration. The chart is configured not to replace your default StorageClass.

## Lab

Create an explicit StorageClass so this PVC does not depend on cluster defaults or chart-generated replica settings:

```bash
kubectl create namespace longhorn-study
kubectl apply -f - <<'EOF'
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: longhorn-study
provisioner: driver.longhorn.io
allowVolumeExpansion: true
reclaimPolicy: Delete
volumeBindingMode: Immediate
parameters:
  numberOfReplicas: "1"
  dataEngine: v1
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: data
  namespace: longhorn-study
spec:
  accessModes: [ReadWriteOnce]
  storageClassName: longhorn-study
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: Pod
metadata:
  name: writer
  namespace: longhorn-study
spec:
  containers:
    - name: writer
      image: busybox:1.37
      command: [sh, -c, "test -f /data/message || echo hello-longhorn > /data/message; sleep 3600"]
      volumeMounts:
        - name: data
          mountPath: /data
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: data
EOF
kubectl wait --for=condition=Ready pod/writer -n longhorn-study --timeout=180s
kubectl get pvc -n longhorn-study
kubectl exec -n longhorn-study writer -- cat /data/message
kubectl get volumes.longhorn.io -n longhorn-system
```

Expect a Bound PVC and `hello-longhorn` in the mounted file. Exercise: write a different value, delete only the writer Pod, recreate it from the same manifest, and verify that the changed value survives. This proves persistence across pod recreation, not recovery after disk or node loss. Use localhost port-forwarding to access `svc/longhorn-frontend` in `longhorn-system`; do not publish the unauthenticated UI.

## Troubleshooting and cleanup

For Pending PVCs or attachment failures, inspect PVC events, CSI pods, disk schedulability/free space, `iscsid`, and Longhorn node conditions. Do not remove finalizers to force storage deletion.

These commands destroy the lab data:

```bash
kubectl delete pod writer -n longhorn-study
kubectl delete pvc data -n longhorn-study
kubectl delete namespace longhorn-study
kubectl delete storageclass longhorn-study
```

Keep Longhorn installed if any other volume uses it. To remove an isolated installation, first verify all volumes are backed up or disposable, then follow the [official uninstall sequence](https://longhorn.io/docs/latest/deploy/uninstall/), including its deletion-confirmation setting and uninstall job. Do not simply delete the system namespace or its CRDs.

## References

- [Helm installation](https://longhorn.io/docs/latest/deploy/install/install-with-helm/)
- [Snapshots and backups](https://longhorn.io/docs/latest/snapshots-and-backups/)