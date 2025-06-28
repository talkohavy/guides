# Kubernetes Resources

Let's start with some terminology and talk about the architecture of kubernetes:

## Resource 1: A Pod

A **Pod** is the smallest unit that exists within the _kubernetes_ world.  
Note that **container** is the smallest unit that exists within the _docker_ world. In kubernetes however, it is the **pod**.  
Containers are created INSIDE a pod!  
Inside the pod, there could be one or more containers, although the most common scenario is to have **a single container running inside a pod**. One pod, one container.

---

## Resource 2: Deployment

### - A. What is a Deployment?

A Deployment is a higher-level Kubernetes resource that manages the **lifecycle of Pods** via **ReplicaSets**. It allows you to declaratively define the desired state of your application (e.g., how many replicas, what image, which config) and lets Kubernetes automatically handle creating, updating, and healing Pods to match that state.

### - B. Why Do We Need It?

- **Declarative Management**: Define what your app should look like, and Kubernetes makes it happen.
- **Rolling Updates**: Deploy new versions with zero downtime by gradually replacing old Pods.
- **Rollbacks**: Easily revert to previous versions if something goes wrong.
- **Scalability**: Seamlessly scale your app up or down by adjusting the replicas count.

### - C. What a Deployment Does Internally

A Deployment uses a **Pod template** to define what Pods should look like — including container images, ports, environment variables, and more.
It **automatically creates a ReplicaSet**, which in turn ensures that the specified number of identical Pods are running.

If the Pod template changes (e.g., new image version), the Deployment creates a **new ReplicaSet**, and gradually shifts traffic from the old Pods to the new ones — this is the **rolling update strategy**, which is the default.

### - D. Anatomy of a Deployment

Minimal YAML Example:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: myapp:1.0.0
          ports:
            - containerPort: 8080
```

- `replicas`: Number of desired Pods.
- `selector`.matchLabels: Matches Pods to the Deployment (must match labels in the template).
- `template`: The Pod "recipe" — what gets created.
- `strategy`: By default, uses **RollingUpdate**.

To apply this Deployment:

```bash
kubectl apply -f deployment.yaml
```

### - E. Rolling Updates & Rollbacks

Update image:

```bash
kubectl set image deployment/myapp myapp=myapp:2.0.0
```

Watch rollout progress:

```bash
kubectl rollout status deployment/myapp
```

Roll back to previous version:

```bash
kubectl rollout undo deployment/myapp
```

Kubernetes ensures that updates are **safe and gradual** — new Pods start running before old ones are terminated.

### - F. Behind the Scenes: ReplicaSets

Deployments **create and manage ReplicaSets**, which are responsible for keeping a set number of Pods running.

- A **ReplicaSet** watches for Pods that match its selector and creates or deletes Pods as needed to maintain the `replicas` count.
- Each Deployment manages **its own ReplicaSet** — when the template changes, a new ReplicaSet is created and gradually scaled up while the old one is scaled down.
- Pods link back to their managing ReplicaSet using `metadata.ownerReferences`.

This architecture makes **rolling updates and rollbacks** possible — switching between different ReplicaSets with different Pod templates.

### - G. How to Scale

Modify the **replicas** field and reapply:

```yaml
spec:
  replicas: 5
```

Or use the CLI:

```bash
kubectl scale deployment myapp --replicas=5
```

Kubernetes ensures that the actual number of Pods running matches the desired count.

### - H. Monitoring Deployment State

Run:

```bash
kubectl describe deployment myapp
```

You'll see fields like:

- **Replicas**: Current status — desired, updated, available, unavailable.
- **StrategyType**: Usually RollingUpdate.

Example:

```
Replicas: 3 desired | 3 updated | 3 total | 3 available | 0 unavailable
```

### - I. Deployment Strategies

The `Deployment` resource supports two update strategies via the strategy.type field:

#### -- 1. RollingUpdate (default)

- **What it does**: Gradually replaces old Pods with new ones.
- **Benefit**: Ensures zero downtime if configured properly.
- **How it works**:

  - Creates new Pods using the updated template.
  - Slowly terminates old Pods while ensuring availability.
  - Controlled by:
    ```yaml
    strategy:
      type: RollingUpdate # default
        rollingUpdate:
          maxUnavailable: 25% # default
          maxSurge: 25% # default
    ```
    - `maxSurge`: How many extra Pods can be created temporarily during the update (**round up**). For example, if you set `maxSurge: 25%`, it means that up to 25% more Pods than the desired number can be created temporarily during the update. With 4 replicas, up to 1 extra pod can be created during rollout.
    - `maxUnavailable`: How many Pods can be unavailable during the update (**round down**). For example, if you set `maxUnavailable: 25%`, it means that up to 25% of the desired Pods can be unavailable during the update. For example, if you have 4 replicas, 1 pod can be unavailable during the update.

✅ Example 1: replicas: 4

- maxSurge: 25% → 1 extra pod
- maxUnavailable: 25% → 1 pod can be offline

Initial state:

- 4 running Pods (v1)

Step-by-step update:

1. Kubernetes creates 1 new Pod (v2) — allowed by maxSurge.
   - Now: 4 old Pods (v1) + 1 new Pod (v2) = 5 Pods total.
2. Once the new Pod (v2) is ready, Kubernetes terminates 1 old Pod (v1) — allowed by maxUnavailable.
   - Now: 3 old (v1) + 1 new (v2)
3. Repeat:
   - Create 1 new Pod (v2) → total 5 Pods.
   - Terminate 1 old Pod (v1)
4. After 4 cycles, you end up with 4 Pods, all running the new version.

**Summary:**

- Update proceeds 1 pod at a time.
- Total pods never exceed 5 (replicas + maxSurge).
- No more than 1 pod is down (maxUnavailable) at a time.

✅ Example 2: replicas: 2

- maxSurge: 25% → 0.5 → rounds up → 1 extra pod
- maxUnavailable: 25% → 0.5 → rounds down → 0 pods can be unavailable

Initial state:

- 2 running Pods (v1)

**Step-by-step update:**

1. Kubernetes creates **1 new Pod (v2)** — allowed by maxSurge.
   - Now: 2 old Pods (v1) + 1 new Pod (v2) = 3 Pods total.
2. It **waits** for the new Pod to become **Ready**.
3. Once it's Ready, Kubernetes can now terminate an old Pod — but must ensure **0 downtime**, so **it keeps 2 Pods running at all times**.
4. It deletes 1 old Pod and repeats.

**Summary:**

- Even stricter update: **no downtime allowed at all**.
- Only 1 Pod is updated at a time.
- Total Pods temporarily reach 3 (due to maxSurge).

**🔍 Key Takeaways**

| Replicas | maxSurge (25%) | maxUnavailable (25%) | Max Total Pods | Min Available During Update |
| -------- | -------------- | -------------------- | -------------- | --------------------------- |
| 4        | 1              | 1                    | 5              | 3                           |
| 2        | 1              | 0                    | 3              | 2                           |

#### -- 2. Recreate

- **What it does**: Terminates **all existing Pods** before creating new ones.
- **Benefit**: Guarantees that new and old versions **never run simultaneously**.
- **Drawback**: Causes downtime during the transition.
- **Use case**: Useful when your app **can't handle two versions running at once** (e.g., breaking DB schema changes, shared volume locks).

### - J. Best Practices

- **Use labels consistently** for `selector.matchLabels` and `template.metadata.labels` — they must match.
- **Avoid using `latest` tags** for images to prevent unpredictable rollouts.
- **Pair with ConfigMaps and Secrets** for environment configuration.
- **Use resource limits** (CPU/memory) to avoid noisy neighbors and enable autoscaling.
- **Monitor rollout status** after each update to catch issues early.

---

## Resource 3: Service

### -- A. What is a Service?

A **Service** is an abstract way for **exposing** an application running on a set of **Pods** as a _network service_.

A **service** has 2 main purposes:

1. Define a logical set of **pods** and a **policy** by which to access them.
2. Load balance the work-load between the set of pods it is in-charge of.

The set of pods targeted by a **service** is usually determined by a `selector`.

A **service** in kubernetes is a REST object, similar to a **pod**. Being a REST object, it means that a **Service** can be created, updated or deleted. It could also be read in the sense of getting information about it (with the _describe_ command). To be more specific, saying that a **service** is a REST object means that you can send a POST request with a **service** definition to the API server to create a new instance.

### -- B. Why do we need a **Service**?

If you use a **deployment** to run your app (which you probably are), it can create and destroy **pods** dynamically. Kubernetes **pods** are created and destroyed all the time in order to match the _desired state_ you mentioned in your deployment's yaml. What this means is that **pods** are nonpermanent resources. Each **pod** gets its own IP address, however in a **deployment**, a set of **pods** running in one moment in time could be different from the set of **pods** running in that **deployment** a moment later. **This leads to a problem**. Consider a stateless image-processing server which is running with 3 replicas. Those replicas are identical — The "frontend" pods do not care _which_ image-processing server would reply/serve their request. While the actual "backend" **pods** may change, the "frontend" pods do not need to be aware of that, nor do they need to keep track of the actual set of the "backend" pods themselves.

The Service abstraction enables this decoupling.

### - C. How to create a Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: NodePort
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      # By default and for convenience, the `targetPort` is set to
      # the same value as the `port` field.
      targetPort: 80
      # Optional field
      # By default and for convenience, the Kubernetes control plane
      # will allocate a port from a range (default: 30000-32767)
      nodePort: 30007
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 192.0.2.127
```

Or using kubectl:

```bash
kubectl create ...
```

There are a few things to notice in this yaml config:

- Both `spec.ports.port` & `spec.ports.targetPort` need to be filled manually. The `targetPort` is the port number on the container which you'd like to expose out to the `pod`, and `port` is the port number on the `pod` which you would like to expose out to the `service`.

**Question**: We only specified a `port` which is the pod's port (`--port`), and a `target-port` which is the container's port (`--target-port`). But what about the node's port??
**Answer**: kubernetes would auto-generated some random port! Typically a high number. For example, if you provide --port=3000 and --target-port=80, kubernetes would add: node:32142 `-->` pod:3000 `-->` container:80

### - D. Service Types

#### Type 1: ClusterIP (the default)

**ClusterIP** is the default `Service` type which assigns an IP address from a pool of IP addresses that your cluster has reserved for that purpose.

**ClusterIP** is a type you can use to **expose a deployment internally** inside the cluster.

A **service** of type **ClusterIP** would allow you to connect to its pods **only from within** the kubernetes cluster. This is great when your kubernetes cluster has a database deployment for example, like mongodb or mysql, which of course should not be available & accessible from the outside world.

When choosing the type **Cluster IP**, a **service** would be created with a new virtual IP address assigned to it. Upon its creation you'd be asked to _name_ a **deployment** to which this **service** would be linked to. kubernetes would then do all sorts of magic behind the scenes, which essentially gives this **service** a matching label as that of the **deployment**.  
With the new virtual IP address given to the new **service** you'd be able to connect to that specific **deployment** and get responses from its **pods**. Also, with this **service**, kubernetes will distribute the load across the different **pods** related to that **deployment**.

#### Type 2: NodePort

**NodePort** is a type you can use to **expose a deployment externally** outside the cluster.

When we want to grant access to a deployment to the outside world, we pick a service of type **NodePort**. Typically, this is something we want for our **frontend server** deployment, and perhaps also our **api-gateway** deployment.

If you set the service's type to **NodePort**, the Kubernetes control plane allocates a port from a range specified by `--service-node-port-range` flag (default: 30000-32767). Each node proxies that port (the same port number on every Node) into your Service. Your Service reports the allocated port in its .spec.ports[*].nodePort field.

Using a NodePort gives you the freedom to set up your own load balancing solution, to configure environments that are not fully supported by Kubernetes, or even to expose one or more nodes' IP addresses directly.

For a node port Service, Kubernetes additionally allocates a port to match the protocol of the Service. Every **node** in the cluster configures itself to listen on that assigned port and to forward traffic to one of the ready endpoints (**pods**) associated with that **Service**. You'll be able to contact the `type: NodePort` **Service**, from outside the cluster, by connecting to any node using the appropriate protocol (for example: TCP), and the appropriate port (as assigned to that Service).

**Choosing your own port**

If you want a specific port number, you can specify a value in the `nodePort` field. The control plane will either allocate you that port or report that the API transaction failed. This means that you need to take care of possible port collisions yourself. You also have to use a valid port number, one that's inside the range configured for `NodePort` use.

#### Type 3: LoadBalancer

On cloud providers which support external load balancers, setting the `type` field to `LoadBalancer` provisions a load balancer for your Service. The actual creation of the load balancer happens asynchronously, and information about the provisioned balancer is published in the Service's .`status.loadBalancer` field. For example:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app.kubernetes.io/name: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  clusterIP: 10.0.171.239
  type: LoadBalancer
status:
  loadBalancer:
    ingress:
    - ip: 192.0.2.127
```

Traffic from the external load balancer is directed at the backend Pods. The cloud provider decides how it is load balanced.

To implement a Service of `type: LoadBalancer`, Kubernetes typically starts off by making the changes that are equivalent to you requesting a Service of `type: NodePort`. The cloud-controller-manager component then configures the external load balancer to forward traffic to that assigned node port.

**Visual example:**

I've created a service of type `LoadBalancer`, fetched its details, and I want to show you something interesting.

I've created a service manually with:  
_(this hardly makes any different whether it's declarative or imperative)_

```bash
kubectl expose deployment DEPLOYMENT_NAME --type=LoadBalancer --port=<port>
```

And now let's do `get services` immediately afterwards:

```bash
kubectl get services
```

You'd see something like this:

```bash
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S)
my-service LoadBalancer 10.109.195.184 <PENDING> 3000:32268/TCP
```

The important thing I want you to notice is the part that says:  
`External=ip is pending`  
You will see `<PENDING>` if you're using **minikube**, but when deploying the application by using one of the big known cloud providers, like amazon & google cloud, you will see a load balancer ip address assigned automatically.
When using with minikube though, this will forever stay in this `<PENDING>` state, and would result in a behavior that is exactly the same as **NodePort** type, meaning we will still be able to connect to our deployment using the IP address of the node.

#### Type 4: ExternalName

Services of type `ExternalName` map a Service to a DNS name, not to a typical selector such as `my-service` or `cassandra`. You specify these Services with the `spec.externalName` parameter.

This Service definition, for example, maps the `my-service` Service in the `prod` namespace to `my.database.example.com`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: prod
spec:
  type: ExternalName
  externalName: my.database.example.com
```

When looking up the host `my-service.prod.svc.cluster.local`, the cluster DNS Service returns a `CNAME` record with the value `my.database.example.com`. Accessing `my-service` works in the same way as other Services but with the crucial difference that redirection happens at the DNS level rather than via proxying or forwarding. Should you later decide to move your database into your cluster, you can start its Pods, add appropriate selectors or endpoints, and change the Service's `type`.

---

## Resource 4: Secret

### - A. What is a ConfigMap

A **ConfigMap** is a Kubernetes resource used **to store non-confidential** configuration data in key-value pairs. It **decouples configuration** artifacts **from container images**, allowing applications to be configured dynamically **without rebuilding images**.

### - B. How to create a ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: "debug"
  APP_MODE: "production"
```

Or using kubectl:

```bash
kubectl create configmap app-config --from-literal=LOG_LEVEL=debug --from-literal=APP_MODE=production
```

### - C. How to Attach a ConfigMap to a Deployment

As Environment Variables:

```yaml
envFrom:
  - configMapRef:
      name: app-config
```

As Mounted Files (e.g. config files):

```yaml
volumeMounts:
  - name: config-volume
    mountPath: /etc/config
volumes:
  - name: config-volume
    configMap:
      name: app-config
```

### - D. Additional Notes

- ConfigMaps are **namespaced**.
- Not suitable for secrets; use `Secret` for sensitive data.
- If the ConfigMap is deleted or changed, pods may need a restart (unless files are mounted and watched).
- You can combine ConfigMaps with `Downward API` to inject runtime metadata.

---

## Resource 5: Secret

### - A. What is a Secret

A **Secret** is a Kubernetes resource used to **store sensitive data**, such as passwords, API keys, tokens, or TLS certificates, in a secure and encoded way.

### - B. Common Use Cases

- Database credentials
- OAuth tokens
- SSH keys
- TLS certs and keys
- Third-party service credentials

### - C. How to create a Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: YWRtaW4=      # "admin"
  password: c2VjcmV0MTIz  # "secret123"
```

Or using kubectl:

```bash
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secret123
```

### - D. How to Attach a Secret to a Deployment

As Environment Variables:

```yaml
envFrom:
  - secretKeyRef:
      name: db-secret
```

As Mounted Files (e.g. config files):

```yaml
volumeMounts:
  - name: secret-volume
    mountPath: /etc/secrets
volumes:
  - name: secret-volume
    configMap:
      name: db-secret
```

### - E. Additional Notes

- Secrets are **base64-encoded**, not encrypted by default.
- Enable encryption at rest via `EncryptionConfiguration` for stronger protection.
- Secrets are **namespaced**.
- Avoid printing Secrets in logs or exposing them in `kubectl describe`.

### - F. Best Practices

- Use `Secret` for anything you wouldn't commit to Git.
- Combine with `ConfigMap` for full app configuration.
- Use Kubernetes RBAC to restrict access to secrets.
- Rotate secrets regularly and automate updates with tools like Vault or SealedSecrets.

---

## Resource 6: ServiceAccount

### - A. What is a ServiceAccount

A **ServiceAccount** is a Kubernetes resource that provides an **identity for pods** to interact with the Kubernetes API. It defines what a pod is allowed to do within the cluster using associated **credentials and permissions**.

### - B. Why Do We Need It?

- **Authentication**: Every pod that accesses the Kubernetes API needs an identity.
- **Fine-grained permissions**: Paired with **RBAC** (Role-Based Access Control) to restrict what a pod can do (e.g., list pods, read secrets).
- **Isolation**: Different pods can use different ServiceAccounts with different privileges.

### - C. Default Behavior

- Each _namespace_ has a **default ServiceAccount**.
- If no `ServiceAccount` is specified, pods use `default`.
- Kubernetes automatically mounts a token from the `ServiceAccount` into pods at `/var/run/secrets/kubernetes.io/serviceaccount`.

### - D. How to create a ServiceAccount

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
```

Or using kubectl:

```bash
kubectl create secret generic db-secret \
  --from-literal=username=admin \
  --from-literal=password=secret123
```

### - E. How to Attach a ServiceAccount to a Deployment

```yaml
spec:
  serviceAccountName: app-sa
```

### - F. Combining with RBAC

To control access:

- Create a **Role** or **ClusterRole**
- Create a **RoleBinding** or **ClusterRoleBinding** that binds the role to the ServiceAccount.

Example RoleBinding:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
  - kind: ServiceAccount
    name: app-sa
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

### - G. Best Practices

- **Use least privilege**: Only grant the permissions a pod truly needs.
- Avoid using the `default` ServiceAccount for production workloads.
- **Rotate tokens** if compromised (via ServiceAccount recreation or automation).

---

## Resource 999: Ingress

### - A. What is an Ingress

An **Ingress** is a Kubernetes resource that **manages external HTTP(S) access** to services within a cluster. It acts as a **layer 7 (application layer) reverse proxy**, routing traffic based on hostnames and paths.

### - B. Why Do We Need It?

- **Single entry point**: Consolidates external access to multiple services.
- **Path-based (or host-based) routing**: Routes requests to different services based on URL or hostname.
- **TLS termination**: Handles HTTPS at the edge.
- **Custom rules**: Supports redirects, headers, rate limiting, etc. via annotations or controllers.

### - C. How It Works

- An Ingress requires an **Ingress Controller** (e.g., NGINX, Traefik, HAProxy).
- The Ingress resource defines rules.
- The controller watches Ingress resources and updates its proxy configuration accordingly.

### - D. How to create a ServiceAccount

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: example.com
      http:
        paths:
          - path: /app
            pathType: Prefix
            backend:
              service:
                name: my-service
                port:
                  number: 80
```

### - E. How to Expose a Deployment via Ingress

```yaml
spec:
  tls:
    - hosts:
        - example.com
      secretName: tls-secret
```

### - F. Additional Notes

- Works only with HTTP(S) traffic (for TCP/UDP, use a LoadBalancer or Service).
- You must **install an Ingress Controller** separately (Ingress alone does nothing).
- Supports rewrite rules, authentication, rate limiting, etc. via annotations.

### - G. Best Practices

- Use **host-based routing** for cleaner URL management.
- Use **TLS** for secure traffic.
- Keep Ingress rules in sync with DNS entries.
- Monitor and secure your Ingress Controller — it's a major attack surface.
