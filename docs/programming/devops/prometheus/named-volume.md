# Using a Named Volume for Production

## Volume within the docker

The Dockerfile declares:

```bash
VOLUME [ "/prometheus" ]
```

This means `/prometheus` is a volume mount point. Prometheus stores its time-series data there.

## Named volume vs anonymous volume

From the official documentation:

> _The Prometheus image uses a volume to store the actual metrics. For production deployments it is highly recommended to use a named volume to ease managing the data on Prometheus upgrades._

### Anonymous volume (what happens by default):

```bash
docker run --name prometheus -d -p 127.0.0.1:9090:9090 prom/prometheus
```

- Docker creates an anonymous volume automatically
- The volume has a random hash name like `a1b2c3d4e5f6...`
- Hard to identify and manage

### Named volume (recommended for production):

```bash
# Create a named volume first
docker volume create prometheus-data

# Use it in your run command
docker run --name prometheus -d -p 127.0.0.1:9090:9090 \
  -v prometheus-data:/prometheus \
  prom/prometheus
```

- You give it a clear name (`prometheus-data`)
- Easy to identify, manage, and reference

## Why named volumes help with upgrades

1. Easy to reference:

```bash
# Stop old container
docker stop prometheus
docker rm prometheus

# Start new version with same data
docker run --name prometheus -d -p 127.0.0.1:9090:9090 \
  -v prometheus-data:/prometheus \
  prom/prometheus:v2.0.0
```

2. Easy to backup:

```bash
# Backup the named volume
docker run --rm -v prometheus-data:/data -v $(pwd):/backup \
  busybox tar czf /backup/prometheus-backup.tar.gz /data
```

3. Easy to inspect:

```bash
docker volume inspect prometheus-data
docker volume ls  # See all your named volumes
```

4. Persists across container removal:

- Removing the container doesn't remove a named volume
- Anonymous volumes can be orphaned and harder to track

## In kubernetes

In Kubernetes, you don't use Docker named volumes. Use PersistentVolumes (PVs) and PersistentVolumeClaims (PVCs) for persistent storage.

### Kubernetes persistent storage

Kubernetes uses PersistentVolumeClaims (PVCs) to request storage, which is similar to a named volume but managed by Kubernetes.

### How it works for Prometheus

1. Create a PersistentVolumeClaim:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: prometheus-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi
  storageClassName: standard  # or whatever your cluster uses
```

2. Use it in your Prometheus Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus
        volumeMounts:
        - name: prometheus-storage
          mountPath: /prometheus  # This matches the VOLUME in Dockerfile
        args:
          - "--config.file=/etc/prometheus/prometheus.yml"
          - "--storage.tsdb.path=/prometheus"
      volumes:
      - name: prometheus-storage
        persistentVolumeClaim:
          claimName: prometheus-data  # Reference to the PVC
```

Why this helps with upgrades

1. Data persists across pod restarts and upgrades
2. Easy to reference: use the same PVC name in new deployments
3. Kubernetes manages the underlying storage
4. Can be backed up using standard Kubernetes tools

Complete example

```yaml
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: prometheus-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        volumeMounts:
        - name: prometheus-storage
          mountPath: /prometheus
        - name: prometheus-config
          mountPath: /etc/prometheus
        args:
          - "--config.file=/etc/prometheus/prometheus.yml"
          - "--storage.tsdb.path=/prometheus"
      volumes:
      - name: prometheus-storage
        persistentVolumeClaim:
          claimName: prometheus-data
      - name: prometheus-config
        configMap:
          name: prometheus-config
```
