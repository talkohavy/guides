# Dynamic configuration

## 1. What is dynamic configuration?

Instead of manually creating your configuration for each CircleCI project, you can generate this configuration dynamically, based on specific pipeline parameters or file paths. This is especially **helpful where your team is working on a monorepo**. Dynamic configuration allows you to trigger builds from _specific_ parts of your project, rather than rebuilding everything each time.

Dynamic configuration can mean:

- The work is determined by values passed in at runtime as **pipeline parameters**.
- The **configuration file is dynamically generated** by the pipeline using a template rather than being static YAML
- A project’s configuration is **pieced together dynamically depending on specific Pipeline values** or file paths.
- Using **conditional logic** and parameterization to determine the work to be done.
- Triggering pipelines defined by configurations that exist outside the default parent `.circleci/` directory.

---

## 2. Use dynamic configuration

Add the key `setup: true` to the top level of your parent configuration file to designate that `config.yml` as a setup configuration.

```yaml
version: 2.1

setup: true
```

---

## 3. Config continuation constraints
