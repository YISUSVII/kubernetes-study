# Karpenter Setup Notes

> **October 29, 2026 release check**: AWS provider [v1.15.1](https://github.com/aws/karpenter-provider-aws/releases/tag/v1.15.1). This is an AWS-specific release, not a universal cloud-provider version. Verify Kubernetes, controller, CRD, IAM, and node-image compatibility together.

Karpenter provisions nodes for unschedulable Pods and can consolidate capacity afterward. KEDA/HPA adjust workload replicas; Karpenter supplies node capacity. It requires a supported provider and is not a general-purpose node provisioner for a local kind cluster.

## Prerequisites and installation

This guide uses the AWS provider on a disposable EKS cluster. You need an AWS account, budget controls, AWS CLI, kubectl, Helm, Bash, and permissions to create the required IAM/network/compute resources. Nodes, load balancers, storage, and control planes can incur charges. Never run this exercise in a production account without a reviewed plan.

Follow the [official getting-started sequence](https://karpenter.sh/docs/getting-started/getting-started-with-karpenter/) for a selected supported release. It provisions the controller identity, node IAM role and cluster access, subnet/security-group discovery tags, and interruption handling resources. Keep baseline capacity for the controller and DNS independent of Karpenter to avoid bootstrap deadlocks. EKS Auto Mode and AKS node autoprovisioning use provider-managed integrations; do not install this AWS chart over those integrations.

After completing the official controller installation, verify the environment:

```bash
aws sts get-caller-identity
kubectl get nodes
kubectl get deployments -n kube-system -l app.kubernetes.io/name=karpenter
kubectl get crd nodepools.karpenter.sh ec2nodeclasses.karpenter.k8s.aws
```

Use the namespace chosen during installation if it differs from `kube-system`. Pin the controller/chart, CRDs, and a compatible AMI; follow release migration guidance instead of combining manifests from different versions.

## Lab

Create and verify an `EC2NodeClass` named `study` using the provider's [NodeClass instructions](https://karpenter.sh/docs/concepts/nodeclasses/). It must select your authorized node IAM role, tagged subnets/security groups, and a pinned AMI matching your Kubernetes version. These are account-specific prerequisites and cannot be replaced by a universal copy-and-paste manifest.

With that NodeClass Ready, apply a limited NodePool. The taint isolates lab workloads; it is not an account spending limit.

```bash
kubectl apply -f - <<'EOF'
apiVersion: karpenter.sh/v1
kind: NodePool
metadata:
  name: study
spec:
  template:
    spec:
      nodeClassRef:
        group: karpenter.k8s.aws
        kind: EC2NodeClass
        name: study
      taints:
        - key: study.example.org/dedicated
          value: karpenter
          effect: NoSchedule
      requirements:
        - key: kubernetes.io/arch
          operator: In
          values: [amd64]
        - key: kubernetes.io/os
          operator: In
          values: [linux]
        - key: karpenter.sh/capacity-type
          operator: In
          values: [on-demand]
      expireAfter: 24h
  limits:
    cpu: "8"
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized
    consolidateAfter: 1m
---
apiVersion: v1
kind: Pod
metadata:
  name: capacity-test
spec:
  nodeSelector:
    karpenter.sh/nodepool: study
  tolerations:
    - key: study.example.org/dedicated
      operator: Equal
      value: karpenter
      effect: NoSchedule
  containers:
    - name: pause
      image: registry.k8s.io/pause:3.10
      resources:
        requests:
          cpu: "1"
          memory: 128Mi
EOF
kubectl get nodepool study
kubectl get nodeclaims -l karpenter.sh/nodepool=study
kubectl get pod capacity-test -o wide
kubectl logs -n kube-system -l app.kubernetes.io/name=karpenter -c controller --tail=100
```

Expect the Pod to progress from Pending to Running on a new Ready node. NodePool limits are eventually consistent and do not provide a strict cost cap. DaemonSet overhead counts toward node sizing; overly restrictive limits can prevent provisioning entirely.

## Troubleshooting and cleanup

Inspect Pod scheduling events, NodePool/NodeClass conditions, NodeClaims, and controller logs. Common blockers are missing IAM/cluster authorization, incorrect discovery tags, incompatible AMIs, unavailable instance capacity, and requirements that cannot fit inside pool limits. Consolidation is constrained by disruption budgets and workload scheduling requirements.

```bash
kubectl delete pod capacity-test
kubectl delete nodepool study --wait=true
kubectl get nodeclaims -l karpenter.sh/nodepool=study
kubectl delete ec2nodeclass study
```

Keep the controller running until its finalizers complete and confirm the corresponding cloud instances terminated. Do not force-remove finalizers or uninstall the controller first. Then follow the official teardown for the disposable cluster, IAM resources, interruption queue, and stacks you created; verify the account for remaining billable resources.

## References

- [NodePool concepts](https://karpenter.sh/docs/concepts/nodepools/)
- [Karpenter disruption](https://karpenter.sh/docs/concepts/disruption/)
- [Workload autoscaling with KEDA](keda-setup.md)