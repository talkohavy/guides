# Helm Daily Workflow

## - A. list all your charts

You start out by listing all your charts with:

```bash
helm ls
```

## - B. Delete a deployment + service

You can uninstall any of the listed charts using:

```bash
helm uninstall CHART_NAME
```

## - C. Create a new chart-template with deployment+service for an app

```bash
helm create CHART_NAME
```

## - D. Provision a deployment+service for the first time

```bash
helm install CHART_NAME . --values values.yaml --debug --verify -n NAMESPACE --create-namespace
```

Or by using force:

```bash
helm install CHART_NAME . --values values.yaml --debug --verify -n NAMESPACE --create-namespace --force
```

## - E. Keep track of an installation progress

```bash
helm status CHART_NAME -n NAMESPACE
```

## - F. Upgrade (update) a chart's revision

```bash
helm upgrade CHART_NAME . --install --values values.yaml -n NAMESPACE --create-namespace
```

Notice the `--install` flag, which makes `helm install` command redundant, since you now no longer need to decide between `helm install` & `helm upgrade`, just always use `helm upgrade`.

## - G. Abort unsuccessful upgrade of a chart

When an upgrade is unsuccessful, and the `rollingUpdate` seems to fail, you might need to abort the upgrade. Here's how you do it:

If you know the **revision number** of the current successful chart, simply **rollback** to it:

```bash
helm rollback CHART_NAME REVISION_NUMBER -n NAMESPACE
```

If you need to check the current revision number, you can use the **history** command:

```bash
helm history backend -n NAMESPACE
```

## - H. Decrypt a helm Secret

```bash
kubectl get secret sh.helm.release.v1.mysql-db-service.v1 -o jsonpath="{ .data.release }" | base64 -d | base64 -d | gunzip -c | jq '.chart.templates[].data' | tr -d '"' | base64 -d > hello.txt
```
