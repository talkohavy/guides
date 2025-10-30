# Helm Architecture

Helm has 4 big concepts to it:

## 1. Helm's 3 Big Concepts

### - Concept 1: Chart

A **Chart** is a Helm package. It contains all of the resource definitions necessary to run an application, tool, or service inside of a Kubernetes cluster. Think of it like the Kubernetes equivalent of a Homebrew formula, an Apt dpkg, or a Yum RPM file.

### - Concept 2: Repository

A **Repository** is the place where charts can be collected and shared. It's like the Fedora Package Database, but for Kubernetes packages.

### - Concept 3: Release

A **Release** is _an instance of a **chart**_ running inside a Kubernetes cluster. One chart can often be installed many times into the same cluster. And each time it is installed, a new **release** is created. Consider a `MySQL` chart. If you want two databases running in your cluster, you can install that chart twice. Each one will have its own **release**, which will in turn have its own _release name_.

With these concepts in mind, we can now explain Helm like this:

Helm installs **charts** into Kubernetes, creating a new **release** for each installation. And to find new charts, you can search Helm chart **repositories**.

```bash
helm show values
```

Now that you know all the basic concepts, try reading again the ["What is Helm?"](/docs/programming/devops/helm/introduction/#1-what-is-helm) section again.

---

## 2. Charts

### The Chart File Structure

A chart is organized as a collection of files inside of a directory. The directory name is the name of the chart (without versioning information). Thus, a chart describing WordPress would be stored in a `wordpress/` directory.

Inside of this directory, Helm will expect a structure that matches this:

```
wordpress/
  Chart.yaml          # A YAML file containing information about the chart
  LICENSE             # OPTIONAL: A plain text file containing the license for the chart
  README.md           # OPTIONAL: A human-readable README file
  values.yaml         # The default configuration values for this chart
  values.schema.json  # OPTIONAL: A JSON Schema for imposing a structure on the values.yaml file
  charts/             # A directory containing any charts upon which this chart depends.
  crds/               # Custom Resource Definitions
  templates/          # A directory of templates that, when combined with values,
                      # will generate valid Kubernetes manifest files.
  templates/NOTES.txt # OPTIONAL: A plain text file containing short usage notes
```

Helm reserves use of the `charts/`, `crds/`, and `templates/` directories, and of the listed file names. Other files will be left as they are.

### The Chart.yaml File

A `Chart.yaml` functions very much like the `package.json` file for node/js projects.

The `Chart.yaml` file is required for a chart, and it contains the following fields:

```yaml
apiVersion: The chart API version (required)
name: The name of the chart (required)
version: A SemVer 2 version (required)
kubeVersion: A SemVer range of compatible Kubernetes versions (optional)
description: A single-sentence description of this project (optional)
type: The type of the chart (optional)
keywords:
  - A list of keywords about this project (optional)
home: The URL of this projects home page (optional)
sources:
  - A list of URLs to source code for this project (optional)
dependencies: # A list of the chart requirements (optional)
  - name: The name of the chart (nginx)
    version: The version of the chart ("1.2.3")
    repository: (optional) The repository URL ("https://example.com/charts") or alias ("@repo-name")
    condition: (optional) A yaml path that resolves to a boolean, used for enabling/disabling charts (e.g. subchart1.enabled )
    tags: # (optional)
      - Tags can be used to group charts for enabling/disabling together
    import-values: # (optional)
      - ImportValues holds the mapping of source values to parent key to be imported. Each item can be a string or pair of child/parent sublist items.
    alias: (optional) Alias to be used for the chart. Useful when you have to add the same chart multiple times
maintainers: # (optional)
  - name: The maintainers name (required for each maintainer)
    email: The maintainers email (optional for each maintainer)
    url: A URL for the maintainer (optional for each maintainer)
icon: A URL to an SVG or PNG image to be used as an icon (optional).
appVersion: The version of the app that this contains (optional). Needn't be SemVer. Quotes recommended.
deprecated: Whether this chart is deprecated (optional, boolean)
annotations:
  example: A list of annotations keyed by name (optional).
```

As of `v3.3.2`, additional fields are not allowed. The recommended approach is to add custom metadata in `annotations`.

---

## 3. Charts and Versioning

Every chart must have a version number. A version must follow the SemVer 2 standard. Unlike Helm Classic, Helm v2 and later uses version numbers as release markers. Packages in repositories are identified by name plus version.

For example, an `nginx` chart whose version field is set to `version: 1.2.3` will be named:

```
nginx-1.2.3.tgz
```

More complex SemVer 2 names are also supported, such as `version: 1.2.3-alpha.1+ef365`. But non-SemVer names are explicitly disallowed by the system.

The `version` field inside of the `Chart.yaml` is used by many of the Helm tools, including the CLI. When generating a package, the `helm package` command will use the version that it finds in the `Chart.yaml` as a token in the package name. The system assumes that the version number in the chart package name matches the version number in the `Chart.yaml`. **Failure to meet this assumption will cause an error**.

---

## 4. The `apiVersion` Field

The `apiVersion` field should be `v2` for Helm charts that require at least Helm 3. Charts supporting previous Helm versions have an `apiVersion` set to `v1` and are still installable by Helm 3.

Changes from `v1` to `v2`:

- A `dependencies` field was added in `v2`. The field is for defining chart dependencies, which in `v1` were located in a separate `requirements.yaml` file.
- The `type` field, discriminating _application_ charts and _library_ charts (see Chart Types).

---

## 5. The `appVersion` Field

Note that the `appVersion` field is not related to the `version` field. It is a way of specifying the version of the application. For example, the `drupal` chart may have an `appVersion: "8.2.1"`, indicating that the version of Drupal included in the chart (by default) is `8.2.1`. This field is informational, and has no impact on chart version calculations. Wrapping the version in quotes is highly recommended. It forces the YAML parser to treat the version number as a string. Leaving it unquoted can lead to parsing issues in some cases. For example, YAML interprets `1.0` as a floating point value, and a git commit SHA like `1234e10` as scientific notation.

As of Helm v3.5.0, `helm create` wraps the default `appVersion` field in quotes.

---

## 6. The `kubeVersion` Field

The optional `kubeVersion` field can define semver constraints on supported Kubernetes versions. Helm will validate the version constraints when installing the chart and fail if the cluster runs an unsupported Kubernetes version.

Version constraints may comprise space separated AND comparisons such as

```
>= 1.13.0 < 1.15.0
```

which themselves can be combined with the OR `||` operator like in the following example

```
>= 1.13.0 < 1.14.0 || >= 1.14.1 < 1.15.0
```

In this example the version `1.14.0` is excluded, which can make sense if a bug in certain versions is known to prevent the chart from running properly.

There's also support for these following shorthand notations:

- hyphen ranges for closed intervals, where `1.1` - `2.3.4` is equivalent to `>= 1.1 <= 2.3.4`.
- wildcards `x`, `X` and `*`, where `1.2.x` is equivalent to `>= 1.2.0 < 1.3.0`.
- tilde ranges (patch version changes allowed), where `~1.2.3` is equivalent to `>= 1.2.3 < 1.3.0`.
- caret ranges (minor version changes allowed), where `^1.2.3` is equivalent to `>= 1.2.3 < 2.0.0`.

---

## 7. Chart Types

The `type` field defines the type of chart. There are two types of charts: `application` and `library`. The **default type** is `application`, and it is the standard chart which can be operated on fully. The `library` chart provides utilities or functions for the chart builder. A `library` chart differs from an `application` chart because it is not installable and usually doesn't contain any resource objects.

**Note**: An `application` chart can be converted into a `library` chart, simply by setting the `type` to `library`. The chart will then be rendered as a `library` chart where all utilities and functions can be leveraged, and all resource objects of the chart will not be rendered.

Example usage:

```yaml title=common/_configmap.tpl
{{/*
Standard ConfigMap template
Usage: {{ include "luckylove.configmap" . }}
*/}}
{{- define "luckylove.configmap" -}}
{{- if .Values.configmap.create -}}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{include "helpers.configMapName" .}}
data:
{{- range $key, $value := .Values.configmap.data }}
  {{ $key }}: {{ $value | quote }}
{{- end }}
{{- end }}
{{- end }}
```

```yaml title=common/chart.yaml
apiVersion: v2
name: luckylove-common
description: A library chart with common templates for LuckyLove microservices
type: library
version: 1.0.0
```

And then use it like so:

```yaml
apiVersion: v2
name: chats-service
description: A Helm chart for Kubernetes
type: application
version: 1.0.0
appVersion: '1.16.0'
dependencies:
  - name: luckylove-common
    version: 1.0.0
    repository: 'file://../luckylove-common'
```

```yaml title=chats-service/configmap.yaml
{{- include "luckylove.configmap" .}}
```
