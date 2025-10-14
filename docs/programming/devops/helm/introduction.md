# Helm Introduction

## 1. What is Helm?

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

## 2. Why Helm?

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
