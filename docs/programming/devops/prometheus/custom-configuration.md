# Custom Configuration

To provide your own configuration, there are several options. Here are two examples.

## Bind-mount your `prometheus.yml` from the host by running:

```bash
docker run \
    -p 9090:9090 \
    -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
    prom/prometheus
```

## bind-mount the directory containing `prometheus.yml` onto `/etc/prometheus` by running:

```bash
docker run \
    -p 9090:9090 \
    -v /path/to/config:/etc/prometheus \
    prom/prometheus
```

## Use a custom image

To avoid managing a file on the host and bind-mount it, the configuration can be baked into the image. This works well if the configuration itself is rather static and the same across all environments.

For this, create a new directory with a Prometheus configuration and a `Dockerfile` like this:

```bash
FROM prom/prometheus
ADD prometheus.yml /etc/prometheus/
```

Now build and run it:

```bash
docker build -t my-prometheus .
docker run -p 9090:9090 my-prometheus
```
