# Velero Setup Notes

> **October 29, 2026 release check**: [Velero v1.18.4](https://github.com/vmware-tanzu/velero/releases/tag/v1.18.4). Match CLI/server and provider-plugin compatibility; the AWS plugin has its own release version. A successful backup is not a verified restore.

Velero backs up and restores Kubernetes API resources and, when explicitly configured, persistent volume data. A backup containing a PVC object does not necessarily contain the bytes stored in that volume. This first lab intentionally backs up only a namespace and a ConfigMap.

## Prerequisites and installation

Use a disposable cluster, a compatible Velero CLI/server pair, and an external object storage bucket with a supported provider plugin. Check the [installation guide](https://velero.io/docs/) for your selected stable release, not the development `main` documentation. Provider plugins have their own compatibility matrices and credential requirements.

For an AWS S3 metadata-only lab, create a dedicated bucket and scoped credentials using the [AWS plugin instructions](https://github.com/vmware-tanzu/velero-plugin-for-aws). Do not use a production backup bucket. Install the CLI from official releases and replace all placeholders below in Bash. Configure a local credential file outside the repository with restrictive permissions; never paste credentials into Git or a shared terminal transcript.

```bash
export BUCKET='<existing-dedicated-bucket>'
export AWS_REGION='<bucket-region>'
export AWS_PLUGIN_VERSION='<compatible-plugin-version>'
export CREDENTIALS_FILE='<absolute-path-to-local-credentials-file>'
velero install --provider aws \
  --plugins "velero/velero-plugin-for-aws:${AWS_PLUGIN_VERSION}" \
  --bucket "$BUCKET" --prefix kubernetes-study \
  --backup-location-config "region=${AWS_REGION}" \
  --secret-file "$CREDENTIALS_FILE" --use-volume-snapshots=false --wait
velero version
velero backup-location get
```

Prefer workload identity for real deployments; use the plugin's corresponding installation flags rather than creating long-lived keys. Azure, GCP, and S3-compatible storage require their own provider-specific setup, endpoints, and permissions. Do not assume the AWS example works unchanged with another service. The backup location must report Available before continuing.

## Lab

```bash
kubectl create namespace velero-study
kubectl create configmap recovery-marker -n velero-study --from-literal=message=hello-velero
velero backup create study-backup --include-namespaces velero-study \
  --include-resources namespaces,configmaps --snapshot-volumes=false --wait
velero backup describe study-backup --details
velero backup logs study-backup
```

Do not delete the source until the backup phase is Completed and you have reviewed all warnings/errors. A PartiallyFailed backup is not a successful recovery checkpoint. Then deliberately delete only the disposable namespace and restore it:

```bash
kubectl delete namespace velero-study --wait=true
velero restore create study-restore --from-backup study-backup --wait
velero restore describe study-restore --details
kubectl get configmap recovery-marker -n velero-study -o jsonpath='{.data.message}'
```

Expect `hello-velero`. Verify the restored content, not only the restore object's phase. Exercise: restore into a different namespace using `--namespace-mappings velero-study:velero-restored` and compare the results.

## Persistent data and production boundaries

For volume data, deliberately select CSI snapshots, snapshot data movement, or filesystem backup based on the storage driver's support. Install the required snapshot APIs/controllers or node agent, configure the backup method, and verify recovery on another cluster. Application consistency may require quiescing writes or database-native backups/hooks. A storage snapshot that remains in the same failure domain is not automatically an off-site backup.

Velero does not replace etcd/control-plane backup, recreate cloud infrastructure by itself, or guarantee compatibility between removed Kubernetes API versions. Encrypt backups, restrict bucket/report access, define retention, and measure recovery time and recovery point objectives through restores.

## Troubleshooting and cleanup

Unavailable backup locations usually indicate provider credentials, region, endpoint, or bucket permission errors. For failed restores, inspect Velero logs, existing resource conflicts, missing CRDs, and storage compatibility.

```bash
kubectl delete namespace velero-study
velero restore delete study-restore --confirm
velero backup delete study-backup --confirm
```

Backup deletion also deletes its stored artifacts; run it only against this disposable backup. Wait for deletion to finish before uninstalling Velero. Follow the selected release's uninstall instructions and separately review bucket contents, snapshots, IAM resources, and charges. Never remove a shared backup bucket as routine cleanup.

## References

- [Velero documentation and stable versions](https://velero.io/docs/)
- [Supported provider plugins](https://velero.io/plugins/)
- [Longhorn persistence lab](longhorn-setup.md)