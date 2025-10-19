# Helm Architecture

Helm has 4 big concepts to it:

## 1. Helm's 3 Big Concepts

### - Concept 1: Chart

A **Chart** is a Helm package. It contains all of the resource definitions necessary to run an application, tool, or service inside of a Kubernetes cluster. Think of it like the Kubernetes equivalent of a Homebrew formula, an Apt dpkg, or a Yum RPM file.

### - Concept 2: Repository

A **Repository** is the place where charts can be collected and shared. It's like the Fedora Package Database, but for Kubernetes packages.

### - Concept 3: Release

A **Release** is _an instance of a **chart**_ running inside a Kubernetes cluster. One chart can often be installed many times into the same cluster. And each time it is installed, a new **release** is created. Consider a `MySQL` chart. If you want two databases running in your cluster, you can install that chart twice. Each one will have its own **release**, which will in turn have its own _release name_.

With these concepts in mind, we can now explain Helm like this:

Helm installs **charts** into Kubernetes, creating a new **release** for each installation. And to find new charts, you can search Helm chart **repositories**.

```bash
helm show values
```

Now that you know all the basic concepts, try reading again the ["What is Helm?"](/docs/programming/devops/helm/introduction/#1-what-is-helm) section again.
