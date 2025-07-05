# Troubleshooting

## 1. Describe a pod

```bash
kubectl describe pod backend-service -n application
```

**When to use examples:**

- When a pod is stuck on pending

---

## 2. Describe a deployment

```bash
k describe deployment configuration-server
```

**When to use examples:**

- You just ran a `helm upgrade`, and a deployment was created, but no pods were created.

---

## 3. Get Nodes

```bash
kubectl get nodes
```

**When to use examples:**

- pod is stuck on pending

To enable scheduling on your node:

```bash
kubectl uncordon eastus-prod-local
```
