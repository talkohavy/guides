# Most useful Commands

## **- Command 1: show logs of pod**

**The command:**

```bash
kubectl logs POD_NAME -n NAMESPACE -f
```

**Description:**

Show logs inside a pod.

<br/>

## **- Command 2: port-forward**

**The command:**

```bash
kubectl port-forward TYPE/NAME [options] [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N]
```

**Description:**

You way of connecting to a pod from the host.

The `kubectl port-forward` command in Kubernetes allows you to forward one or more local ports to a port on a Pod (or other Kubernetes resource like a Service). **This is useful for debugging or temporarily accessing services running inside your cluster without exposing them externally**.

Use resource type/name such as deployment/my_deployment to select a pod. Resource type defaults to `pod` if omitted.

**Common Use-Case:**

Accessing a web app running in a pod.

✅ Do this:

```bash
kubectl port-forward svc/frontend-server -n application 8080:3000
```

You can now access the service at http://localhost:8080.

❌ NEVER DO THIS:

```bash
kubectl port-forward deployment/my-service 8080:3000
```

While using `deployment/` may seem like it works, you're losing so many benefits that `svc/` provides. The former is a direct connection to one specific pod (Kubernetes picks one), where the latter routes through the Service's load balancing mechanism, so you have multiple pods, a service discovery, and resilience: (If a pod dies),

**Notes:**

- This is a **temporary and local-only** tunnel; it's not for production use.
- It requires `kubectl` to stay running in your terminal.
- You must have access to the pod via your Kubernetes context.
- always use `svc/`, do not use `deployment/`.

<br/>

## **- Command 3: kubectl exec**

**The command:**

```bash
kubectl exec -it -n NAMESPACE POD_NAME -c CONTAINER_NAME -- sh
```

**Description:**

Use this command to:

1. Execute a command inside a **running** pod.
2. Execute a command inside a **running** container inside a **running** pod.

- If the `-n` flag is omitted, namespace defaults to `default`.
- If the `-c` flag is omitted, ssh is to the pod.
- If the `-c` flag is used, ssh is to the container inside the pod.

This command is very similar to the `docker exec` command.

**Common Use-Case:**

```bash
kubectl exec -it -n solve-dev solvebe-admin-server-3d45e6 -c solve-admin-server -- sh
```

<br/>

## **- Command 4: manually delete a pod**

**The command:**

```bash
kubectl delete pod POD_NAME
```

**Description:**

Deletes a pod by name.

A deleted pod, which was **manually created**, would be deleted forever.  
A deleted pod, which was created by a **deployment**, would also be deleted, but a few seconds later, the deployment would create a new pod that would have a different hash and a IP address.

<br/>

## **- Command 5: rollout status deploy**

**The command:**

```bash
kubectl rollout status deploy DEPLOYMENT_NAME
```

**Description:**

The terminal is kept busy until the rollout is complete.  
You get online updates about completed steps.  
Most commonly used with:  
`kubectl scale deployment DEPLOYMENT_NAME --replicas=#number`

**Example Usage:**

```bash
kubectl rollout status deploy ai-gateway-service -n dev-chatbot
```

<br/>

## **- Command 6: manually scale a deployment**

**The command:**

```bash
kubectl scale deployment DEPLOYMENT_NAME --replicas=#number
```

**Example Usage:**

```bash
kubectl rollout status deploy ai-gateway-service -n dev-chatbot
```

<br/>
