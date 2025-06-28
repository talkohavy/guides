# K8S API Server

## 📌 What Is the Kubernetes API Server?

The **Kubernetes API Server** (`kube-apiserver`) is the central **control plane component** in every Kubernetes cluster.  
It acts as the **gateway** through which all components, users, and tools interact with the cluster.

> Think of it as the front door to your Kubernetes brain.

---

## 🎯 Core Responsibilities

| Role                               | Description                                                               |
| ---------------------------------- | ------------------------------------------------------------------------- |
| **API Frontend**                   | Exposes the Kubernetes API (RESTful, HTTP/JSON)                           |
| **Authentication & Authorization** | Validates user identity and access rights (RBAC, ABAC, etc.)              |
| **Admission Control**              | Enforces policies (e.g., resource limits, quotas, security settings)      |
| **Data Validation**                | Checks schema correctness of submitted YAML/JSON                          |
| **Etcd Interaction**               | Persists the cluster's state in etcd (a distributed key-value store)      |
| **Cluster State Management**       | Orchestrates updates and maintains consistency across the cluster         |
| **Serving Clients**                | Responds to `kubectl`, Controllers, Operators, and other external clients |

---

## 🔍 What Happens When You Run kubectl apply?

Let's break down the process behind:

```bash
kubectl apply -f deployment.yaml
```

### 📦 1. kubectl parses the YAML

- Validates that the file is properly formatted.
- Reads resource kind (`Deployment`, `Service`, etc.), metadata, and spec.

### 🔐 2. Authentication

- `kubectl` contacts the API server over HTTPS.
- Uses your `kubeconfig` (typically located at `~/.kube/config`) to:
  - Identify the **cluster endpoint**
  - Provide **credentials** (tokens, client certs, etc.)

### ✅ 3. Authorization

- API Server checks **what you're allowed to do** (via RBAC or other mechanisms).
- For example, are you allowed to `create` a Deployment in the `default` namespace?

### 🧰 4. Admission Controllers Run

If you pass authorization, **Admission Controllers** kick in:

- Examples:
  - `LimitRanger`: Ensures resource requests/limits.
  - `PodSecurityPolicy`: Blocks insecure specs.
  - `NamespaceLifecycle`: Prevents changes in terminating namespaces.

### 📖 5. Validation & Defaulting

- Checks your resource **against its OpenAPI schema**.
- Adds **default fields** you didn't specify (e.g., `restartPolicy: Always` for Pods).

### 🧠 6. Storage in etcd

- The API Server persists the resource **state** in **etcd**, the cluster's source of truth.
- etcd is a distributed key-value store optimized for fast reads/writes and versioning.

### 🔁 7. Controllers Start Acting

- **Deployment controller** sees a new Deployment object in etcd.
- It creates a **ReplicaSet**, which in turn creates the desired number of **Pods**.
- Each controller watches for state changes and reacts to meet the "desired state".

`kubectl apply` stores a `last-applied-configuration` annotation in the object metadata to track future diffs.

---

## 🔒 Authentication & Authorization Layers

### 🔐 Authentication Methods

#### 🔐 Authentication Methods

- X.509 Certificates
- Bearer Tokens
- OpenID Connect (OIDC)
- Service Accounts

#### 🔐 Authorization Modes

- RBAC (Role-Based Access Control) ✅ most common
- ABAC
- Webhook
- Node (for kubelets)

---

## 📚 The Kubernetes Resource Model

The API Server supports **hundreds of resource types**, grouped by **API groups** and versions.

| Kind                     | API Group              | Version |
| ------------------------ | ---------------------- | ------- |
| Pod                      | `""` (core group)      | v1      |
| Deployment               | `apps`                 | v1      |
| Ingress                  | `networking.k8s.io`    | v1      |
| CustomResourceDefinition | `apiextensions.k8s.io` | v1      |

You can list all resources and their endpoints with:

```bash
kubectl api-resources
```

---

## 📈 Monitoring the API Server

Check logs:

```bash
kubectl logs -n kube-system kube-apiserver-<node-name>
```

Get the node's name using:

```bash
k get node
```

Use Prometheus metrics (if enabled):

```
https://<api-server-host>:port/metrics
```

---

## 🔐 Security Best Practices

- Use **RBAC** to tightly control who can do what.
- Enable **audit logs** for sensitive actions.
- Use **API server flags** to restrict access (e.g., `--anonymous-auth=false`).
- Protect etcd (encrypt secrets at rest via `EncryptionConfiguration`).

---

## 🧵 Final Summary

| Role                                | Description                                       |
| ----------------------------------- | ------------------------------------------------- |
| Entry point for all cluster actions | Exposes the REST API for all Kubernetes resources |
| Central orchestration brain         | Talks to etcd, triggers controllers               |
| Enforces access & policy            | Authn, Authz, and Admission Controllers           |
| Supports declarative workflows      | Powers `kubectl apply`, CI/CD pipelines           |
| Critical for cluster availability   | If it’s down, no changes can be made              |

**The API Server is the heart of Kubernetes**, and understanding how it works is crucial to operating, securing, and automating any cluster.
