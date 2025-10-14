# Helm Architecture

Prerequisites:

1. A Kubernetes cluster
2. Deciding what security configurations to apply to your installation, if any
3. Installing and configuring Helm.
4. You must have Kubernetes installed. For the latest release of Helm, we recommend the latest stable release of Kubernetes, which in most cases is the second-latest minor release.

Helm has 4 big concepts to it:

## - Concept 1: Chart

A **Chart** is a Helm package. It contains all of the resource definitions necessary to run an application, tool, or service inside of a Kubernetes cluster. Think of it like the Kubernetes equivalent of a Homebrew formula, an Apt dpkg, or a Yum RPM file.

## - Concept 2: Repository

A **Repository** is the place where charts can be collected and shared. It's like Perl's CPAN archive or the Fedora Package Database, but for Kubernetes packages.

## - Concept 3: Release

A **Release** is _an instance of a **chart**_ running inside a Kubernetes cluster. One chart can often be installed many times into the same cluster. And each time it is installed, a new **release** is created. Consider a MySQL chart. If you want two databases running in your cluster, you can install that chart twice. Each one will have its own **release**, which will in turn have its own _release name_.

With these concepts in mind, we can now explain Helm like this:

Helm installs **charts** into Kubernetes, creating a new **release** for each installation. And to find new charts, you can search Helm chart **repositories**.

```bash
helm show values
```

## - Concept 4: Tiller

**Tiller** is a component of Helm that runs inside the Kubernetes cluster. Tiller is what provides the functionality to apply the Kubernetes resource descriptions to the Kubernetes cluster. When you install a release, the helm client essentially packages up the values and charts as a release, which is submitted to Tiller.

---

## **4. What is helm?**

**Helm** is a **package manager** for **kubernetes**, that makes it easy to take applications and services that are highly repeatable or get used in a lot of different scenarios and it makes it easier to deploy them to a typical kubernetes cluster. chart = template. Your chart is going to consist of all the files that you're going to be templating here.
Helm talks to a component that needs to be installed on your kubernetes cluster called **Tiller**. Tiller is basically just the server-side component of helm. It's gonna take the commands you've sent with helm client, and turn it into something that your kubernetes cluster will understand. Now, this becomes extra useful when you wanna do things like "upgrade to a new configuration" or "rollback to an older revision".
What Helm will also give you is that it actually keeps a version history for you of different configurations you've sent over the wire with help, so you can rollback to the last known working configuration whenever you want to.
Good things to template:

- the `namespace`
- the `selector` name
- the `image`:
  - its `name`
  - its `tag`
- the `configmap.name`
  Create a NOTES.txt file, which outputs to the user on every upgrade command.
  This file could also be templated.
  You can create 1 values.yaml file for production and one for development.

---

## **5. Why Helm?**

### - Intelligent Deployments

Helm is very intelligent when it comes to deployments. When we directly work with Kubernetes, we have to mention the order in which the resources should be created. For example, **configmaps** and **secrets** should be usually created before **deployment** and **services**. Helm knows to consider the correct order in which Kubernetes resources should be created, and it will automatically do it for us.

### - Lifecycle Hooks

Helm also uses lifecycle hooks.

If there is any work, which is not directly related to Kubernetes, but it has to be done during the installation or the upgrade, **helm allows us to write hooks** that can be hooked into the lifecycle events.

Example lifecycle hooks are installation, upgrade, uninstallation, tests, etc.

This could be writing data to database, backing up a database, or making sure that the Kubernetes cluster is in a required state before we do an installation. Such work can be put into a hook, and it can be hooked into helm's installation or upgrade, or uninstallation lifecycle.

### - Security

Helm has built-in support to ensure that charts which are downloaded from a central repository are secured.

The **charts can be signed** using cryptography, and hashes can be generated, and when we install these charts, we're pulling them from the central repos, **helm will verify** that these charts are really from the source we are expecting and that they were not tweaked by any hacker.

---

## **6. What `helm install` is doing behind the scenes?**

### - Step 1: Chart resolution

- Helm looks for the chart (`<chart>`) either locally or from a remote chart repository (like `https://charts.bitnami.com/bitnami`).
- It loads the chart into memory, including:
  - `Chart.yaml`: metadata
  - `values.yaml`: default configuration values
  - `templates/`: YAML templates with Go templating
  - Any other custom files like `NOTES.txt`
- Helm parses the `Chart.yaml` (chart metadata) and `values.yaml` (default values) using a YAML parser. If you pass a custom values file (`-f my-values.yaml`) or `--set` flags, those are also parsed.

The first thing Helm does when you do a `helm install` is to load the chart and its dependencies. If it is a local chart, it will simply load it from your local machine. If it is a chart living on a repository, it will pull that chart and it will load it.

### - Step 2: Merge Values

- Helm merges configuration values:
  - `values.yaml`
  - Any `--values` (`-f`) file provided
  - Any `--set` CLI overrides
- The result is a **single values map** used to render templates.

### - Step 3: Template Rendering

- Helm renders the Go templates inside `templates/` directory using the merged values.
- This results in standard Kubernetes manifests (YAML) — like `Deployments`, `Services`, `Ingress`, `ConfigMaps`, etc.
- The produces final YAML documents are in ** plain text**. These rendered YAMLs are still just strings at this point.

### - Step 4: Install Release to Kubernetes

- Before sending to Kubernetes, **Helm parses the rendered YAMLs** to:
  - Validate them structurally (to some degree)
  - Convert them to Kubernetes API-compatible JSON objects (Kubernetes API works with JSON under the hood)
  - **Invalid YAMLs here will raise errors** (e.g. bad indentation, missing colons).
  - Helm needs to convert YAML to internal objects to check for things like hooks, CRDs, kinds, etc.
  - Kubernetes itself also validates these later, but Helm catches obvious issues first.

- Helm then **connects** to the Kubernetes cluster (via `~/.kube/config` or `context`).
- It sends the rendered manifests to the Kubernetes API server.
- The Kubernetes API server validates and stores the manifests in etcd.
- Resources are then created by Kubernetes controllers (e.g., `Deployment` creates `Pods`).

### - Step 5: Create Release Record (in Cluster)

- Helm stores a **release object** in the cluster using `secrets/configmaps` in the release namespace. (in older versions, 2 and below, it would store them in the namespace `kube-system`).
- The release record includes:
  - Rendered manifests
  - Chart metadata
  - Values used
  - Version info

### - Step 6: Run Hooks (if any exists)

- Helm checks for lifecycle hooks defined in templates (like pre-install, post-install).
- These jobs/pods are created and monitored.

### - Step 7: Show Output

If successful, Helm outputs the status. Release name, namespace, resources created, and any messages from `NOTES.txt` (templated and displayed).

---

## **7. A successful installation/upgrade**

`helm` considers an installation successful as soon as the `manifest` is received by the kubernetes API server. It doesn't wait for the pods to be up and running.

If you want that to happen, you can use the `--wait` flag. With it, `helm` will wait for the services and deployments to be created, and for the pods to be up and running. Only then the installation is considered successful.

By default, `helm` waits about 5 minutes (300 seconds), and if the installation doesn't complete by that time, the installation is marked as **failure**. If you want to override the default timeout, you can use the `--timeout` flag, followed by the time. Examples of valid time values: `5m`, `10s`, `5m10s` (without quotes!).

---

## **8. Installation failure**

By default, upon a failure, created resources remain created (i.e. secrets), and the pod is endlessly and desperately trying to live.

In such case, you have a few options:

### - Option 1: Do nothing

Bad idea. You are leaving a dirty environment, and a pod that's endlessly and desperately trying to live takes up resources, which costs money.

### - Option 2: Go back to a previous successful release

If you want to go back to a previous successful release, and keep your deployment as clean as possible, use the `--atomic` flag. If `--atomic` is set, the upgrade process rolls back changes made in case of failed upgrade. The `--wait` flag will be set automatically if `--atomic` is used.

What this will do:

- remove secrets
- kill the pod (euthanize)

A full command would look like:

```bash
helm upgrade RELEASE --values values.yaml --wait --timeout 7m --atomic
```

### - Option 3: cleanup on fail

Cleanup on fail cleans up (i.e.) deletes any secrets and objects created due to the failed upgrade. It is different than go back to a previous release in 2 ways:

1. It doesn't create a new helm-history item (stored as a secret)
2. It doesn't kill the pod trying to live.

---

## **9. Forceful upgrade**

What does it mean to use `--force` with upgrade?

we do a helm upgrade, kubernetes receives a request to modify the existing objects. It will restart only the pods whose values have changed. It will NOT restart all the pods all the time. It will only restart the pods if there are any values that have changed for those pods. But if we have a requirement where you want to forcefully restart all pods, you can use the `--force` option. Internally, `helm` will delete the current deployment. Instead of modifying the deployment, it will delete the deployment, and it will recreate the deployment. As a result, Kube will delete the old pods and create new ones. **So there will be some downtime when you use `--force` option**. This is a major risk of using `--force`flag.

---

## **10. Creating a Chart**

When you run `helm create CHART_NAME`, a folder will be created with the following structure:

- Chart.yaml
- values.yaml
- templates/
- charts/

### - A. Chart.yaml

#### • Description

The **Chart.yaml** for helm is much like what the **package.json** is for npm.

The **Chart.yaml** is a required metadata file for every Helm chart. It serves as the manifest that defines the chart itself.

#### • Purpose of Chart.yaml

It contains key metadata about your chart so that Helm and other tools know:

- What the chart is
- What version it is
- What it depends on
- What Kubernetes resources it describes

#### • Common fields in Chart.yaml

```yml
apiVersion: v2
name: my-app
description: A Helm chart for Kubernetes
type: application
version: 0.1.0
appVersion: "1.16.0"
```

| Field       | Purpose                                                                            |
| ----------- | ---------------------------------------------------------------------------------- |
| apiVersion  | (required) Chart API version (v2 for Helm 3).                                      |
| name        | (required) Name of the chart.                                                      |
| version     | (required) Version of the chart itself. Helm uses this for upgrades and rollbacks. |
| description | Short human-readable summary.                                                      |
| type        | `application` (default) or `library`.                                              |
| appVersion  | Version of the actual app being deployed (informational). i.e, MongoDB 8.0         |

#### • Why it matters

- Helm installs and upgrades charts based on `version`.
- `dependencies` can be listed here, allowing Helm to pull in subcharts automatically.
- Tools like `helm repo` and `helm package` read this file to index and distribute your chart.

#### • More optional keys

- You can specify an `icon`.
- You can specify `keywords`.
- You can specify `home`, which is the home url of your project.
- `maintainers`: list of people maintaining this chart.

<br/>

### -B. helpers

```
_helpers.tpl
```

It starts with an underscore (`_`) so that it would always come on top.
The `tpl` stands for template.

The `_helpers.tpl` contains methods that can be used in a `.yaml` file. If you open it you can see a bunch of functions defined.

```yml
{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "hello.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}
```

```yml
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "hello.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
```

---

## **11. Templating Syntax & tricks**

### - A. if statement

```yaml
{{- if .Values.ingress.enabled}}
```

<br/>

### - B. `include`

`include` is a way to invoke a helper function, defined in one of your `.tpl` files.  
You can pass all parameters to it like so: `.`

```yaml
{{ include SOME.FUNC.NAME}}
```

---

## **12. helm package**

To package a chart, go to the command line, and type:

```bash
helm package path/to/chart-root
```

The output of this command is a file named: `CHART_NAME-0.1.0.tgz`.
