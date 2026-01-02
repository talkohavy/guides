# Prometheus

Simple run:

```bash
docker run --name prometheus -d -p 127.0.0.1:9090:9090 prom/prometheus
```

Override the config file path:

```bash
docker run --name prometheus -d -p 127.0.0.1:9090:9090 \
  prom/prometheus \
  --config.file=/etc/prometheus/custom.yml \
  --storage.tsdb.path=/prometheus
```

```bash
docker run --name prometheus -d -p 127.0.0.1:9090:9090 \
  prom/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/custom/path
```

Override both:

```bash
docker run --name prometheus -d -p 127.0.0.1:9090:9090 \
  prom/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/prometheus \
  --log.level=debug
```

Important paths from the Dockerfile

- `/etc/prometheus/prometheus.yml` — default config file location
- `/prometheus` — default storage path (also a VOLUME)
- Port `9090` — exposed port
