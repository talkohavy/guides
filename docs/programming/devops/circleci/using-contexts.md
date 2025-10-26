# Using Contexts

## 1. What is a Context?

Contexts provide a **mechanism for securing and sharing environment variables** across projects. The environment variables are defined as name/value pairs. **The environment variables are injected at runtime**.

This document describes creating and using contexts in CircleCI. You can create and manage contexts on the **Organization Settings** page of the CircleCI web app. You must be an organization member to view, create, or edit contexts. After a context has been created, you can use the `context` key in the workflows section of a project `config.yml` file to give any job(s) access to the environment variables associated with the context.

## 2. Create a context

In CircleCI web app, go to the **Organization Settings** page. There, choose **Contexts**.

This page will show you a list of all existing contexts, and a button that allows you to create a new one.

When creating a new one, you'll need to provide a **name**. That name will be used in your `config.yaml` file.

## 3. Project Restriction

By default, a `context` with no restrictions is available to all projects.

You have an option in the web app to choose repos that are allowed to use this `context`.

## 4. Add Environment variables

Inside a `context`, you'll have a button for adding a new environment variable.

The format, as mentioned, is key/value.

## 5. Referencing a context in the `config.yaml`

Here's an example from your code:

```yaml title=".circleci/config.yml"
version: 2.1

executors:
  nodejs-executor:
    docker:
      - image: cimg/node:22.16.0
    resource_class: large

# -----------
# Define Jobs
# -----------
jobs:
  # Job name
  build:
    executor: nodejs-executor
    working_directory: ~/app
    # list of steps
    steps:
      - run:
          name: "Step: check context variables"
          command: echo $ENV_VAR_FROM_CONTEXT

# ----------------
# Define Workflows
# ----------------
workflows:
  # Workflow name
  'Build & Test':
    # List of jobs
    jobs:
      - build:
          context: luckylove
```

Let's break it down:

- When we define `job` `A`, we don't give it a `context` yet.
- When we use a `job` in a `workflow`, we can then apply the `context`.

Why like this?

It would make sense to define a job once, and then run it once with context A, and then once again with context B. Therefore, we do not assign context on a job, only on a job invocation.

In short, `contexts` are being applied to `jobs` only at runtime! At the time of definition, the `job` had no clue what its `context` is going to be.
