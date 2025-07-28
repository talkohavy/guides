# K8S RBAC

## 1. RBAC Model

### - The Goal

### - Identity, Roles & Bindings

---

## 2. K8S Implementation of RBAC

Kubernetes also uses an RBAC model, to protect resources inside the cluster.

It utilizes the same 3 concepts (identities, roles & binding) but calls them by slightly different names.

### ServiceAccount = Identity

A `ServiceAccount` is the identity of "who is accessing the resource?".

### Role = Role

A `Role` includes permissions to access the resources.

### RoleBinding = Role binding

Links between the identity, which is the `ServiceAccount`, to the permission defined in a `Role`.

After submitting these definitions to the cluster, the application using that `ServiceAccount` will be either allowed or denied to issue requests to the following endpoints:

- `/api/v1/namespaces/{namespace}/services`
- `/api/v1/namespaces/{namespace}/pods`

---

### 3. Example

Here, we'll do everything from scratch.

1. Identifying and assigning **Identities**
2. Granting **permissions**
3. **Linking** Identities to permissions

Let's say someone on your **team**, want to login to the kubernetes Dashboard.

In this case, you should have and entity for an account of a user, where each user has a unique ID, such as an email address.

Now, how should you store the user in the cluster? Kubernetes doesn't have objects that represents user account. Users cannot be added through an API call. Instead, any actor representing a **valid certificate signed by the cluster's certificate authority** is considered authenticated. In this case, kubernetes assigns the the username from the Common Name field in the `subject` of the certificate, like this:

```yaml
apiVersion: v1
- cluster:
    certificate-authority: /Users/talkohavy/.minikube/ca.crt
    extensions:
    - extension:
        last-update: Sun, 22 Jun 2025 19:56:27 IDT
        provider: minikube.sigs.k8s.io
        version: v1.32.0
      name: cluster_info
    server: https://127.0.0.1:64693
  name: minikube
contexts:
- context:
    cluster: minikube
    extensions:
    - extension:
        last-update: Sun, 22 Jun 2025 19:56:27 IDT
        provider: minikube.sigs.k8s.io
        version: v1.32.0
      name: context_info
    namespace: default
    user: minikube
  name: minikube
current-context: minikube
kind: Config
preferences: {}
users:
- name: minikube
  user:
    // highlight-start
    client-certificate: /Users/talkohavy/.minikube/profiles/minikube/client.crt
    // highlight-end
    client-key: /Users/talkohavy/.minikube/profiles/minikube/client.key
```

We can extract the `CN` like so

```bash
openssl x509 -in /Users/talkohavy/.minikube/profiles/minikube/client.crt -noout -subject
```

Which outputs:

```
subject=O=system:masters, CN=minikube-user
```

A temporary `User` object is then created and passed to the **Authorization RBAC module**.  
Here is the code snippet from Kubernetes, which is a GoLang struct, that maps all the details collected from the **Authentication module**:

```go
type User struct {
  name string     // unique for each user
  // ...          // other details
}
```

Just keep in mind, the `User` is used for humans, or any external applications to the cluster.

If you need to created an `Identity`that will be used _inside_ kubernetes, you should use a `ServiceAccount`. It is very similar to the regular `User`, except that it is managed by kubernetes itself.

A `ServiceAccount` is usually assigned to `Pods` to grant permissions.

For example, you may have Prometheus deployed inside your cluster, that needs to discover its targets. Or, perhaps an nginx `IngressController`, that must have permissions to list all the backend endpoints for a service. For those apps, you can define a `ServiceAccount`.

At this point, you have a mechanism to identify who has access, and to what resources. Whether it be a human, an application, or a group of one of them. But what resources they are accessing in the cluster?

### 4. Modeling Access to Resources

We want to create a `Role` yaml.

A `Role` yaml has 2 main keys, `metadata` & `rules`, which the latter is the most important one.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: viewer
  namespace: application
rules:
  - apiGroups:
      - ''
    resources:
      - services
      - pods
    verbs:
      - get
      - list
  - apiGroups:
      - 'apiextensions.k8s.io'
    resources:
      - customerResourceDefinition
    verbs:
      - list
```

In kubernetes, a collection of `apiGroups`, `resources`, and `verbs` is called a **rule**.

A `Role` can contain a list of **rules**.

Now, all that's left is linking together **Roles** with **Identities**.

---

### 5. Granting Permissions to Users

To link between a **Role** and an **Identity** we use a `RoleBinding` resource.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: myapp-viewer
  namespace: application
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: viewer
subjects:
  - kind: ServiceAccount
    name: myapp
    namespace: application
```

The above definition has 2 important fields: `roleRef` & `subjects`.

`roleRef` references the _viewer_ `Role`. `subjects` links to the _myapp_ `ServiceAccount`.

Notice that both of them make the link on the `name` key.

Before submitting this `RoleBinding`, _any_ service going through the **myapp** `ServiceAccount`

As soon as you submit this `RoleBinding` to the cluster, the application or user using the service account will have access to the resources listed in the `Role`.
