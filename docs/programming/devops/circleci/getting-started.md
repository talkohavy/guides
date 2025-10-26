# Getting Started

## 1. Configuration

CircleCI believes in _configuration_ as code. Your entire CI/CD process is orchestrated through a single file called `config.yml`. The `config.yml` file is located in a folder called `.circleci` at the root of your project that defines the entire pipeline.

Example of a directory setup using CircleCI:

```yaml
├── .circleci
│   ├── config.yml
├── README
└── all-other-project-files-and-folders
```

Your CircleCI configuration can be adapted to fit many different needs of your project.

Here are the most important terms you should know:

- **Pipeline**: Represents the entirety of your configuration.
- **Workflows**: Responsible for orchestrating multiple jobs.
- **Jobs**: Responsible for running a series of steps that perform commands.
- **Steps**: Run commands (such as installing dependencies or running tests) and shell scripts to do the work required for your project.

**What we will do?**

To get started, you'll need to:

1. Create a workflow. (💻)
2. Create a pipeline. (🌍)
3. Create a trigger rule, that would tell the pipeline when to run. (🌍)

💻 - can only be done through the code
🌍 - can only be done through the Web Application

---

## 2. Create Your first Workflow

In your project create a config yaml file:

```bash
touch .circleci/config.yml
```

In a config you can create multiple workflows.  
A workflow runs a series of jobs.  
A jobs runs a series of steps.

Add the following contents to it:

```yaml title=".circleci/config.yml"
version: 2.1

executors:
  nodejs-executor:
    docker:
      - image: cimg/node:22.16.0
    resource_class: large

jobs:
  'Hello World':
    executor: nodejs-executor
    working_directory: ~/app
    steps:
      - run:
          name: 'Step: initialize stuff'
          command: echo "initializing stuff..."
      - run:
          name: 'Step: echo Hello World'
          command: echo "Hello World"

workflows:
  'Test Pipeline':
    jobs:
      - 'Lint & Format'
```

As you can see, in this file we created 1 executor, 1 workflow, that runs 1 job with 2 steps inside of it.

:::info
A `Job`'s name MUST follow pattern of: `^[A-Za-z][A-Za-z\s\d_-]*$`

That means **no spaces allowed**!

A `Workflow`'s name however can have spaces.
:::

---

## 3. Configure when to run configuration

In the CircleCI [Web Application](https://app.circleci.com/home):

- Go to [Your organization](https://app.circleci.com/organization/github/talkohavy)
- Click on [Projects](https://app.circleci.com/projects/project-dashboard/github/talkohavy).
- Locate your project, hit the "..." kebab menu, and choose [Project Settings](https://app.circleci.com/settings/project/github/talkohavy/luckylove?return-to=https%3A%2F%2Fapp.circleci.com%2Fprojects%2Fproject-dashboard%2Fgithub%2Ftalkohavy)
- Select [Project Setup](https://app.circleci.com/settings/project/github/talkohavy/luckylove/setup?return-to=https%3A%2F%2Fapp.circleci.com%2Fprojects%2Fproject-dashboard%2Fgithub%2Ftalkohavy)

Here, you'll need to create a **pipeline**.

A pipeline is comprised of:

- a full path to the configuration file
- a repo to checkout
- when to trigger (_optional_)

Here, you can choose **when to trigger** each configuration.  
Without triggers, you can still run pipelines **manually** or **via API**.
