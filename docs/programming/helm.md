---
sidebar_label: '12. Helm'
sidebar_position: 11
---

# Guide For Helm

## **1. Helm Commands**

**- The command:**

```bash
helm status <chart_name>
```

**- Description:**

When you use the `helm install` command, Helm does not wait until all of the resources are running before it exits. Many charts require Docker images that are over 600MB in size, and may take a long time to install into the cluster. So, to keep track of a release's state, or to re-read configuration information, you can use `helm status`.

## **1. Helm Commands**

### - Command 1: helm ls

**- The command:**

```bash
helm ls <my-app>
```

**- Description:**
**- Example Usage:**

```bash
helm ls <my-app>
```

```bash
helm ls -n <namespace> <my-app>
```

<br/>
### - Command 1: helm install
**- The command:**
```bash
helm install <my-app>
```
**- Description:**
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
