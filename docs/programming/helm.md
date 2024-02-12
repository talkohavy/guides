---
sidebar_label: '12. Helm'
sidebar_position: 11
---

# Guide For Helm

## **2. Helm Daily Workflow**

You start out by listing all your charts with:

```bash
helm ls
```

You can uninstall any of the listed charts using:

```bash
helm uninstall chart_name
```

```bash
helm status <chart_name>
```

```bash
helm create <my-app>
```

```bash
helm install <my-app>
```

```bash
helm upgrade <my-app> path/to/webapp/ --values path/to/values.yaml
```

---

## **1. Helm Commands**

**- The command: status**

```bash
helm status <chart_name>
```

**- Description:**

The `helm status` commands is useful when using the `helm install` command. When running `helm install`, Helm does not wait until all of the resources are running before it exits. Many charts require Docker images that are over 600MB in size, and may take a long time to install into the cluster. So, to keep track of a release's state, or to re-read configuration information, you can use `helm status`.

### - Command 1: helm ls

**- The command:**

```bash
helm ls <my-app>
```

Or...

```bash
helm list <my-app>
```

**- Description:**

This command lists all of the releases for a specified namespace (uses current namespace context if namespace not specified).

**- Example Usage:**

```bash
helm ls <my-app>
```

```bash
helm ls -n <namespace> <my-app>
```

<br/>

### - Command 1: helm uninstall

**- The command:**

```bash
helm uninstall <release_name>
```

**- Description:**

Uninstall a release.

This command takes a release name and uninstalls the release. It removes all of the resources associated with the last release of the chart as well as the release history, freeing it up for future use.

<br/>

### - Command 1: helm install

**- The command:**

```bash
helm install chart_nickname path/to/root --values path/to/values.yaml
```

**- Description:**

This command installs a **chart** archive, and gives it a **nickname** which you provide.

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
helm install configuration-server-release .
```

<br/>

### - Command 2: helm history

**- The command:**

```bash
helm history <my-app>
```

**- Description:**

**- Example Usage:**

```bash
helm history -n <namespace> <my-app>
```

<br/>

### - Command 2: helm status

**- The command:**

```bash
helm status <my-app> [flags]
```

**- Description:**

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

### - Command 3: helm rollback

**- The command:**

```bash
helm rollback <my-app>
```

**- Description:**

**- Example Usage:**

```bash
helm rollback -n <namespace> <my-app> <revision-number>
```

<br/>

### - Command 2: helm upgrade

**- The command:**

```bash
helm upgrade <my-app> path/to/webapp/ --values path/to/values.yaml
```

**- Description:**

<br/>

### - Command 3: helm rollback

**- The command:**

```bash
helm rollback <my-app>
```

**- Description:**

<br/>

### - Command 4: helm package

**- The command:**

```bash
helm package <my-app>
```

**- Description:**
<br/>

### - Command 5: helm create

**- The command:**

```bash
helm create <my-app>
```

**- Description:**
<br/>

---

## **2. Introduction**

Helm is a package manager for kubernetes, that make it easy to take applications and services that are highly repeatable or get used in a lot of different scenarios and it makes it easier to deploy them to a typical kubernetes cluster.
chart = template
Your chart is going to consist of all the files that you're going to be template'ing here.
Helm talks to a component that needs to be installed on your kubernetes cluster called **Tiller**. Tiller is basically just the server-side component of helm. It's gonna take the commands you've sent with helm client, and turn it into something that your kubernetes cluster will understand. Now, this becomes extra useful when you wanna doo things like "upgrade to a new configuration" or "rollback to an older version".
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

## 2. Getting Started

Prerequisites:

1. A Kubernetes cluster
2. Deciding what security configurations to apply to your installation, if any
3. Installing and configuring Helm.
4. You must have Kubernetes installed. For the latest release of Helm, we recommend the latest stable release of Kubernetes, which in most cases is the second-latest minor release.

Helm has 3 big concepts to it.

### - Concept 1: Chart

A **Chart** is a Helm package. It contains all of the resource definitions necessary to run an application, tool, or service inside of a Kubernetes cluster. Think of it like the Kubernetes equivalent of a Homebrew formula, an Apt dpkg, or a Yum RPM file.

### - Concept 2: Repository

A **Repository** is the place where charts can be collected and shared. It's like Perl's CPAN archive or the Fedora Package Database, but for Kubernetes packages.

### - Concept 3: Release

A **Release** is _an instance of a **chart**_ running inside a Kubernetes cluster. One chart can often be installed many times into the same cluster. And each time it is installed, a new **release** is created. Consider a MySQL chart. If you want two databases running in your cluster, you can install that chart twice. Each one will have its own **release**, which will in turn have its own _release name_.

With these concepts in mind, we can now explain Helm like this:

Helm installs **charts** into Kubernetes, creating a new **release** for each installation. And to find new charts, you can search Helm chart **repositories**.

helm show values
