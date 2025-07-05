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

- node STATUS might SCHEDULE something, which makes new pods get stuck on pending.
- wanting to check the docker architecture

To enable scheduling on your node:

```bash
kubectl uncordon eastus-prod-local
```

```bash
kubectl describe node eastus-prod-local | grep -i arch
```

Check the architecture of the host:

```bash
uname -m
```
