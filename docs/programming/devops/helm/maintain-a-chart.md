# Maintain a chart

## 1. Create a chart

use the command:

```bash
`helm create CHART_NAME`
```

When you run `helm create`, a folder will be created with the following structure:

- Chart.yaml
- values.yaml
- templates/
- charts/

## 2. Chart.yaml

### • Description

The **Chart.yaml** for helm is much like what the **package.json** is for npm.

The **Chart.yaml** is a required metadata file for every Helm chart. It serves as the manifest that defines the chart itself.

### • Purpose of Chart.yaml

It contains key metadata about your chart so that Helm and other tools know:

- What the chart is
- What version it is
- What it depends on
- What Kubernetes resources it describes

### • Common fields in Chart.yaml

```yml
apiVersion: v2
name: my-app
description: A Helm chart for Kubernetes
type: application
version: 0.1.0
appVersion: "1.16.0"
```

| Field       | Purpose                                                                            |
| ----------- | ---------------------------------------------------------------------------------- |
| apiVersion  | (required) Chart API version (v2 for Helm 3).                                      |
| name        | (required) Name of the chart.                                                      |
| version     | (required) Version of the chart itself. Helm uses this for upgrades and rollbacks. |
| description | Short human-readable summary.                                                      |
| type        | `application` (default) or `library`.                                              |
| appVersion  | Version of the actual app being deployed (informational). i.e, MongoDB 8.0         |

### • Why it matters

- Helm installs and upgrades charts based on `version`.
- `dependencies` can be listed here, allowing Helm to pull in subcharts automatically.
- Tools like `helm repo` and `helm package` read this file to index and distribute your chart.

### • More optional keys

- You can specify an `icon`.
- You can specify `keywords`.
- You can specify `home`, which is the home url of your project.
- `maintainers`: list of people maintaining this chart.

<br/>

## 3. helpers

```
_helpers.tpl
```

It starts with an underscore (`_`) so that it would always come on top.
The `tpl` stands for template.

The `_helpers.tpl` contains methods that can be used in a `.yaml` file. If you open it you can see a bunch of functions defined.

```yml
{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "hello.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}
```

```yml
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "hello.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}
```

---

## 4. Templating Syntax & tricks

### - A. if statement

```yaml
{{- if .Values.ingress.enabled}}
# something here...
{{- end }}
```

<br/>

### - B. `include`

`include` is a way to invoke a helper function, defined in one of your `.tpl` files.  
You can pass all parameters to it like so: `.`

```yaml
{{ include SOME.FUNC.NAME}}
```

---

## 5. helm package

When it's time to package the chart up for distribution, you can run the `helm package` command:

```bash
helm package path/to/chart-root
```

The output of this command is a file named: `CHART_NAME-0.1.0.tgz`.

Charts that are packaged can be loaded into chart repositories. See the documentation for [Helm chart repositories](https://helm.sh/docs/topics/chart_repository/) for more details.
