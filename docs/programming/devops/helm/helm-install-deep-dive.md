# Helm Install - Deep Dive

## 1. Installation Methods

The `helm install` command can install from several sources:

- A chart repository (`helm install happy-panda bitnami/wordpress`)
- A local chart archive (`helm install foo foo-0.1.1.tgz`)
- An unpacked chart directory (`helm install foo path/to/foo`)
- A full URL (`helm install foo https://example.com/charts/foo-1.2.3.tgz`)

## 2. Resources Order of Installation

Helm installs resources in the following order:

(important parts)

- Namespace
- ServiceAccount
- Secret
- ConfigMap
- Role
- RoleBinding
- Service
- Pod
- ReplicaSet
- Deployment
- Ingress

(full list)

- Namespace
- NetworkPolicy
- ResourceQuota
- LimitRange
- PodSecurityPolicy
- PodDisruptionBudget
- ServiceAccount
- Secret
- SecretList
- ConfigMap
- StorageClass
- PersistentVolume
- PersistentVolumeClaim
- CustomResourceDefinition
- ClusterRole
- ClusterRoleList
- ClusterRoleBinding
- ClusterRoleBindingList
- Role
- RoleList
- RoleBinding
- RoleBindingList
- Service
- DaemonSet
- Pod
- ReplicationController
- ReplicaSet
- Deployment
- HorizontalPodAutoscaler
- StatefulSet
- Job
- CronJob
- Ingress
- APIService

## 3. What does `helm install` do behind the scenes?

```bash
helm upgrade CHART_NAME CHART_LOCATION --install --values values.yaml -n NAMESPACE --create-namespace
```

### - Step 1: Chart resolution

- Helm looks for the chart (`CHART_LOCATION`) either locally using a path or from a remote chart repository (like `https://charts.bitnami.com/bitnami`).
- It loads the chart into memory, including:
  - `Chart.yaml`: metadata
  - `values.yaml`: default configuration values
  - `templates/`: YAML templates with Go templating
  - Any other custom files like `NOTES.txt`
- Helm parses the `Chart.yaml` (chart metadata) and `values.yaml` (default values) using a YAML parser. If you pass a custom values file (`-f my-values.yaml`) or `--set` flags, those are also parsed.

### - Step 2: Merge Values

- Helm merges configuration values:
  - `values.yaml`
  - Any `--values` (`-f`) file provided
  - Any `--set` CLI overrides
- The result is a **single values map** used to render templates.

### - Step 3: Render Templates into `manifests`

- Helm renders the Go templates inside `templates/` directory using the merged values.
- This results in standard Kubernetes `manifests` (YAML) — like `Deployments`, `Services`, `Ingress`, `ConfigMaps`, etc.
- The `manifests` are YAML documents in **plain text**. These rendered YAMLs are still just strings at this point.

### - Step 4: Install Release to Kubernetes

- Before sending the `manifests` to Kubernetes, **Helm parses these rendered YAMLs** to:
  - Validate them structurally (to some degree)
  - Convert them to Kubernetes API-compatible JSON objects (Kubernetes API works with JSON under the hood)
  - **Invalid YAMLs here will raise errors** (e.g. bad indentation, missing colons).
  - Helm needs to convert YAML to internal objects to check for things like hooks, CRDs, kinds, etc.
  - Kubernetes itself also validates these later, but Helm catches obvious issues first.
- Helm then **connects** to the Kubernetes cluster (via `~/.kube/config` or `context`).
- It sends the rendered `manifests` to the Kubernetes API server.
- The Kubernetes API server validates and stores the `manifests` in `etcd`.
- Resources are then created by Kubernetes controllers (e.g., `Deployment` creates `Pods`).

### - Step 5: Create Release Record (in Cluster)

- Helm stores a **release object** in the cluster using `secrets`/`configmaps` in the release's namespace. (in older versions, 2 and below, it would store them under the `kube-system` namespace).
- The release record includes:
  - Rendered `manifests`
  - Chart metadata
  - Values used
  - Version info

### - Step 6: Run Hooks (if any exists)

- Helm checks for lifecycle hooks defined in templates (like pre-install, post-install).
- These jobs/pods are created and monitored.

### - Step 7: Show Output

If successful, Helm outputs the status. Release name, namespace, resources created, and any messages from `NOTES.txt` (templated and displayed).

---

## 4. When does an installation considered successful?

`helm` considers an installation (or an upgrade) successful as soon as the `manifest` is received by the kubernetes API server. It doesn't wait for the pods to be up and running.

If you want that to happen, you can use the `--wait` flag. With it, `helm` will wait for the `services` and `deployments` **to be created**, and for the `pods` **to be up and running**. Only then the installation is considered successful.

By default, `helm` waits about 5 minutes (300 seconds), and if the installation doesn't complete by that time, the installation is marked as **failure**. If you want to override the default timeout, you can use the `--timeout` flag, followed by the time. Examples of valid time values: `5m`, `10s`, `5m10s` (without quotes!).

---

## 5. Handling a failed installation

By default, upon a failure, created resources remain created (i.e. secrets), and the pod is endlessly and desperately trying to live.

In such case, you have a few options:

### - Option 1: Do nothing

Bad idea. You are leaving a dirty environment, and a pod that's endlessly and desperately trying to live takes up resources, which costs money.

### - Option 2: Go back to a previous successful release

If you want to go back to a previous successful release, and keep your deployment as clean as possible, use the `--atomic` flag. If `--atomic` is set, the upgrade process rolls back changes made in case of failed upgrade. The `--wait` flag will be set automatically if `--atomic` is used.

If an installation has failed, and the `--atomic` flag was set, it will:

- remove secrets
- kill the pod (euthanize)

A full command would look like:

```bash
helm upgrade RELEASE --values values.yaml --atomic --wait --timeout 7m
```

### - Option 3: cleanup on fail

Cleanup on fail cleans up (i.e. deletes) any secrets and objects created due to the failed upgrade. It is different than go back to a previous release in 2 ways:

1. It doesn't create a new helm-history item (stored as a secret)
2. It doesn't kill the pod that's trying to live.

---

## 6. A Forceful Upgrade (_discouraged!_)

What does it mean to use `--force` with upgrade?

When we do a `helm upgrade`, kubernetes receives a **request to modify the existing objects**. It will restart only the pods whose values have changed. It will NOT restart all the pods all the time. **It will only restart the pods if there are any values that have changed** for those pods. But if we have a requirement where you want to forcefully restart all pods, you can use the `--force` option. Internally, `helm` will delete the current deployment. Instead of modifying the deployment, it will delete the deployment, and it will recreate the deployment. As a result, k8s will delete the old pods and create new ones. **So there will be some downtime when you use `--force` option**. This is a major risk of using `--force`flag.
