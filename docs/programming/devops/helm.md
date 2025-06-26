# Guide For Helm

## **1. Helm Daily Workflow**

### - A. list all your charts

You start out by listing all your charts with:

```bash
helm ls
```

### - B. Delete a deployment + service

You can uninstall any of the listed charts using:

```bash
helm uninstall CHART_NAME
```

### - C. Create a new chart-template with deployment+service for an app

```bash
helm create CHART_NAME
```

### - D. Provision a deployment+service for the first time

```bash
helm install CHART_NAME . --values values.yaml --debug --verify -n NAMESPACE --create-namespace
```

Or by using force:

```bash
helm install CHART_NAME . --values values.yaml --debug --verify -n NAMESPACE --create-namespace --force
```

### - E. Keep track of an installation progress

```bash
helm status CHART_NAME -n NAMESPACE
```

### - F. Upgrade (update) a chart's revision

```bash
helm upgrade CHART_NAME . --install --values values.yaml -n NAMESPACE --create-namespace
```

Notice the `--install` flag, which makes `helm install` command redundant, since you now no longer need to decide between `helm install` & `helm upgrade`, just always use `helm upgrade`.

### - G. Abort unsuccessful upgrade of a chart

When an upgrade is unsuccessful, and the `rollingUpdate` seems to fail, you might need to abort the upgrade. Here's how you do it:

If you know the **revision number** of the current successful chart, simply **rollback** to it:

```bash
helm rollback CHART_NAME REVISION_NUMBER -n NAMESPACE
```

If you need to check the current revision number, you can use the **history** command:

```bash
helm history backend -n NAMESPACE
```

### - H. Decrypt a helm Secret

```bash
kubectl get secret sh.helm.release.v1.mysql-db-service.v1 -o jsonpath="{ .data.release }" | base64 -d | base64 -d | gunzip -c | jq '.chart.templates[].data' | tr -d '"' | base64 -d > hello.txt
```

---

## **2. Helm Commands**

### - Command 1: helm ls

**- The command:**

```bash
helm ls -n NAMESPACE
```

Or...

```bash
helm list -n NAMESPACE
```

**- Description:**

This command **lists all the releases** for a specified namespace (uses current namespace context if namespace not specified).

<br/>

### - Command 2: helm create

**- The command:**

```bash
helm create CHART_NAME
```

**- Description:**

create a new **chart** with the given name.

This command creates a chart directory along with the common files and directories used in a chart. `helm create` takes a _path_ for an argument. If directories in the given path do not exist, Helm will attempt to create them as it goes. If the given destination exists and there are files in that directory, conflicting files will be overwritten, but other files will be left alone.

For example, `helm create foo` will create a directory structure that looks something like this:

```
foo/
├── .helmignore   # Contains patterns to ignore when packaging Helm charts.
├── Chart.yaml    # Information about your chart
├── values.yaml   # The default values for your templates
├── charts/       # Charts that this chart depends on
└── templates/    # The template files
    └── tests/    # The test files
```

<br/>

### - Command 3: helm uninstall

**- The command:**

```bash
helm uninstall RELEASE_NAME -n NAMESPACE
```

**- Description:**

Uninstall a release.

This command takes a release name and uninstalls the release. It removes all of the resources associated with the last release of the chart as well as the release history, freeing it up for future use.

#### The `--keep-history` flag

In the past, this was the default. Now, running `uninstall` deletes everything. If you want to uninstall a chart, but keep its history, use this flag.

<br/>

### - Command 4: helm install

**- The command:**

```bash
helm install chart_nickname path/to/root --values path/to/values.yaml -n NAMESPACE --debug
```

**- Description:**

This command installs a **chart** archive, and gives it a **nickname** which you provide.

- The `-f`, `--values` flags specify values in a YAML file or a URL (can specify multiple).
- The `--debug` flag enables verbose output.
- The `--dry-run` flag simulates an install. `--dry-run` is similar to `--dry-run=client`, which means that it will not attempt cluster connections, while setting `--dry-run=server` attempts to connect the cluster.
- The `--force` flag forces resource updates through a replacement strategy.
- The `--verify` flag verifies the package before using it.
- The `--wait` flag will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a **ready state** before marking the release as **successful**. It will wait for as long as `--timeout`.

The install argument must be a **chart reference**, a **path to a packaged chart**, a **path to an unpacked chart directory**, or a **URL**.

**When using a path to an unpacked chart directory:**

1. The `root` directory must include a `Chart.yaml` file.
2. Inside that `Chart.yaml` file, you **MUST** specify:
   - a `name` field
   - an `version` field
3. The `root` directory needs to include a folder named `templates`. This isn't required per-say, since the operation won't fail if one does not exist. However, even though running `helm ls` would show that a chart has been created, nothing would actually be deployed to your cluster! So while technically it is not required, it _is_ sort of required.
4. The `templates` folder is where you include all your yaml files, whether it be a config for a **deployment**, or a **service**, or a **configmap**. The names of the files don't matter, since kubernetes/helm looks inside the file and derives what resource it is based on its `Kind`.
5. The root folder may include a `values.yaml` file, to which you would point when invoking the `install` command, along with the flag of `--values`.

**Another way to set values**

To override values in a chart, use either the '--values' flag and pass in a file or use the '--set' flag and pass configuration from the command line, to force a string value use '--set-string'. You can use '--set-file' to set individual values from a file when the value itself is too long for the command line or is dynamically generated. You can also use '--set-json' to set json values (scalars/objects/arrays) from the command line.

**- Example Usage:**

```bash
helm install user ./user --values ./user/values.yaml -n NAMESPACE --create-namespace
```

<br/>

### - Command 5: helm upgrade

**- The command:**

```bash
helm upgrade RELEASE CHART --values path/to/values.yaml -n NAMESPACE
```

**- Description:**

This command upgrades a release to a new version of a chart.

The upgrade arguments must be a `release` and `chart`.

#### - A. The `CHART` argument:

The chart argument can be either: a path to a chart directory, a packaged chart, a fully qualified URL, or a chart _reference_ ('example/mariadb'). For chart _references_, the **latest** version will be specified unless the '--version' flag is set.

#### - B. The `--values` flag:

To override values in a chart, use either the `--values` flag and pass in a file or use the `--set` flag and pass configuration from the command line, to force string values, use `--set-string`. You can use `--set-file` to set individual values from a file when the value itself is too long for the command line or is dynamically generated. You can also use `--set-json` to set json values (scalars/objects/arrays) from the command line.  
You can specify the `--values`/`-f` flag multiple times. **Priority will be given to the last values.yaml specified** (the one on the most-right). If both `values.yaml` and `values-override.yaml` contained a key called `Test`, the value set in `values-override.yaml` would win.

#### - C. The `--reuse-values` flag:

Re-use values from last release. When upgrading, reuse the last release's values, and merge in any overrides. If `--reset-values` is specified, this flag ignored.  
Imagine this situation: You initially install a chart with...

```bash
helm install my-release my-chart --set image.tag=1.0.0 --set replicas=3
```

Later, you want to only change the image tag:

```bash
helm upgrade my-release my-chart --set image.tag=2.0.0
```

If you don't use `--reuse-values`, then:

- `replicas` will reset to the chart default (e.g., let's say 1),
- Because you're only passing `image.tag`, Helm thinks "oh, I should use only these values."

#### - D. The `--dry-run` flag

The `--dry-run` mode would only go through the first few steps of `helm install`, meaning it will load the charts, merge values from `values.yaml`, render the required k8s templates, but it will not submit them to the k8s API server, and thus, will not get created.

To sum up, the `--dry-run` flag will output all generated `chart manifests`, including `Secrets` which can contain sensitive values. You can hide Kubernetes Secrets using the `--hide-secret` flag. Please carefully consider how and when these flags are used.

**- Usage Example:**

```bash
helm upgrade --install users-service ./toolbox/deploy/charts/users-service --values ./toolbox/deploy/charts/users-service/values.yaml -n application
```

<br/>

### - Command 6: helm status

**- The command: status**

```bash
helm status CHART_NAME -n NAMESPACE
```

**- Description:**

The `helm status` commands is useful when using the `helm install` command. When running `helm install`, Helm does not wait until all of the resources are running before it exits. Many charts require Docker images that are over 600MB in size, and may take a long time to install into the cluster. So, to keep track of a release's state, or to re-read configuration information, you can use `helm status`.

Display the status of the named release.

This command shows the status of a named release. The status consists of:

- last deployment time

- k8s namespace in which the release lives

- state of the release (can be: unknown, deployed, uninstalled, superseded, failed, uninstalling, pending-install, pending-upgrade or pending-rollback)

- revision of the release

- description of the release (can be completion message or error message, need to enable --show-desc)

- list of resources that this release consists of (need to enable --show-resources)

- details on last test suite run, if applicable

- additional notes provided by the chart

<br/>

### - Command 7: helm history

**- The command:**

```bash
helm history RELEASE_NAME -n NAMESPACE
```

**- Description:**

Fetch a release's history.

`history` prints out historical revisions for a given release. A default maximum of 256 revisions will be returned. Setting `--max` configures the maximum length of the revision list returned.

<br/>

### - Command 8: helm rollback

**- The command:**

```bash
helm rollback RELEASE_NAME REVISION_NUMBER -n NAMESPACE
```

**- Description:**

Roll back a release to a previous revision.

The first argument of the rollback command is the name of a release, and the second is a revision (version) number. _If this argument is omitted or set to 0, it will roll back to the **previous** release_.

<br/>

### - Command 9: helm template

**- The command:**

```bash
helm template CHART path/to/chart --values path/to/values.yaml
```

**- Description:**

Render chart templates locally and display the output.

Any values that would normally be looked up or retrieved in-cluster will be faked locally. Additionally, none of the server-side testing of chart validity (e.g. whether an API is supported) is done.

The `template` command outputs clean templates, ready to be used by a kubernetes API server, so if you like doing all the applying job yourself, and just want helm to help you with the creation of the charts, you have an option for that as well.

Note that creating a template does not communicate with the server at all, not even for validating that the resource template yaml is ok. This is as opposed to the `--dry-run` flag on `helm upgrade`, which does. This is what makes `helm template` so useful, that it doesn't need the credentials to talk to a k8x cluster, just to have a template validated.

### - Command 10: helm package

**- The command:**

```bash
helm package path/to/root [flags] --version VERSION_NUMBER --debug
```

**- Description:**

Package a chart directory into a chart archive.

This command packages a chart into a **versioned** chart archive file. If a path is given, this will look at that path for a chart (which must contain a `Chart.yaml` file) and then package that directory.

Versioned chart archives are used by Helm package repositories.

To sign a chart, use the '--sign' flag. In most cases, you should also provide '--keyring path/to/secret/keys' and '--key keyname'.

```bash
helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg
```

If '--keyring' is not specified, Helm usually defaults to the public keyring unless your environment is otherwise configured.

<br/>

### - Command 11: helm get values

**- The command:**

```bash
helm get values RELEASE_NAME
```

**- Description:**

Download the values file for a named release.

Running the command just like that, gives you the values used on this upgrade alone.

#### The `--all` flag

To get all values, use the `--all` flag.

#### The `--revision` flag

To get values from a specific revision (deployment), use the `--revision` flag, followed by the number. You can get the number by running `helm history CHART`.

<br/>

### - Command 12: helm get notes

**- The command:**

```bash
helm get notes RELEASE_NAME
```

**- Description:**

Get the release notes of some named release.

<br/>

### - Command 13: helm get manifest

**- The command:**

```bash
helm get manifest RELEASE_NAME
```

**- Description:**

Download the manifest for a named release.

The manifest is a YAML representation of all the Kubernetes resources that were generated from this release's chart(s).

#### The `--revision` flag

Get the manifest of a specific revision.

<br/>

---

## 3. Helm Architecture

Prerequisites:

1. A Kubernetes cluster
2. Deciding what security configurations to apply to your installation, if any
3. Installing and configuring Helm.
4. You must have Kubernetes installed. For the latest release of Helm, we recommend the latest stable release of Kubernetes, which in most cases is the second-latest minor release.

Helm has 4 big concepts to it:

### - Concept 1: Chart

A **Chart** is a Helm package. It contains all of the resource definitions necessary to run an application, tool, or service inside of a Kubernetes cluster. Think of it like the Kubernetes equivalent of a Homebrew formula, an Apt dpkg, or a Yum RPM file.

### - Concept 2: Repository

A **Repository** is the place where charts can be collected and shared. It's like Perl's CPAN archive or the Fedora Package Database, but for Kubernetes packages.

### - Concept 3: Release

A **Release** is _an instance of a **chart**_ running inside a Kubernetes cluster. One chart can often be installed many times into the same cluster. And each time it is installed, a new **release** is created. Consider a MySQL chart. If you want two databases running in your cluster, you can install that chart twice. Each one will have its own **release**, which will in turn have its own _release name_.

With these concepts in mind, we can now explain Helm like this:

Helm installs **charts** into Kubernetes, creating a new **release** for each installation. And to find new charts, you can search Helm chart **repositories**.

```bash
helm show values
```

### - Concept 4: Tiller

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

## **7. A successful installation (`--wait`)**

`helm` considers an installation successful as soon as the `manifest` is received by the kubernetes API server. It doesn't wait for the pods to be up and running.

If you want that to happen, you can use the `--wait` flag. With it, `helm` will wait for the services and deployments to be created, and for the pods to be up and running. Only then the installation is considered successful.

By default, `helm` waits about 5 minutes (300 seconds), and if the installation doesn't complete by that time, the installation is marked as **failure**. If you want to override the default timeout, you can use the `--timeout` flag, followed by the time. Examples of valid time values: `5m`, `10s`, `5m10s` (without quotes!).

By default, upon a failure, created resources remain created (i.e. secrets), and the pod is endlessly trying to live. If you want to go back to a successful previous release, and keep your deployment as clean as possible, use the `--atomic` flag. If `--atomic` is set, upgrade process rolls back changes made in case of failed upgrade. The `--wait` flag will be set automatically if `--atomic` is used.

A full command would look like:

```bash
helm upgrade RELEASE --values values.yaml --wait --timeout 7m --atomic
```
