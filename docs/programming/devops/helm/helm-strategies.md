# Helm Strategies

## 1. Automatically Roll Deployments

Often times ConfigMaps or Secrets are injected as configuration files in containers or there are other external dependency changes that require rolling pods. Depending on the application a restart may be required should those be updated with a subsequent `helm upgrade`, but if the deployment spec itself didn't change the application keeps running with the old configuration resulting in an inconsistent deployment.

The `sha256sum` function can be used to ensure a deployment's annotation section is updated if another file changes:

```yaml
kind: Deployment
spec:
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
[...]
```

:::info
If you're adding this to a library chart you won't be able to access your file in `$.Template.BasePath`. Instead you can reference your definition with `{{ include ("mylibchart.configmap") . | sha256sum }}`.
:::
