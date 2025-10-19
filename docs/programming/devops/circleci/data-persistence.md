# Data persistence

Persist data to move data between jobs and speed up your build. There are three main methods for persisting data in CircleCI: artifacts, caches, and workspaces.

Note the following distinctions between artifacts, caches and workspaces:

| Type      | Lifetime | Use                           | Example                                                                                                                    |
| --------- | -------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Artifacts | Months   | Preserve long-term artifacts. | Available in the Artifacts tab of the **Job** page under the `tmp/circle-artifacts.<hash>/container` or similar directory. |
