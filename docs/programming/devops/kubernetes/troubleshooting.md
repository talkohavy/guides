# Troubleshooting

## 1. When a pod is stuck on pending

```bash
kubectl describe pod backend-service -n application
```

```bash
kubectl get secrets -n application
```

```bash
kubectl get nodes
```

To enable scheduling on your node:

```bash
kubectl uncordon eastus-prod-local
```
