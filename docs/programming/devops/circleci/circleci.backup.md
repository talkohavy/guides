# CircleCI

## 1. What is CircleCI?

CircleCI is an industry leading continuous integration (CI) and deployment platform that allows engineering teams to build, test, and deploy software confidently and at scale.
Here is how the platform works: circleci integrated directly with your version control system, like github or bitbucket, and validated code changes in real-time.
In the circleci UI, you'll see a dashboard with the status for pipelines across all of your projects. You can filter the view to see just the pipelines that you've run, by project, and/or by a branch within that project. When pipelines are running, you can see the status for the pipeline updated in real-time along with the status for the workflows within that pipeline, and the jobs within those workflows.

CircleCI offers first-class support for docker, and every major operating system, including linux, macos, and windows. It supports every language and framework.

---

## 2. Why is CircleCI Important?

Nowadays, it is rare to find a company that DOES NOT use a continuous integration (CI) approach in their development processes. In case you are not familiar with it, continuous integration is a practice that encourages developers to integrate their code early and often into a shared repository.

CI tools can be configured to trigger your build and execute various sets of automated tests before merging. Depending on the configuration defined, they can even stop the integration if any failures are detected. This information will help the team identify issues early and fix them quickly, preventing bugs in your code. In other words, continuous integration improves team productivity, efficiency and confidence, so you can find problems and solve them quickly, to release higher quality and more stable products.

There are many tools that can help us implement a continuous integration approach in the development of our products. CircleCI is one of them.

---

## 3. Getting Started

If you want to hook up a new project to circleci, the first steps are very basic:
Head over to www.circleci.com, create an account (if you don't already have one), and hook it up to your new project's source control, either github or bitbucket.
The next step is to create a folder called `.circleci`:

```bash
mkdir .circleci
```

...and inside it, create a `config.yml` file:

```bash
touch .circleci/config.yml
```

Basically what's going on in that config.yml file is that you are creating and defining all of the steps in your CI/CD pipeline. So, whatever is inside that `config.yml`, once you add that circleci to your project, and make that link between them, circleci will run whatever's inside that config.yml file, every time code changes are pushed up into your remote source control. The next step is to populate the config file with what best reflects your projects configuration.

We will start with this basic `config.yml` sample, and build on it:

```yaml
---
version: 2.1

# ############################
# Part 1: Define All Workflows
# ############################
workflows:
  # Workflow No. 1: build_and_test
  build_and_test:
    jobs:
      - build
      - test:
          requires:
            - build

# #######################
# Part 2: Define all jobs
# #######################
jobs:
  # -------------------------
  # Job Number 1: a build job
  # -------------------------
  build:
    working_directory: ~/luckylove_frontend
    docker:
      - image: cimg/node:18.7.0
    steps:
      - checkout
      - run:
          name: "Step 1: Enable enable for pnpm to work"
          command: sudo corepack enable
      - run:
          name: "Step 2: Remove husky's prepare script"
          command: npm pkg delete scripts.prepare
      - run:
          name: "Step 3: Install all project's dependancies"
          command: pnpm install
      - run:
          name: "Step 4: run a production build"
          command: pnpm run build
  # ------------------------
  # Job Number 2: A Test Job
  # ------------------------
  test:
    working_directory: ~/luckylove_frontend
    docker:
      - image: cimg/node:18.7.0
    steps:
      - checkout
      - run:
          name: "Step 1: Enable enable for pnpm to work"
          command: sudo corepack enable
      - run:
          name: "Step 2: Remove husky's prepare script"
          command: npm pkg delete scripts.prepare
      - run:
          name: "Step 3: Install all project's dependancies"
          command: pnpm install
      - run:
          name: "Step 4: run a lint test"
          command: pnpm run lint
      - run:
          name: "Step 5: run e2e tests"
          command: pnpm run test
```

---

## 4. Docker & Docker Images

In the config example above, you might have come across a key called `docker`:

```yaml
docker:
  - image: cimg/node:[tag]
```

The docker keyword MUST contain the `image` keyword, and the image's keyword needs an image. That image could be a downloadable image from docker hub, or it could be onde circleci's custom images.
Now, it should be obvious to you, that in order to run your tests remotely, you first need a remote machine, right? And that machine could be anything! Windows, Macos, or Linux.
But your code is probably written for a specific OS, right?
So in order to be able to run your code remotely, that machine, whatever it maybe, HAS TO run your code inside a docker! And it's UP TO YOU to tell it which docker image of an operating system YOUR PROJECT NEEDS!

:::info
Note! Legacy images with the prefix "circleci/" were deprecated on December 31, 2021. For faster builds, upgrade your projects with next-generation convenience images. They are those which start with "cimg/..."
:::

Luckily, CircleCI maintains a fleet of images for various programming languages, databases, and operating systems. CircleCI basically gives you a machine that would run a docker container from an image with the operating system of your choice, PLUS some extra stuff that circleci needs in order to live.
You can find all of circleci custom images over at:

https://circleci.com/developer/images?imageType=docker

We are going to use `cimg/node:18.8.0`

**Note**! This image is designed to supersede the legacy CircleCI Node.js image, `circleci/node`.

`cimg/node` is a Docker image created by CircleCI with continuous integration builds in mind. Each tag contains a version of Node.js, npm, yarn v1, and any binaries and tools that are required for builds to complete successfully in a CircleCI environment.

- **Tag Version**

Basically, what we're using is this `cimg/node:<node-version>`

`<node-version>` - The version of Node.js to use. This can be a full SemVer point release, such as 10.16.3, or just the minor release, such as 12.6, or a version alias.
There are two version aliases: one is "current" and the other is "lts".
The alias "current" will always point to the latest, and the alias "lts" will always point to long term releases that Node.js has as according to their website.
**Keep in mind**! Using an alias tag will be less stable that specifying a full SemVer version. Breaking changes in node version could break your code without you knowing about it.

---

## 5. Checkout

One of the most important directives, that would be present in nearly 99% of all your jobs, and for the most part it would come as early in the beginning of a job.
Checkout performs a `git clone` to your source code, and copies all the relevant files.

How it knows what to clone?

This is one of those things that are done behind the scenes, and this was done when you first connected between circleci and github/bitbucket. By connecting them, you basically allowed circleci to peek into your repository, and gave it access to clone it.

- **From the docs**:

> A special step used to check out source code to the configured path (defaults to the working_directory). The reason this is a special step is because it is more of a helper function designed to make checking out code easy for you. If you require doing git over HTTPS you should not use this step as it configures git to checkout over ssh.

If path already exists and is:

- a git repo - step will not clone whole repo, instead will fetch origin
- NOT a git repo - step will fail.

In the case of checkout, the step type is just a string with no additional attributes:

```yaml
- checkout
```

- Note: CircleCI does not check out submodules. If your project requires submodules, add run steps with appropriate commands as shown in the following example:

```yaml
- checkout
- run: git submodule sync
- run: git submodule update --init
```

This command will automatically add the required authenticity keys for interacting with GitHub and Bitbucket over SSH, which is detailed further in our integration guide – this guide will also be helpful if you wish to implement a custom checkout command.

- Note: The checkout step will configure Git to skip automatic garbage collection. If you are caching your .git directory with restore_cache and would like to use garbage collection to reduce its size, you may wish to use a run step with command git gc before doing so.

---

## 6. Jobs & Steps

Even the most basic circleci `config.yml` file would have this trio of: workflow, jobs & steps.
A CircleCI job is a collection of steps. All of the steps in the job are executed in a single unit, either within a fresh container, or a virtual machine. Jobs are orchestrated using workflows (soon to be discussed).
Inside the config.yml, we define all the jobs we want to run, for example `build` and `test`, and inside each of them, we specify 1 or more steps to be ran.
All jobs would be defined under the root key of `jobs`:

```yaml
jobs:
  build:
    docker: ...
    steps:
      - checkout
      - run echo "hello from build!"
  test:
    docker: ...
    steps:
      - checkout
      - run echo "hello from test!"
```

Under `jobs`, you specify all your jobs, in an object-like manner.
Each job is referenced by a unique made-up `<name>` you provide.
Each job, MUST CONTAIN the `steps` directive, and the `docker` directive.
The `steps` is basically an array of commands to be executed sequentially.
Notice the docker part!
This is the first thing to sort out, since your code needs to be executed in some OS environment, so, if you think about it , before all the steps you define, there's actually a step-zero, which is to set up and run an image / docker container.

---

## 7. Workflows

A workflow gives you the ability to separate and orchestrate jobs.
You can refer to `workflows` as the similar concepts of "pipelines" or "build stages."
Every config.yml file should have a `workflow` as a root key!
If you do not specify one, a default one would be created for you, which would run only… I think it's the first job inside the `jobs` array. Anyway, never mind, just define it! Period!

```yaml
workflows:
  build_and_test:
    jobs:
     - build
     - test
        requires:
          - build
```

In the example above, you see how the test job is executed after and only after the build job finishes. The second thing you might notice, is the second appearance of the keyword `jobs`. The `jobs` keyword appeared once before as a root level key, where we defined ALL of the project's jobs, and now for a specific workflow, we can take just SOME of those jobs, and re-organize them in any way shape or form we like.
Which brings us to our next topic within workflows, with a direct link to workflows, which is sequential and parallel execution of jobs in a workflow.

- **Sequential & Parallel execution**

The above example presented a sequential execution, and this was all thanks to the directive of `requires`: -`<job-name>`. The folks at circleci are calling it "fan in" & "fan out".
Here's an example I like that shows both sequential and a parallel execution all-in-one:

```
                                            ┌──────────────────────┐
                                            │                      │
                              ┌─────────────┤   Job 1: Build       ├─────────────┐
                              │             │         ✓            │             │
                              │             └──────────────────────┘             │
                              │                                                  │
                              │             ┌──────────────────────┐             │
                              │             │                      │             │
                              ├─────────────┤   Job 2: Test        ├─────────────┤
┌──────────────────────┐      │             │         ✓            │             │       ┌──────────────────────┐
│                      │      │             └──────────────────────┘             │       │                      │
│  Begin               ├──────┤                                                  ├───────┤   Job 5: Deploy      │
│                      │      │             ┌──────────────────────┐             │       │                      │
└──────────────────────┘      │             │                      │             │       └──────────────────────┘
                              ├─────────────┤   Job 3: Lint        ├─────────────┤
                              │             │         ✓            │             │
                              │             └──────────────────────┘             │
                              │                                                  │
                              │             ┌──────────────────────┐             │
                              │             │                      │             │
                              └─────────────┤   Job 4: Security    ├─────────────┘
                                            │         ✓            │
                                            └──────────────────────┘
```

This could be achieved in the config.yml by:

```yaml
workflows:
  build_and_test:
    jobs:
     - job1
     - job2
        requires:
          - job1
     - job3
        requires:
          - job1
     - job4
        requires:
          - job1
     - job5
        requires:
          - job1
     - job6
        requires:
          - job2
          - job3
          - job4
          - job5
```

---

## 8. Working Directory

When defining a job, one of the properties you can give it is a directive called `working_directory`, that basically creates a folder, with a name you provide, a second after the container starts to run, to start running the steps of this particular job.
By default, when a docker container spins up to run a job, circleci creates this path:

```bash
/home/circleci/project
```

By providing a `working_directory`, like so;

```yaml
jobs:
  build:
    working_directory: ~/luckylove_frontend
    docker: ...
    steps:
      - checkout
      - run echo "hello from build!"
```

you could override the default name "project", and have the path be:

```
/home/circleci/luckylove_frontend
```

---

## 9. The RUN command

As we saw earlier, `checkout` is considered as a `step` inside a `job`.
However, most of the steps you'd want to run would be custom commands you'd write:
Like `pnpm install`, `pnpm run lint`, `pnpm run test`, `pnpm run start`, etc.
For that we have the `run` command, which could be considered as a step inside a job:

```yaml
jobs:
  build:
    docker: ...
    steps:
      - checkout
      - run echo "hello from build!"
```

The `run` command can actually split into 2 parts, `name` & `command`:

```yaml
jobs:
  build:
    docker: ...
    steps:
      - checkout
      - run:
          name: "Step 3: Install all project's dependencies"
          command: echo "hello from build!"
```

---

## 10. executors

As you saw in the example above, we had a `build` job, and a `test` job.
Both jobs ran the same docker image of cimg/node:18.8.0.
CircleCI tries its best to remove repetitive code from the configuration file, and hence came the `executors` directive. The `executors` directive is a root key inside the config.yml file, in which you (the developer) would specify a certain image with its tag (i.e. cimg/node:18.8.0) and then later on for every job that requires it, you can simply say:

```yaml
+executors:
  nodejs:
    docker:
      - image: cimg/node:18,8,0

build:
+ executor: nodejs
  working_directory: ~/luckylove_frontend
- docker:
-   - image: cimg/node:18.7.0
test:
+ executor: nodejs
  working_directory: ~/luckylove_frontend
- docker:
-   - image: cimg/node:18.7.0
```

It's is much cleaner that way, and more human-readable.

---

## 11. persist_to_workspace & attach_workspace

CircleCI maintains a workspace for you, with a volume of I think 15GB.
Then it gives you the two directives that actively go together, which are:
`persist_to_workspace` & `attach_workspace`.The first one says: "hey, at the end of this job? I'm gonna save the container's state and make an image out of it for you guys(1) to use".
(1) guys = other jobs
From the docs: persist_to_workspace is a special step used to persist a temporary file to be used by another job in the workflow. persist_to_workspace adopts the storage settings from the storage customization controls on the CircleCI web app. If no custom setting is provided, persist_to_workspace defaults to 15 days.

```yaml
- persist_to_workspace:
    root: /tmp/dir
    paths:
      - foo/bar
      - baz
```

After this step completes, the following directories are added to the workspace:

```
/tmp/dir/foo/bar
/tmp/dir/baz
```

As you see, `persist_to_workspace` gives you access to 2 more directives: `root` & `paths`.
`root` is the root of the workspace circleci maintains for you, and the `path` is the path to copy to the workspace.
Here's a good example for paths key:

```yaml
- persist_to_workspace:
    root: /tmp/workspace
    paths:
      - target/application.jar
      - build/*
```

`persist_to_workspace` even accepts a name:

```yaml
- persist_to_workspace:
    name: "Step 5: persist to workspace"
    root: ...
    paths: ...
```

You could also (NOT RECOMMENDED!) copy everything, including node_modules:

```yaml
- persist_to_workspace:
    root: .
    paths:
      - .
```

And then do:

```yaml
test:
    executor: nodejs
    steps:
      - attach_workspace:
          at: .
```

---

## 12. Manually Approved Job (A hold job)

If your deployment strategy requires a manual approval step, you can include a hold/approve job within your workflow. A manual approval button will then be available from the workflows map in the CircleCI web app.
Workflows can be configured to wait for manual approval of a job before continuing to the next job. Anyone who has push access to the repository can click the Approval button to continue the workflow. To do this, add a job to the jobs list with the key type: approval. Let’s look at a commented config example.

```yaml
# ...
# << your config for the build, test1, test2, and deploy jobs >>
# ...

workflows:
  version: 2
  build-test-and-approval-deploy:
    jobs:
      - build  # your custom job from your config, that builds your code
      - test1: # your custom job; runs test suite 1
          requires: # test1 will not run until the `build` job is completed.
            - build
      - test2: # another custom job; runs test suite 2,
          requires: # test2 is dependent on the success of job `test1`
            - test1
      - hold: # <<< A job that will require manual approval in the CircleCI web application.
          type: approval # <<< This key-value pair will set your workflow to a status of "On Hold"
          requires: # We only run the "hold" job when test2 has succeeded
           - test2
      # On approval of the `hold` job, any successive job that requires the `hold` job will run.
      # In this case, a user is manually triggering the deploy job.
      - deploy:
          requires:
            - hold
```

The outcome of the above example is that the deploy: job will not run until you click the hold job in the Workflows page of the CircleCI app and then click Approve. In this example the purpose of the hold job is to wait for approval to begin deployment. A job can be approved for up to 90 days after being issued.
Some things to keep in mind when using manual approval in a workflow:

- approval is a special job type that is only available to jobs under the workflow key
- The hold job must be a unique name not used by any other job.
- that is, your custom configured jobs, such as build or test1 in the example above wouldn’t be given a type: approval key.
- The name of the job to hold is arbitrary - it could be wait or pause, for example, as long as the job has a type: approval key in it.
- All jobs that are to run after a manually approved job must require: the name of that job. Refer to the deploy: job in the above example.
- Jobs run in the order defined until the workflow processes a job with the type: approval key followed by a job on which it depends.

By clicking on the pending job's name (build, in the screenshot above), an approval dialog box appears requesting that you approve or cancel the holding job. After approving, the rest of the workflow runs as directed.

---

## 13. Storing Artifacts

This document describes how to work with artifacts on CircleCI. Use artifacts to persist data after a job or pipeline has completed. For example, building documents or other assets, or saving test results for further inspection.

**- Artifacts Overview**

Artifacts persist data after a job is completed and may be used for storage of the outputs of your build process. For example, when a Java build/test process finishes, the output of the process is saved as a .jar file. CircleCI can store this file as an artifact, keeping it available after the process has finished.
Here's how to do that:

```yaml
- store_artifacts:
      path: package.json
      destination: my-package.json
- store_artifacts:
      path: public/static/styles
      destination: my-styles
```

---

## 14. Using Contexts

Contexts provide a mechanism for securing and sharing environment variables across projects. The environment variables are defined as name/value pairs and are injected at runtime. This document describes creating and using contexts in CircleCI.
You can create and manage contexts on the Organization Settings page of the CircleCI web app. You must be an organization member to view, create, or edit contexts. After a context has been created, you can use the context key in the workflows section of a project
config.yml file to give any job(s) access to the environment variables associated with the context, as shown in the image below.

Org:

```
Context: my-context
$MY_ENV_VAR = my_value
```

Project:

```yaml
version: 2.1

workflows:
  build:
    jobs:
      - build:
          context:
            - my-context
            - another-context

jobs:
  build:
    docker:
      - image: <image-name>:<version TAG>
    steps: # use env var from Context
      - run: echo $MY_ENV_VAR
```

Job Output:

```bash
echo $MY_ENV_VAR

*******
```

Here's an example from your code:

```yaml
workflows:
  build_and_test:
    jobs:
      - build:
          context: luckylove
      - test:
          requires:
            - build

jobs:
  build:
    executor: nodejs
    working_directory: ~/luckylove_frontend
    steps:
      - checkout
      - run:
          name: "Step 0: check context variables"
          command: echo $TOP_SECRET
```

As you can see, I gave the `build` jobs the context of `luckylove` only at runtime! At the time of defining it, it had no clue what its context is gonna be.

---

## 15. CircleCI CLI

The CircleCI command line interface (CLI) brings CircleCI's advanced and powerful tools to your terminal. The CLI is supported on cloud and server v3.x+ installations.
The CLI requires installation, so if it's not installed for you, head over to google and search "circleci cli", and run the installation guide.

### Command 1: upgrade circleci version

**The command:**

```bash
# windows & linux:
circleci update

# macos
brew upgrade circleci
```

<br/>

### Command 2: setup

**The command:**

```bash
circleci setup
```

**Description:**

This command will create a `.circleci` folder inside your user folder, right next to your .ssh folder, and will contain all the cli configurations there. The set up process will prompt you for configuration settings. If you are using the CLI with CircleCI cloud (which you are), use the default CircleCI host.

<br/>

### Command 3: config validate

**The command:**

```bash
circleci config validate
```

**Description:**

Validates that the circleci config you have is valid. Run this command when inside of your `.circleci/` folder. Using this command, you can avoid pushing additional commits with bad / invalid configuration file. Instead, run a validation for your config file using the CLI locally.

<br/>

### Command 4: config process

**The command:**

```bash
circleci config process
```

**Description:**

Running the following command validates your config, but will also your configuration stripped from comment (at the top), and once again WITH the comment (at the bottom), i.e. in its original form. It's useful if you're using orbs.

<br/>

### Command 5: local execute

**The command:**

```bash
circleci local execute --job JOB_NAME
```

:::warning
As of 2022, circleci doesn't support running on Windows
:::

**Description:**

The CLI allows you to run a single job from CircleCI on your desktop using Docker. This can only be used to run jobs (not workflows!). The CLI will use Docker to pull down the requirements for the build and then execute your CI steps locally.

Limitations of running jobs locally:

Although running jobs locally with circleci is very helpful, there are some limitations.

- Machine executor: We haven't covered this, but basically there's a section on circleci called "Execution Environments", where they tell you that you can execute circleci either inside docker containers (which is what I chose), or you can do so by using a Linux VM. To use docker, we specified the key `docker` under the name of a job. To use a Linux VM, we need to specify the key `machine` under the name of a job. So now let's go back to the restriction: "With a linux machine You cannot use the machine executor in local jobs. This is because the machine executor requires an extra VM to run its jobs".
- Add SSH keys: It is currently not possible to add SSH keys using the add_ssh_keys CLI command.
- Workflows: The CLI tool does not provide support for running workflows. By nature, workflows leverage running jobs concurrently on multiple machines allowing you to achieve faster, more complex builds. Because the CLI is only running on your machine, it can only run single jobs (which make up parts of a workflow).
- Caching and online-only Commands: Caching is not currently supported in local jobs. When you have either a save_cache or restore_cache step in your config, circleci will skip them and display a warning. Furthermore, not all commands may work on your local machine as they do online. If a step is not available on a local build you will see an error in the console. For example, running a store_artifacts step locally will not upload artifacts and throw an error.
- Environment variables: For security reasons, encrypted environment variables configured in the web application will not be imported into local builds. As an alternative, you can specify environment variables to the CLI with the -e flag. See the output of the following command for more information: `circleci help build`. If you have multiple environment variables, you must use the flag for each variable, for example: `circleci build -e VAR1=FOO -e VAR2=BAR`.

<br/>

### Command 6: context management

- `create`: Create a new context
- `delete`: Delete the named context
- `list`: List all contexts
- `remove-secret`: Remove an environment variable from the named context
- `show`: Show a context with all its keys (values will be redacted!)
- `store-secret`: Store a new environment variable in the named context

The above list include "sub-commands" in the CLI, which would be executed like so:

```bash
// Examples:
circleci context create github OrgName contextName
circleci context create contextName --org-id "your-org-id-here"

// Command 2: list all contexts
circleci context list <vcs-type> <org-name> [flags]
// Examples:
circleci context list bitbucket talkohavy --token 6802

// Command 3: show context
circleci context show bitbucket talkohavy luckylove --token 6802

// Command 4: store a new secret inside a context
circleci context store-secret <vcs-type> <org-name> <context-name> <secret name> [flags]
// By hitting Enter, you'll be prompted with:
Enter secret value and press enter:

// Command 5: Remove secret from context
circleci context remove-secret <vcs-type> <org-name> <context-name> <secret name> [flags]
```

**The command:**

```bash
circleci context create
```

**Description:**

A

<br/>

---

## 16. Skip Following Steps Inside A Job

You can skip the following steps inside a job by using the command:

```bash
circleci-agent step halt
```

inside of an early step of a job.
It's best to wrap that command inside of a wrapper bash/sh file with extra logic of ifs and elses, and then execute that file from within the config.yml as one of the job's steps.

• Usage Example:

```yaml
steps:
  - run:
      name: "Step 1: skip the following steps"
      command: circleci-agent step halt
```

Or a more complex one:

```yaml
steps:
  - run:
      name: "should skip 2e2e"
      command: |
        commit_message=$(git log -1 HEAD --pretty=format:%s)
        echo $commit_message
        if [[ $commit_message == *"skip-2e2e"* ]]; then
          circleci-agent step halt
        fi
```

• Question: "Why not use exit 0 or exit 1?"

Good question! That's because "exit 1" would flag the step inside that job as "errored", and terminology-wise, that not the case. And with "exit 0" only halts the following lines inside a step from being executed, while the following step would be executed just fine. Also note, that "exit1" not only fails the step! It fails the job, and it fails the workflow (as it should!).

---

## 16. Manually Cancel a Workflow

You can manually cancel a workflow in a way that would present so in the circleci UI.

This could be done by sending a `cancel` command via a curl request of the following form:

```bash
curl --request POST --url https://circleci.com/api/v2/workflow/$CIRCLE_WORKFLOW_ID/cancel --header "Circle-Token: ${MY_CIRCLE_TOKEN}"
```

Notice the use of `$CIRCLE_WORKFLOW_ID`, which is a built-in env variable that circleci injects (among other env vars), which helps us identify the workflow in progress, as well as providing means for authentication (our API token).

```yaml
build:
  steps:
    - run:
        name: "Step 0.25: cancel the entire workflow"
        command: 'curl -X POST --url https://circleci.com/api/v2/workflow/$CIRCLE_WORKFLOW_ID/cancel -- "Circle-Token: ${MY_CIRCLE_TOKEN}"'
circleci-agent step halt
```

A few things to notice here:

- We are using a token, created in the UI, under the "User Settings" menu, under "Person API Tokens".
- We then copied the contents of said token, and created a context variable down at the UI, under the "Organization Settings" menu.
- In order for the "build" job to recognize the token sitting inside the context, we gave it access to the context within the workflow.
- Canceling a workflow does not mean that the current job is going to halt, rather than continue to completion. That's why the command to `cancel a workflow` and the command to `halt a job` usually go together! That's why I always put them together. But if you find a reason to cancel a workflow, yet to run a job to its completion, then simply remove the `halt a job` command.

---

## 17. Caching

I just learned that you can use: `{{ .Branch }}` inside the `config.yml` to print out the current branch name that you are on. This is a circleci built-in env variable.

### • Saving Cache

To save a cache of a file or directory, add the save_cache step to a job in your .circleci/config.yml file:

```yaml
steps:
  - save_cache:
      key: my-cache
      paths:
        - my-file.txt
        - my-project/my-dependencies-directory
```

The path for directories is relative to the `working_directory` of your job. You can specify an absolute path if you choose.

### • Restoring Cache

CircleCI restores caches in the order of keys listed in the restore_cache step. Each cache key is namespaced to the project and retrieval is prefix-matched. The cache is restored from the first matching key. If there are multiple matches, the most recently generated cache is used.

In the example below, two keys are provided

```yaml
steps:
  - restore_cache:
      # name: Restore NPM Package Cache # <optional key>
      keys:
# Find a cache corresponding to this specific package-lock.json checksum
# when this file is changed, this key will fail
        - v1-npm-deps-{{ checksum "package-lock.json" }}
        # Find the most recently generated cache used from any branch
        - v1-npm-deps-
```

Because the second key is less specific than the first, it is more likely there will be differences between the current state and the most recently generated cache. When a dependency tool runs, it would discover outdated dependencies and update them. This is referred to as a partial cache restore.

Each line in the keys: list manages one cache (each line does not correspond to its own cache). The list of keys (`v1-npm-deps-{{ checksum "package-lock.json" }}` and `v1-npm-deps-`), in this example, represent a single cache. When it is time to restore the cache, CircleCI first validates the cache based on the first (and most specific) key, and then steps through the other keys looking for any other cache key changes.

The first key concatenates the checksum of package-lock.json file into the string `v1-npm-deps-`. If this file changed in your commit, CircleCI would see a new cache key.

The next key does not have a dynamic component to it. It is simply a static string: `v1-npm-deps-`. If you would like to invalidate your cache manually, you can bump v1 to v2 in your .circleci/config.yml file. In this case, you would now have a new cache key v2-npm-deps, which triggers the storing of a new cache.

A full example:

```yaml
#...
      - restore_cache:
          name: Restore NPM Package Cache
          keys:
            - npm-packages-{{ checksum "package-lock.lock" }}
      - run:
          name: Install Dependencies
          command: npm install
      - save_cache:
          name: Save Npm Package Cache
          key: yarn-packages-{{ checksum "package-lock.lock" }}
          paths:
            - .npm/cache
            - .npm/unplugged
#...
```

Or...

```yaml
restore_cache_and_install:
    steps:
    - run:
        name: "Step 1: enable corepack"
        command: sudo corepack enable
    - restore_cache:
        name: Restore pnpm cache folders
        keys:
          - node-v2-{{ .Branch }}-{{ checksum "pnpm-lock.yaml" }}
          - node-v2-{{ .Branch }}-
          - node-v2-main-
    - run:
        name: "Step 2: Remove prepare script"
        command: npm pkg delete scripts.prepare
    - run:
        name: "Step 3: Install project dependencies"
        command: pnpm install --shamefully-hoist

  save_cache_node_modules:
    steps:
    - save_cache:
          name: "Step X: save cache folders"
          key: node-v2-{{ .Branch }}-{{ checksum "pnpm-lock.yaml" }}
          paths:
            - ./node_modules
            - ./projects/e2e/node_modules
            - ./packages/api-server/node_modules
```

---

## 18. Multi-Line Run Command

Each `run` declaration represents a new shell. It is possible to specify a multi-line command, each line of which will be run in the same shell:

```yaml
- run:
    command: |
      echo Running test
      mkdir -p /tmp/test-results
      make test
```

---

## 19. The When Attribute

By default, CircleCI will execute job steps one at a time, in the order that they are defined in config.yml, until a step fails (returns a non-zero exit code). After a command fails, no further job steps will be executed.

Adding the when attribute to a job step allows you to override this default behavior, and selectively run or skip steps depending on the status of the job.

### • Value 1: on_success

The default value of on_success means that the step will run only if all of the previous steps have been successful (returned exit code 0).

### • Value 2: always

A value of always means that the step will run regardless of the exit status of previous steps. This is useful if you have a task that you want to run regardless of whether the previous steps are successful or not. For example, you might have a job step that needs to upload logs or code-coverage data somewhere.

### • Value 3: on_fail

A value of on_fail means that the step will run only if one of the preceding steps has failed (returns a non-zero exit code). It is common to use on_fail if you want to store some diagnostic data to help debug test failures, or to run custom notifications about the failure, such as sending emails or triggering alerts in chat-rooms.

### • Specials: on_store_artifacts & store_test_results

Note: Some steps, such as store_artifacts and store_test_results will always run, even if a step has failed (returned a non-zero exit code) previously. The when attribute, store_artifacts and store_test_results are not run if the job has been killed by a cancel request or has reached the runtime timeout limit.

## 20. The When Step

Entirely different thing from the when attribute!!

Look at the structure:

```yaml
version: 2.1

jobs: # conditional steps may also be defined in `commands:`
  job_with_optional_custom_checkout:
    parameters:
      custom_checkout:
        type: string
        default: ""
    machine:
      image: ubuntu-2004:202107-02
    steps:
      - when:
          condition: <<parameters.custom_checkout>>
          steps:
            - run: echo "my custom checkout"
      - unless:
          condition: <<parameters.custom_checkout>>
          steps:
            - checkout
workflows:
  build-test-deploy:
    jobs:
      - job_with_optional_custom_checkout:
          custom_checkout: "any non-empty string is truthy"
      - job_with_optional_custom_checkout
```

The `when` step is a conditional step which consists of a step with the key `when` or `unless`. Under the `when` key are the (required!) sub-keys `condition` and `steps`. The purpose of the when step is customizing commands and job configuration to run on custom conditions (determined at config-compile time) that are checked before a workflow runs.
