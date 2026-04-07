# Link a Package Locally

Useful when you want to consume a local package without publishing it.

---

## 1. Using Yarn

In the **consumer** package's `package.json`, add the dependency using the `portal:` protocol:

```json
{
  "dependencies": {
    "my-local-pkg": "portal:../path/to/pkg/dist"
  }
}
```

Then run:

```bash
yarn install
```

:::info
If you get an error about conflicting packages after installing, temporarily remove those conflicting packages from the consumer's `package.json`, then reinstall.
:::

---

## 2. Using pnpm

In the **consumer** package's `package.json`, add the dependency using the `link:` protocol:

```json
{
  "dependencies": {
    "my-local-pkg": "link:../path/to/pkg/dist"
  }
}
```

Then run:

```bash
pnpm install
```

---

## 3. Using npm

In the **package to be published**, run:

```bash
npm link
```

This registers it globally. Then, in the **consumer** package, run:

```bash
npm link my-local-pkg
```

To unlink later:

```bash
# In the consumer
npm unlink my-local-pkg

# In the local package
npm unlink
```
