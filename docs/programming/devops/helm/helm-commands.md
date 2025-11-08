# Helm Commands

## - Command 1: helm ls

**- The command:**

```bash
helm ls -n NAMESPACE
```

Or...

```bash
helm list -n NAMESPACE
```

**- Description:**

This command **lists all the releases** for a specified namespace (uses current namespace context if namespace not specified).

```bash
helm list --all                 # Show all releases without any filter applied, can use -a
helm list --all-namespaces      # List releases across all namespaces, we can use -A
helm list -l key1=value1,key2=value2 # Selector (label query) to filter on, supports '=', '==', and '!='
helm list --date                # Sort by release date
helm list --deployed            # Show deployed releases. If no other is specified, this will be automatically enabled
helm list --pending             # Show pending releases
helm list --failed              # Show failed releases
helm list --uninstalled         # Show uninstalled releases (if 'helm uninstall --keep-history' was used)
helm list --superseded          # Show superseded releases
```

<br/>

## - Command 2: helm create

**- The command:**

```bash
helm create CHART_NAME
```

**- Description:**

create a new **chart** with the given name.

This command creates a chart directory along with the common files and directories used in a chart. `helm create` takes a _path_ for an argument. If directories in the given path do not exist, Helm will attempt to create them as it goes. If the given destination exists and there are files in that directory, conflicting files will be overwritten, but other files will be left alone.

For example, `helm create foo` will create a directory structure that looks something like this:

```
foo/
├── .helmignore   # Contains patterns to ignore when packaging Helm charts.
├── Chart.yaml    # Information about your chart
├── values.yaml   # The default values for your templates
├── charts/       # Charts that this chart depends on
└── templates/    # The template files
    └── tests/    # The test files
```

<br/>

## - Command 3: helm uninstall

**- The command:**

```bash
helm uninstall RELEASE_NAME -n NAMESPACE
```

**- Description:**

Uninstall a release.

This command takes a release name and uninstalls the release. It removes all of the resources associated with the last release of the chart as well as the release history, freeing it up for future use.

#### The `--keep-history` flag

In the past, this flag was true by default. Now, running `uninstall` deletes everything. If you want to uninstall a chart, but keep its history, use this flag.

<br/>

## - Command 4: helm install

**- The command:**

```bash
helm install RELEASE_NAME path/to/chart-root --values path/to/values.yaml -n NAMESPACE --debug
```

**- Description:**

This command installs a **chart** archive, and gives it a **nickname** which you provide.

- The `-f`, `--values` flags specify values in a YAML file or a URL (can specify multiple).
- The `--debug` flag enables verbose output.
- The `--dry-run` flag simulates an install. `--dry-run` is similar to `--dry-run=client`, which means that it will not attempt cluster connections, while setting `--dry-run=server` attempts to connect the cluster.
- The `--force` flag forces resource updates through a replacement strategy.
- The `--verify` flag verifies the package before using it.
- The `--wait` flag will wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a **ready state** before marking the release as **successful**. It will wait for as long as `--timeout`. If no `--timeout was specified`, defaults to `5m0s`.
- `--no-hooks`: This skips running hooks for the command

The install argument must be a **chart reference**, a **path to a packaged chart**, a **path to an unpacked chart directory**, or a **URL**.

**When using a path to an unpacked chart directory:**

1. The `root` directory must include a `Chart.yaml` file.
2. Inside that `Chart.yaml` file, you **MUST** specify:
   - a `name` field
   - an `version` field
3. The `root` directory needs to include a folder named `templates`. This isn't required per-say, since the operation won't fail if one does not exist. However, even though running `helm ls` would show that a chart has been created, nothing would actually be deployed to your cluster! So while technically it is not required, it _is_ sort of required.
4. The `templates` folder is where you include all your yaml files, whether it be a config for a **deployment**, or a **service**, or a **configmap**. The names of the files don't matter, since kubernetes/helm looks inside the file and derives what resource it is based on its `Kind`.
5. The root folder may include a `values.yaml` file, to which you would point when invoking the `install` command, along with the flag of `--values`.

**Another way to set values**

To override values in a chart, use either the '--values' flag and pass in a file or use the '--set' flag and pass configuration from the command line, to force a string value use '--set-string'. You can use '--set-file' to set individual values from a file when the value itself is too long for the command line or is dynamically generated. You can also use '--set-json' to set json values (scalars/objects/arrays) from the command line.

**- Example Usage:**

```bash
helm install user ./user --values ./user/values.yaml -n NAMESPACE --create-namespace
```

<br/>

## - Command 5: helm upgrade

**- The command:**

```bash
helm upgrade RELEASE_NAME path/to/chart-root --values path/to/values.yaml -n NAMESPACE
```

**- Description:**

This command upgrades a release to a new version of a chart.

The upgrade arguments must be a `release` and `chart`.

#### - A. The `CHART` argument:

The chart argument can be either: a path to a chart directory, a packaged chart, a fully qualified URL, or a chart _reference_ ('example/mariadb'). For chart _references_, the **latest** version will be specified unless the '--version' flag is set.

#### - B. The `--values` flag:

To override values in a chart, use either the `--values` flag and pass in a file or use the `--set` flag and pass configuration from the command line, to force string values, use `--set-string`. You can use `--set-file` to set individual values from a file when the value itself is too long for the command line or is dynamically generated. You can also use `--set-json` to set json values (scalars/objects/arrays) from the command line.  
You can specify the `--values`/`-f` flag multiple times. **Priority will be given to the last values.yaml specified** (the one on the most-right). If both `values.yaml` and `values-override.yaml` contained a key called `Test`, the value set in `values-override.yaml` would win.

#### - C. The `--reuse-values` flag:

Re-use values from last release. When upgrading, reuse the last release's values, and merge in any overrides. If `--reset-values` is specified, this flag ignored.  
Imagine this situation: You initially install a chart with...

```bash
helm install my-release my-chart --set image.tag=1.0.0 --set replicas=3
```

Later, you want to only change the image tag:

```bash
helm upgrade my-release my-chart --set image.tag=2.0.0
```

If you don't use `--reuse-values`, then:

- `replicas` will reset to the chart default (e.g., let's say 1),
- Because you're only passing `image.tag`, Helm thinks "oh, I should use only these values."

#### - D. The `--dry-run` flag

The `--dry-run` mode would only go through the first few steps of `helm install`, meaning it will load the charts, merge values from `values.yaml`, render the required k8s templates, but it will not submit them to the k8s API server, and thus, will not get created.

To sum up, the `--dry-run` flag will output all generated `chart manifests`, including `Secrets` which can contain sensitive values. You can hide Kubernetes Secrets using the `--hide-secret` flag. Please carefully consider how and when these flags are used.

**- Usage Example:**

```bash
helm upgrade --install users-service ./toolbox/deploy/charts/users-service --values ./toolbox/deploy/charts/users-service/values.yaml -n application
```

<br/>

## - Command 6: helm status

**- The command: status**

```bash
helm status CHART_NAME -n NAMESPACE
```

**- Description:**

The `helm status` commands is useful when using the `helm install` command. When running `helm install`, Helm does not wait until all of the resources are running before it exits. Many charts require Docker images that are over 600MB in size, and may take a long time to install into the cluster. So, to keep track of a release's state, or to re-read configuration information, you can use `helm status`.

Display the status of the named release.

This command shows the status of a named release. The status consists of:

- last deployment time

- k8s namespace in which the release lives

- state of the release (can be: unknown, deployed, uninstalled, superseded, failed, uninstalling, pending-install, pending-upgrade or pending-rollback)

- revision of the release

- description of the release (can be completion message or error message, need to enable --show-desc)

- list of resources that this release consists of (need to enable --show-resources)

- details on last test suite run, if applicable

- additional notes provided by the chart

<br/>

## - Command 7: helm history

**- The command:**

```bash
helm history RELEASE_NAME -n NAMESPACE
```

**- Description:**

Fetch a release's history.

`history` prints out historical revisions for a given release. A default maximum of 256 revisions will be returned. Setting `--max` configures the maximum length of the revision list returned.

<br/>

## - Command 8: helm rollback

**- The command:**

```bash
helm rollback RELEASE_NAME REVISION_NUMBER -n NAMESPACE
```

**- Description:**

Roll back a release to a previous revision.

- The first argument of the rollback command is the `name` of a release.
- The second is a `revision number` (version number). _If this argument is omitted or set to 0, it will roll back to the **previous** release_.

<br/>

## - Command 9: helm template

**- The command:**

```bash
helm template CHART path/to/chart --values path/to/values.yaml
```

**- Description:**

Render chart templates locally and display the output.

Any values that would normally be looked up or retrieved in-cluster will be faked locally. Additionally, none of the server-side testing of chart validity (e.g. whether an API is supported) is done.

The `template` command outputs clean templates, ready to be used by a kubernetes API server, so if you like doing all the applying job yourself, and just want helm to help you with the creation of the charts, you have an option for that as well.

Note that creating a template does not communicate with the server at all, not even for validating that the resource template yaml is ok. This is as opposed to the `--dry-run` flag on `helm upgrade`, which does. This is what makes `helm template` so useful, that it doesn't need the credentials to talk to a k8x cluster, just to have a template validated.

## - Command 10: helm package

**- The command:**

```bash
helm package path/to/root [flags] --version VERSION_NUMBER --debug
```

**- Description:**

Package a chart directory into a chart archive.

This command packages a chart into a **versioned** chart archive file. If a path is given, this will look at that path for a chart (which must contain a `Chart.yaml` file) and then package that directory.

Versioned chart archives are used by Helm package repositories.

To sign a chart, use the '--sign' flag. In most cases, you should also provide '--keyring path/to/secret/keys' and '--key keyname'.

```bash
helm package --sign ./mychart --key mykey --keyring ~/.gnupg/secring.gpg
```

If '--keyring' is not specified, Helm usually defaults to the public keyring unless your environment is otherwise configured.

<br/>

## - Command 11: helm get values

**- The command:**

```bash
helm get values RELEASE_NAME
```

**- Description:**

Download the values file for a named release.

Running the command just like that, gives you the values used on this upgrade alone.

#### The `--all` flag

To get all values, use the `--all` flag.

#### The `--revision` flag

To get values from a specific revision (deployment), use the `--revision` flag, followed by the number. You can get the number by running `helm history CHART`.

<br/>

## - Command 12: helm get notes

**- The command:**

```bash
helm get notes RELEASE_NAME
```

**- Description:**

Get the release notes of some named release.

<br/>

## - Command 13: helm get manifest

**- The command:**

```bash
helm get manifest RELEASE_NAME
```

**- Description:**

Download the manifest for a named release.

The manifest is a YAML representation of all the Kubernetes resources that were generated from this release's chart(s).

#### The `--revision` flag

Get the manifest of a specific revision.

---

```bash
helm show values CHART_LOCATION
```

Not useful for local charts, but definitely useful for remote charts.

Displays what options are configurable on a chart.

**Override default configuration**

There are two ways to pass configuration data during install:

- `--values` (or `-f`): Specify a YAML file with overrides. This can be specified multiple times and the rightmost file will take precedence
- `--set`: Specify overrides on the command line.

If both are used, `--set` values are merged into `--values` with higher precedence. Overrides specified with `--set` are persisted in a Secret. Values that have been `--set` can be viewed for a given release with `helm get values <release-name>`. Values that have been `--set` can be cleared by running `helm upgrade` with `--reset-values` specified.

**The Format and Limitations of `--set`**

The --set option takes zero or more name/value pairs. At its simplest, it is used like this: --set name=value. The YAML equivalent of that is:

```yaml
name: value
```

Multiple values are separated by , characters. So `--set a=b,c=d` becomes:

```yaml
a: b
c: d
```

More complex expressions are supported. For example, `--set outer.inner=value` is translated into this:

```yaml
outer:
  inner: value
```

Lists can be expressed by enclosing values in `{ and }`. For example, `--set name={a, b, c}` translates to:

```yaml
name:
  - a
  - b
  - c
```

Certain name/key can be set to be `null` or to be an empty array `[]`. For example, `--set name=[],a=null` translates

```yaml
name:
  - a
  - b
  - c
a: b
```

to:

```yaml
name: []
a: null
```

As of Helm 2.5.0, it is possible to access list items using an array index syntax. For example, `--set servers[0].port=80` becomes:

```yaml
servers:
  - port: 80
```

Multiple values can be set this way. The line `--set servers[0].port=80,servers[0].host=example` becomes:

```yaml
servers:
  - port: 80
    host: example
```

Sometimes you need to use special characters in your `--set` lines. You can use a backslash to escape the characters; `--set name=value1\,value2` will become:

```yaml
name: "value1,value2"
```

```bash
helm lint
```
