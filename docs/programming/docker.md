---
sidebar_label: '9. Docker'
sidebar_position: 7
---

# Guide For Docker

## 1. Overall Project Workflow Process

### - 1.1. Have a project ready

The first step would be to have a project ready to be deployed to production.

### - 1.2. Create a Dockerfile

Then, you would need to create a **Dockerfile** for that project.  
The **Dockerfile** instructs `docker` how to build the image.  
The image that's going be built, would then turn into a "virtual machine" (a container), with a certain folder structure.  
Within the **Dockerfile** we instruct docker where to copy and what to copy to our _to-be-created_ virtual machine.  
The creation of the **Dockerfile** is a one-time thing. Once you have one, it should n't change often, or even at all.

### - 1.3. build the image with docker-compose/docker build

Any time the contents of your project changes, you need to build an image.
Whether you do it with `docker-compose` or with `docker build` doesn't quite matter for your specific use-case, and here's why; Let's examine the differences between them.

**The main differences between them are:**

- `docker build` can only build a _single_ image, while `docker-compose build` can build _multiple_ images.

- `docker build` requires a **Dockerfile**, while `docker-compose build` requires both a **Dockerfile** and a **docker-compose.yaml** file.

- `docker build` is more flexible, as you can use it to build any type of image, while `docker-compose build` is designed for building multi-container applications.

- `docker-compose build` is easier to use, as it takes care of all the details of building and running multiple containers.

**The benefits of using `docker-compose` include:**

- **Ease of use**: `docker-compose` makes it easy to build and run multi-container applications. You can define all the services in your application in a single
  docker-compose.yaml file, and then use the `docker-compose up` command to start them all up.

- **Flexibility**: `docker-compose` is flexible enough to be used with a variety of different applications. You can use it to build simple applications with a few
  containers, or complex applications with dozens or even hundreds of containers.

- **Scalability**: `docker-compose` makes it easy to scale your applications. You can start with a small number of containers, and then scale up your application by
  adding more containers as needed.

### - 1.4. Uploading the image to a registry

** complete this part... **

### - 1.5. Download and Run the image

After having a ready image, you'll want to have it running, right?  
In production, you'll probably use **kubernetes** as an orchestrating mechanism to running all the images together in a contained environment called a **cluster**.  
In development, you might also want to use **kubernetes** as well, but it's more likely that you'd want to run a single image, and make sure it works properly as a standalone.  
`docker run` is for running a single image, for creating a single running container from that image, making sure it runs ok, connecting to it, run commands on it, etc.  
While you mostly be using `docker run` for debugging purposes, know that `kubernetes` also offers its own way of debugging. `Kubernetes` allows you to debug any container living inside of a cluster.  
Well, technically, it's a way of debugging a container living inside of a pod, living inside of a deployment, living inside of a node, living inside of a cluster, but you get the idea.  
The only time in which `docker run` is the better solution, is when you _couldn't_ get your deployment to initialize correctly, so there aren't any running pods to check.  
Using `kubectl apply` on a kubernetes configuration yaml file, you could start/orchestrate several deployments.

**Using kubernetes**

```bash
kubectl apply -f config
```

**Using docker**

```bash
docker run ...
```

---

## 2. Daily Use Workflow Process

### • A: List all docker images on your machine

```bash
docker images
```

### • B: Delete an image

```bash
IMAGE_ID=
docker image rm ${IMAGE_ID} -f
```

### • C: List all containers

```bash
docker ps -a
```

### • D: Delete a container

```bash
CONTAINER_ID=
docker container rm ${CONTAINER_ID}
```

### • E: Run an image/container locally

```bash
docker run -it --rm node sh
```

### • F: How do I debug a running container?

Watching a running container's log just might be enough:

```bash
docker logs <name-or-image-id>
```

But if it's not, and you need to tap into an already running container, docker allows you access in a manner similar to SSH, using `docker exec` command which was made for this purpose exactly.

```bash
docker exec -it <container_name_or_id> bash
```

### • G: How do I expose a container to my localhost? (Port mapping)

```bash
docker run redis -p 5678:5678
```

---

## 3. Docker Commands

<font size={6}>Table of contents</font>

- [• Command 1: docker system prune](#-command-1-docker-system-prune)
- [• Command 2: docker pull](#-command-2-docker-pull)
- [• Command 3: docker build](#-command-3-docker-build)
- [• Command 4: docker create](#-command-4-docker-create)
- [• Command 5: docker run](#-command-5-docker-run)
- [• Command 6: docker start / restart](#-command-6-docker-start--restart)
- [• Command 7: docker stop / kill](#-command-7-docker-stop--kill)
- [• Command 8: docker images](#-command-8-docker-images)
- [• Command 9: docker ps](#-command-9-docker-ps)
- [• Command 10: docker container rm](#-command-10-docker-container-rm)
- [• Command 11: docker image rm](#-command-11-docker-image-rm)
- [• Command 12: docker logs](#-command-12-docker-logs)
- [• Command 13: exec - debugging](#-command-13-exec---debugging)

<br/>

### • Command 1: docker system prune

```bash
docker pull [OPTIONS] NAME[:TAG|@DIGEST]
```

**Description:**

Remove all unused containers, networks, images (both _dangling_ and _unreferenced_), and optionally, volumes.

<br/>

### • Command 2: docker pull

```bash
docker pull [OPTIONS] <image-name>[:TAG|@DIGEST]
```

Download an image from a registry.

If no tag is provided after the image-name, Docker Engine uses the :latest tag as a default.

By default, `docker pull` tries to pull an image from the website `hub.docker.com`, also known as **Docker Hub** - the biggest docker image registry out there. All the images you'll ever create are a 100% images which were built on top of a _base image_ pulled from **Docker Hub** registry. Docker Hub contains many pre-built images that you can pull and try without needing to define and configure your own.

**Pull from a different registry**

By default, docker pull pulls images from **Docker Hub**.  
It is also possible to manually specify the path of a registry to pull from. For example, if you have set up a local registry, you can specify its path to pull from it. A registry path is similar to a URL, but does not contain a protocol specifier (https://).

The following command pulls the `testing/test-image` image from a local registry listening on port 5000 (myregistry.local:5000):

```bash
docker image pull myregistry.local:5000/testing/test-image
```

**Concurrent downloads:**

By default the Docker daemon will pull three layers of an image at a time. If you are on a low bandwidth connection this may cause timeout issues and you may want to lower this via the `--max-concurrent-downloads` flag.

<br/>

### • Command 3: docker build

```bash
docker build .
```

**Description:**

A command to tell docker to build an image from a **_Dockerfile_**.

:::info
Usually, you will not be using this command of `docker build`, since you'll be using it's brother `docker-compose build`.
:::

By default, the `docker build` command will look for a **Dockerfile** at the directory at which the command was executed. The "." notatio is telling docker where to look for a **Dockerfile**. `docker build` requires at least 1 flag, or just a PATH (i.e. "."), in order to be used.  
Note that in the **Dockerfile** there must be a **FROM** instruction which tells docker what is the _base image_ to be used. By default, docker will try to first pull the image from your local cache, and if not found there, it'll look for it on a remote registry.

**Commonly used flags:**

- **Flag 1: -t**  
  You can use the `-t` flag to name, and optionally tag, an image. The most commonly used format is: "name:tag".

- **Flag 2: -f**  
  By default, `docker build` looks for a file named exactly as **Dockerfile** in the directory where the command was executed. You can override this behavior and use the `-f` flag (or `--file`) followed by a PATH to a custom named **Dockerfile** found on a potentially different path.

- **Flag 3: --no-cache**  
  By default, `docker build` uses cache, and sometimes, you may encounter some weird issues caused due to it. The `--no-cache` flag prevents caching when building the image.

- **Flag 4: --pull | --pull=never**  
  By default, `docker build` first looks up your local cache of image registry, and if it can't find an image there, it goes looking for it in a remote registry.  
  With the `--pull` flag set on, `docker build` will **always** attempt to pull a newer version of the image found on the remote, and ignore what's on your local registry.  
  With the `--pull=never` flag set on, `docker build` will **never** attempt pulling from a remote registry, and so if an image was not found locally, it would throw an error.

<br/>

### • Command 4: docker create

```bash
docker create [OPTIONS] IMAGE [COMMAND] [ARG...]
```

**Description:**

The `docker create` command creates a new container from the specified image, without starting it.

When creating a container, the docker daemon creates a writeable container layer over the specified image and prepares it for running the specified command. The container ID is then printed to STDOUT. This is similar to `docker run -d` command, except the container is never started. You can then use the `docker start` command to start the container at any point.

This is useful when you want to set up a container configuration ahead of time so that it is ready to start when you need it. The initial status of the new container is `created`.

<br/>

### • Command 5: docker run

```bash
docker run [OPTIONS] IMAGE[:TAG|@DIGEST] [COMMAND] [ARG...]
```

**Description:**

Run a process in an isolated container.

:::info
_Usually, you will not be `docker run`, since you'll be using kubernetes to orchestrate your containers._
:::

Conceptually speaking, the `docker run` command is actually made up of 3 separate commands running sequentially:

- `docker pull` is used to pulling an image from a remote registry.
- `docker create` is used to create a container out of an image.
- `docker start` is used to start running an existing container.

The `docker run` command **MUST** specify an IMAGE to derive the container from.  
The `docker run` command has the ability to override any of the rules set up within the configuration file, which is why it has the most flags, more option flags than any other docker command.

:::tip
NOTE: To avoid having to use sudo with the docker command, your system administrator can create a Unix group called `docker` and add users to it.
Add this command to your `Dockerfile`:

```dockerfile
RUN addgroup app && adduser -S -G app app
```

:::

**Commonly used flags:**

- **A sub-command: %alternative-startup-command%**  
  Right after the `docker run` command you can specify an alternative startup command to execute, one that would override the startup command listed in the Dockerfile under the CMD key. Here's an example for how CMD looks like in a Dockerfile:

  ```dockerfile
  CMD [ "pnpm", "run", "start-users" ]
  ```

  When using an alternative run, the command listed under CMD would be rendered null, and your command would run instead.  
  Example:

  ```bash
  docker run redis echo hello world
  ```

- **Flag 1: -d**  
  Run in detached mode. Meaning, it would not occupy a terminal, keeping it busy, and printing logs onto it. The container would run in the background.  
  Example:

  ```bash
  docker run -d redis
  ```

- **Flag 2: --name**  
  **Recommended!** Defining a name can be a handy way to add meaning to a container. Let's make an important distinction right now. When using `docker run` you give the _name of the image to run_. The `--name` flag is for giving a _name to the outcome running container_ a name, so that later you could identify that running container.
  Example:

  ```bash
  docker run <my-image-name> --name <my-container-name>
  ```

- **Flag 3: [:tag]**  
  You can specify a version of an image you'd like to run the container with by adding image[:tag] to the command.  
  Example:

  ```bash
  docker run ubuntu:14.04
  ```

  By NOT specifying a tag, the command always tries to pull, build, and run the "latest" version of the image.

- **Flag 4: --rm**  
  By default a container's file system persists even after the container exits. This makes debugging a lot easier (since you can inspect the final state) and you retain all your data by default. But if you are running short-term foreground processes, these container file systems can really pile up. If instead you'd like **docker** to automatically clean up the container and remove the file system when the container exits, you can add the `--rm` flag.  
  Example:

  ```bash
  docker run --rm <image-name>
  ```

- **Flag 5: -it**  
  For interactive processes (like a shell), you must use `-i` `-t` together in order to allocate a tty for the container process. `-i` `-t` is often written `-it` as you'll see in later examples. Specifying `-t` is forbidden when the client is receiving its standard input from a pipe, as in `echo test | docker run -i busybox cat`.

  Example:

  ```bash
  docker run -it users-service
  ```

- **Flag 6: -p**  
  To expose a _port_ within the container to a port on your localhost.  
  Example:
  ```bash
  docker run redis -p 5678:5678
  ```
- **Flag 7: --pull | --pull=never**  
  With the `--pull` flag set on, `docker run` will **always** attempt to pull a newer version of the image found on the remote, and ignore what's on your image-cache (local registry).  
  With the `--pull=never` flag set on, `docker build` will **never** attempt pulling from a remote registry, and so if an image was not found locally, it would throw an error.  
  Example:
  ```bash
  docker run redis --pull=never
  ```

<br/>

### • Command 6: docker start / restart

Start a single stopped existing container:

```bash
docker start <container-name-or-id>
```

Restart a single running/stopped existing container:

```bash
docker restart <container-name-or-id>
```

**Description:**

The `docker start` command is meant for starting an existing stopped container.  
The `docker restart` command is meant for restarting _an existing already running container_ OR _an existing yet stopped container_.

<br/>

### • Command 7: docker stop / kill

Stop a single running container:

```bash
docker stop <container-name-or-id>
```

Stop 2+ running containers:

```bash
docker stop <container-name-or-id1> <container-name-or-id2>
```

Stop ALL running containers:

```bash
docker stop $(docker ps -a -q)
```

Kill a single running container:

```bash
docker kill <container-name-or-id>
```

**Description:**

Meant for stopping an existing, currently running, container.

The `docker stop` command sends a `SIGTERM`, which is short for terminate signal, to the primary process inside our container. `SIGTERM` gives the running process some grace time to do its thing so it would be able to shut down gracefully, perhaps do some cleans ups, save some files, emit some messages, etc. After that grace period of time, `docker stop` sends a `SIGKILL`.

On the other hand...

The `docker kill` command is also meant for an existing, currently running, container, however it sends a `SIGKILL`, which is short for `kill` signal, to the primary process inside our container. `SIGKILL` essentially means _"You have to shut down RIGHT NOW!_ And you _DO NOT_ get to do any additional work!".  
Ideally, we always stop a container using the `docker stop` command.

<br/>

### • Command 8: docker images

```bash
docker images
```

**Description:**

Lists all images found locally in you image-cache registry.

:::info
If you want to list out all _running containers_ (not images), see `docker ps` command.
:::

An image will be listed more than once if it has multiple _repository names_ or _tags_.

**Commonly used flags & options:**

- **option 1: image-name**  
  You can list images by their **name**, mentioned under the `REPOSITORY` column. The returned result would include images who's name is an _exact match_ to the name provided.  
  Example:

  ```bash
  docker images redis
  ```

  In the above example, if two images exist with names "redis" & "redis-server", only "redis" would return as a result.

- **Flag 1: --filter "before=image1" "since=image1"**  
  The `before` filter is telling docker to show only images created _before_ the image with given id or reference. `since` does the exact opposite.  
  Example:
  ```bash
  docker images redis --filter "before=<image-id>"
  ```

<br/>

### • Command 9: docker ps

```bash
docker ps
```

**Description:**

Lists out containers on your machine.

By default, it lists out _running containers only_.

**Commonly used options:**

- **Flag 1: -a | --all**  
  You can add the `-a` flag to list all containers, and not just the running containers.

  ```bash
  docker ps -a
  ```

- **Flag 2: -f | --filter**  
  Examples:  
  filter using `status`:

  ```bash
  docker ps --filter "status=exited" --filter "status=dead"
  ```

  Possible `status`'es are: created | restarting | running | removing | paused | exited | dead.

  filter using `name`:

  ```bash
  docker ps --filter "name=some-name"
  ```

  filter using `label`:

  ```bash
  docker ps --filter "label=some-label"
  ```

<br/>

### • Command 10: docker container rm

Delete a SINGLE container: (or two)

```bash
docker container rm %cntnr-name1/id1% %cntnr-name1/id2%
```

Delete ALL containers:

```bash
docker container rm -f $(docker ps -aq)
```

**Description:**

Delete a _stopped_ container.

If you try to delete a running container, you'll get an error saying you can't delete a running container. So you have 2 options in this scenario. Either stop the container first, and then delete it, or just add a `-f` (force) flag to your delete command.  
The `$(docker ps -aq)` part lists out the ids of all the containers, both _running_ and _not running_.

<br/>

### • Command 11: docker image rm

Delete a SINGLE image:

```bash
TAG_ID=
docker image rm ${TAG_ID} -f
```

Delete a 2+ images:

```bash
docker image rm <name/id-of-image1> <name/id-of-image2> ...
```

Delete ALL images:

```bash
docker image rm -f $(docker image ls -q)
```

**Description:**

Delete an image.

If you try to delete an image, which currently has a container made from it that exists (either running or not running), you'll get an error. In this scenario you have 2 options: You can stop the running container, delete the container, and then delete the image, or you can simply add a `-f` (force) flag to the delete command. This `force` flag will first stop the running container, delete it, and then delete the image.  
The `$(docker image ls -q)` part lists out the ids of all images on your machine.

<br/>

### • Command 12: docker logs

```bash
docker logs <name-or-image-id>
```

**Description:**

Shows the logs of a _running_ container.

**Commonly used options:**

- **Flag 1: -n | --tail**  
  Number of lines to show from the end of the logs.

  ```bash
  docker logs --tail 50
  ```

- **Flag 2: -f | --follow**  
  Follow log output.

  ```bash
  docker logs --tail 50 --follow
  ```

- **Flag 3: --since & --until**  
  Show logs since and/or until timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes).

  ```bash
  docker logs -f --until=2s test
  ```

<br/>

### • Command 13: exec - debugging

General form:

```bash
TAG_NAME=
docker exec -it ${CONTAINER_ID} %COMMAND%
```

Most commonly used with `sh`:

```bash
docker exec -it ${TAG_NAME} sh
```

**Description:**

We can use the `exec` command to execute an additional command inside of a running container.

The two most important flags of docker are: `-i` `-t`.  
You might see them in the combined form of: `-it`.  
When we do `docker exec -it` , the `-i` flag means: when we execute this new command inside the container, we want to attach our terminal to the std-in channel of that new running process we execute. So by adding on the `-i` flag we're saying "make sure that any stuff that I type in gets directed to std-in of redis-cli".  
The `-t` flag is what kinda makes all this text show up a little bit pretty.  
Alright well... in reality it's doing a little bit more than that, but at the end of the day the real effect of the dash t is flag is to make sure that all the text that you are entering in and that is coming out shows up in a nicely formatted manner on your screen.  
So we've learned about the importance of the -it flags.  
Now let's talk about another use of the `docker exec -it` command, which is probably going to be the most common one you'll be using on your own personal projects. A very common thing you'll want to do when using docker is to get shell access or terminal access to your running container. In other words, you're going to want to run commands inside of your container without having to re-run `docker exec` again and again all day.  
The next command is how you can open up a shell in the context of your running container.

This is what you need:

```bash
docker run --rm -it ${TAG_NAME} sh
```

**What does `sh` mean?**

bash, powershell, zsh, and sh are all **command processors**.  
`sh` is the name of a program, and it is a program that's being executed inside of that container. `sh` is a command processor or a shell. It's something that allows us to type commands in and have them be executed inside that container. You are already making use of a program very much like `sh` on your own computer Traditionally, a LOT of different containers you're going to be working with are probably going to have the `sh` program already included. Some more complete versions of containers or images are going to also have the bash command processor as well. So in some cases you can make use of bash directly, and in the vast majority you're probably going to use the sh to start up a command prompt and start typing in commands.

<br/>

---

## 4. How to create a Dockerfile

A **Dockerfile** is a text document needed for the `docker build` process.  
A **Dockerfile** contains all the instructions a user could call on the command line to assemble an image. A **Dockerfile** must begin with a `FROM` instruction.

When you call the command `docker build` (or `docker-compose build`), docker builds your image by reading the instructions from a target **Dockerfile**. Docker then runs the instructions inside it in a sequential order.

Here is a basic **Dockerfile** you can copy:

```dockerfile
FROM node

CMD ["echo", "hello world"]
```

**<font size="5" Dockerfile Instructions/>**

### • Instruction 1: FROM

```dockerfile
FROM node:19-alpine3.16
```

**Description:**

The `FROM` instruction initializes a new build stage and sets the base image for subsequent instructions.

A **Dockerfile** must begin with a `FROM` instruction. `FROM` may appear after globally scoped `ARG`'s, comments, or parser directives. The `FROM` instruction specifies the parent image.

### • Instruction 2: ARG

```dockerfile
ARG %name%[=%default value%]
ARG CODE_VERSION=latest
```

**Description:**

The **ARG** instruction defines a variable that users can pass at build-time to the builder with the `docker build` command using the `--build-arg` flag.

```bash
docker build --build-arg <var-name>=<value>
```

:::warning
If a user specifies a build argument that was not defined in the Dockerfile, the build outputs a warning.

```sh
[Warning] One or more build-args [foo] were not consumed.
LOOK OUT!!!
It is not recommended to use build-time variables for passing secrets like GitHub keys, user credentials etc. Build-time variable values are visible to any user of the image with the docker history command.
Refer to the RUN --mount=type=secret section to learn about secure ways to use secrets when building images.
```

:::

**Setting a default values to an ARG**

Typically, an **ARG**'s value is set from out side, and the value is used inside like so:

```dockerfile
FROM busybox
ARG user1
ARG buildNumber
```

You can a _default value_ to and ARG, in case an outside value wasn't provided:

```dockerfile
FROM busybox
ARG user1=some-user
ARG buildNumber=1
```

If an **ARG** instruction has a _default value_, and if there is no value passed at build-time, the builder uses the default value you set.

**Understanding how ARG and FROM interact:**

**FROM** instructions support variables that are declared by any **ARG** instructions that occur before the first **FROM**.
An **ARG** declared before a **FROM** is outside of a build stage, so it can't be used in any instruction after a **FROM**. To use the _default value_ of an **ARG** declared before the first **FROM** use an **ARG** instruction without a value inside of a build stage.

Example:

```dockerfile
ARG VERSION=latest
FROM busybox:$VERSION
ARG VERSION
RUN echo $VERSION > image_version
```

### • Instruction 3: WORKDIR

```dockerfile
WORKDIR /my-workspace
```

**Description**

If not specified, the default working directory is `/`.  
The root folder of the running container contains these folders:  
`bin`, `dev`, `etc`, `tmp`, `var`, `lib`, `mnt`, `srv`, `usr` and more.  
It is somewhat likely in our project we'd have a folder with the same name, that would override some of the files and folders listed above.  
In order to avoid that,  
We use the COPY command, but in the target path (the second argument), we might wanna mention a nested directory, like so:

```dockerfile
COPY ./ ./my-workspace/
```

Instead of doing the above, we can use the **WORKDIR** instruction.
The **WORKDIR** instruction sets the working directory on the container for any COPY, ADD, RUN, CMD, and ENTRYPOINT instructions that follow it in the **Dockerfile**. And so now you can simply do:

```dockerfile
WORKDIR /my-workspace
COPY ./ ./
```

Without worrying about overriding folders which already exists in the root of the container.

**Some basic Rules about WORKDIR:**

- The **WORKDIR** instruction sets the working directory on the container for any **COPY**, **ADD**, **RUN**, **CMD**, and **ENTRYPOINT** instructions that follow it in the **Dockerfile**.

- If the **WORKDIR** doesn't exist, it will be created, even if it isn't used in any of the subsequent Dockerfile instructions.

- The **WORKDIR** instruction can be used multiple times in a Dockerfile. If a relative path is provided, it will be relative to the path of the previous **WORKDIR** instruction.  
  Example:

  ```dockerfile
  WORKDIR /a
  WORKDIR b
  WORKDIR c
  RUN pwd
  ```

  The output of the final pwd command in this **Dockerfile** would be /a/b/c.

- The WORKDIR instruction can resolve environment variables previously set using ENV. You can only use environment variables explicitly set in the Dockerfile.
  Example:

  ```dockerfile
  ENV DIRPATH=/path
  WORKDIR $DIRPATH/$DIRNAME
  RUN pwd
  ```

  The output of the final pwd command in this Dockerfile would be /path/$DIRNAME

### • Instruction 4: COPY

```dockerfile
COPY ../package.json ./package.json
```

**Description:**

The first argument is the path to your local file system, and the second argument is the path that you want to copy stuff to inside the container.
When using a relative path in the first argument, it is relative to the build's `context`.  
For instance:

```bash
lukcylove-monorepo: docker build .
```

Running the above command, the context would be "luckylove-monorepo".
The `context` can also be defined within the docker-compose file, and then you can run:

```bash
lukcylove-monorepo: docker-compose build
```

And the context would be taken from there.

### • Instruction 5: RUN

```dockerfile
RUN [ "pnpm", "run", "start" ]
```

**Description:**

The **RUN** instruction will execute any commands in a new layer on top of the current image and commit the results. The resulting committed image will be used for the next step in the Dockerfile.  
Layering **RUN** instructions and generating commits conforms to the core concepts of Docker where commits are cheap and containers can be created from any point in an image's history, much like source control.

**Differences between the shell for and the exec form**

**RUN** has 2 forms:
The shell form: `RUN %command%` (shell form, the command is run in a shell, which by default is /bin/sh -c on Linux or cmd /S /C on Windows)

The exec form: **RUN** ["executable", "param1", "param2"] (exec form)

**Some key notes:**

- The `exec` form is preferred, since it makes it possible to avoid shell string munging, and to RUN commands using a base image that does not contain the specified shell executable.

- The `exec` form is parsed as a JSON array, which means that you must use double-quotes (") around words not single-quotes (').

- The default shell for the shell form can be changed using the SHELL command.

- Unlike the shell form, the exec form does not invoke a command shell. This means that normal shell processing does not happen.  
  Take this piece of code for example:

```dockerfile
CMD [ "echo", "$HOME" ]
```

The above code will not do variable substitution on `$HOME`. If you want shell processing then either use the shell form or execute a shell directly, for example:

```dockerfile
CMD [ "sh", "-c", "echo $HOME" ]
```

When using the `exec` form and executing a shell directly, as in the case for the shell form, it is the shell that is doing the environment variable expansion, not docker.

- In the shell form you can use a backslash `\` to continue a single RUN instruction onto the next line.

- Using the shell form for **ENTRYPOINT** likely means you're not propagating signals correctly to your app, which can cause problems, in particular in Kubernetes clusters. You can read more about it here in the article named "Why Your Dockerized Application Isn't Receiving Signals." Link --> https://hynek.me/articles/docker-signals/

### • Instruction 6: ENTRYPOINT

```dockerfile
ENTRYPOINT
```

### • Instruction 7: CMD

````dockerfile
CMD [ "pnpm", "run", "start" ]
```dockerfile
````

### • Instruction 8: EXPOSE

```dockerfile
EXPOSE 3000
```

**Description:**

The **EXPOSE** instruction informs Docker that the container listens on the specified network ports at runtime.

:::warning
The **EXPOSE** instruction _DOES NOT_ actually publish the port!

It merely functions as a type of documentation between the person who builds the image, and the person who runs the container, about which ports are intended to be published. To actually publish the port when running the container, use the `-p` flag on docker run to publish and map one or more ports, or the `-P` flag to publish all exposed ports and map them to high-order ports.  
:::

You can specify whether the port listens on TCP or UDP, and the default is TCP if the protocol is not specified.  
By default, **EXPOSE** assumes TCP. You can also specify UDP:

```dockerfile
EXPOSE 80/udp
To expose on both TCP and UDP, include two lines:
EXPOSE 80/tcp
EXPOSE 80/udp
```

In this case, if you use `-P` with docker run, the port will be exposed once for TCP and once for UDP. Remember that `-P` uses an ephemeral high-ordered host port on the host, so the port will not be the same for TCP and UDP.
Regardless of the EXPOSE settings, you can override them at runtime by using the `-p` flag. For example

```bash
docker run -p 80:80/tcp -p 80:80/udp ...
```

Just like we said the container has its own file system, it also has its own isolated set of ports that can receive traffic. But by default, no incoming traffic to your computer is going to be directed into your container. In order to connect between ports from your local machine to those inside the container, we have to set up an explicit port mapping. A port mapping essentially says "any time that someone makes a request to a given port on your local network, take that request and automatically forward it to some port inside the container". One thing to make sure we understand - this is only talking about incoming requests! Your docker container can by default make requests on its own behalf.

---

## 5. Docker-Compose commands

### • Command 1: docker-compose build

```bash
docker-compose build
```

**Description:**

Services are built once and then tagged, by default as project_service.  
If the Compose file specifies an image name (i.e. services: my-service-name: image: some-name), the image is tagged with that name, substituting any variables beforehand. See variable interpolation.

**Commonly used flags:**

- **Flag 1: --no-cache**  
  Prevent caching when building the image.

- **Flag 2: -f | --file**  
  Actually, the -f flag belongs to docker-compose command, so it's actually use before the sub-command:
  ```dockerfile
  docker-compose -f ./path/to/docker-compose.yaml build
  ```
- **Flag 3: -t**  
  A flag used for tagging the image. With docker, we had no way for tagging our image within the Dockerfile. We had to do so using the -t flag, and then providing the tag for the image. With docker-compose, we can have tags in our docker-compose file, so it basically rendered null the use for the -t flag, but it still can be used to override whatever is in the docker-compose file.

### • Command 2: docker-compose up

```bash
docker-compose up
```

:::note
Flags for this command **MUST** appear AFTER the `up` command!  
Example:

```bash
docker-compose up -d --build
```

:::

**Description:**

...

**Commonly used flags:**

- **Flag 1: -d**  
  Run in detached mode.

- **Flag 2: --build**  
  Force a re-build. Meaning, create a new image and THEN, run a container from it. Don't use an existing image.

### • Command 3: docker-compose down

```bash
docker-compose down
```

**Description:**

This command stops and removes an application's containers (is it?).

### • Command 4: docker-compose ps

```bash
docker-compose ps
```

**Description:**

Show all running containers relevant to the current application.

The command `docker-compose ps` shows you all the running containers relevant to _THIS APPLICATION_. This is in contrast to running it "cousin", `docker ps`, which shows you all the running containers, across _ALL APPLICATIONS_.

---

## 6. Docker-Compose file

### • Rule 1: services

A Compose file **MUST** declare a `services` key in the root.  
The `services` value is an object (a map) whose keys are string representations of _service names_, and whose values are _service definitions_.  
A _service definition_ contains the configuration that is applied to each container started for that service.  
Each service MAY also include a `build` section, which defines how to create the Docker image for the service.  
Compose implementations _may_ support building docker images using this service definition.
If not implemented, the `build` section _should_ be ignored and the Compose file **MUST** still be considered valid.  
`build` support is an OPTIONAL aspect of the Compose specification, and is described in detail in the Build support documentation.

Each Service defines runtime constraints and requirements to run its containers.
The `deploy` section groups these constraints and allows the platform to adjust the deployment strategy to best match containers' needs with available resources. Deploy support is an OPTIONAL aspect of the Compose specification, and is described in detail in the Deployment support documentation. If not implemented the Deploy section SHOULD be ignored and the Compose file MUST still be considered valid.

### • Rule 2: services.image

`image` specifies the image to start the container from.  
`image` **MUST** follow the Open Container Specification addressable image format, as `[%registry%/][%project%/]%image%[:%tag%|@%digest%]`.

```yaml
image: redis
image: redis:5
image: redis@sha256:0ed5d5928d4737458944eb604cc8509e245c3e19d02ad83935398bc4b991aac7
image: library/redis
image: docker.io/library/redis
image: my_private.registry:5000/redis
```

### • Rule 3: services.build

- build
  `build` an OPTIONAL build subsection on services
  `build` specifies the build configuration for creating container image from source.
  When a Build subsection is present for a service, it is valid for a Compose file to miss an `Image` attribute for corresponding service, as Compose implementation can build image from source.

- build.context v.s. build = context
  Build can be either specified as a single string defining a context path, or as a detailed build definition.
  In the former case, the whole path is used as a Docker context to execute a docker build, looking for a canonical Dockerfile at context root. Context path can be absolute or relative, and if so relative path MUST be resolved from Compose file parent folder. As an absolute path prevent the Compose file to be portable, Compose implementation SHOULD warn user accordingly.

- build.dockerfile
  In the later case, build arguments can be specified, including an alternate Dockerfile location. This one can be absolute or relative path. If Dockerfile path is relative, it MUST be resolved from context path. As an absolute path prevent the Compose file to be portable, Compose implementation SHOULD warn user if an absolute alternate Dockerfile path is used.

- Consistency with Image
  When service definition do include both `Image` attribute and a `Build` section, Compose implementation can't guarantee a pulled image is strictly equivalent to building the same image from sources. Without any explicit user directives, Compose implementation with Build support MUST first try to pull Image, then build from source if image was not found on registry. Compose implementation MAY offer options to customize this behavior by user request.

- Illustrative sample

  ```yaml
  services:
  frontend:
  image: awesome/webapp
  build: ./webapp

  backend:
  image: awesome/database
  build:
  context: backend
  dockerfile: ../backend.Dockerfile

  custom:
  build: ~/custom
  ```

  When used to build service images from source, such a Compose file will create three docker images:
  • awesome/webapp docker image is built using webapp sub-directory within Compose file parent folder as docker build context. Lack of a Dockerfile within this folder will throw an error.
  • awesome/database docker image is built using backend sub-directory within Compose file parent folder. backend.Dockerfile file is used to define build steps, this file is searched relative to context path, which means for this sample .. will resolve to Compose file parent folder, so backend.Dockerfile is a sibling file.
  • a docker image is built using custom directory within user's HOME as docker context. Compose implementation warn user about non-portable path used to build image.

- Build Definition
  The `build` element define configuration options that are applied by Compose implementations to build Docker image from source. `build` can be specified either as a string containing a path to the build context or a detailed structure:
  Using this string syntax, only the build context can be configured as either:
  • a relative path to the Compose file's parent folder. This path MUST be a directory and contain a Dockerfile
  ```yaml
  services:
  webapp:
  build: ./dir
  ```
  • a git repository URL. Git URLs accept context configuration in their fragment section, separated by a colon (:). The first part represents the reference that Git
  will check out, and can be either a branch, a tag, or a remote reference. The second part represents a subdirectory inside the repository that will be used as a
  build context.
  services:
  webapp:
  build: https://github.com/mycompany/example.git#branch_or_tag:subdirectory

### • Rule 4: services.build.context (REQUIRED)

`context` defines either a path to a directory containing a Dockerfile, or a url to a git repository.
When the value supplied is a relative path, it MUST be interpreted as relative to the location of the Compose file. Compose implementations MUST warn user about absolute path used to define build context as those prevent Compose file from being portable.

```yaml
This:
build:
context: ./dir
V.S. this:
services:
webapp:
build: https://github.com/mycompany/webapp.git
```

### • Rule 5: services.build.dockerfile

`dockerfile` allows to set an alternate Dockerfile. A relative path MUST be resolved from the build context. Compose implementations MUST warn user about absolute path used to define Dockerfile as those prevent Compose file from being portable. When set, `dockerfile_inline` attribute is not allowed and a Compose Implementation SHOULD reject any Compose file having both set.

```yaml
build:
context: .
dockerfile: webapp.Dockerfile
```

### • Rule 6: services.build.dockerfile_inline

`dockerfile_inline` allows to define Dockerfile content as inlined string in a Compose file. When set, `dockerfile` attribute is not allowed and a Compose Implementation SHOULD reject any Compose file having both set.
Use of YAML multi-line string syntax is recommended to define Dockerfile content:

```dockerfile
build:
context: .
dockerfile_inline: |
FROM baseimage
RUN some command
```

### • Rule 7: services.build.args

`args` define build arguments, i.e. Dockerfile `ARG` values.  
`args` can be set in Compose file under the `build` key to define some arguments.  
`args` can be set a mapping or a list:

```yaml
// Way number 1:
build:
context: .
args:
GIT_COMMIT: %some-value%
// Way number 2:
build:
context: .
args: - GIT_COMMIT=%some-value%
```

**-- HARDCODED:**

`args` can be hardcoded:

```yaml
build:
context: .
args: - VERDION=0.0.1
```

**-- PASSED FROM OUTSIDE:**

`args` can be passed from outside:

```yaml
build:
context: .
args:
  # The names do not need to match! First VERSION is the inner name, second VERSION is the outer name.
  - VERSION=${VERSION:-0.0.1}
```

In which, you would call the build sub-command like so:

```bash
VERSION=1.2.3 docker-compose build --no-cache
```

### • Rule 8: services.build.privileged

`privileged` configures the service image to build with elevated privileges. Support and actual impacts are platform-specific.
build:
context: .
privileged: true

### • Rule 9: services.build.labels

`labels` add metadata to the resulting image. `labels` can be set either as an array or a map.
This:

```yaml
build:
context: .
labels:
com.example.description: "Accounting webapp"
com.example.department: "Finance"
com.example.label-with-empty-value: ""
```

V.S. this:

```yaml
build:
context: .
labels: - "com.example.description=Accounting webapp" - "com.example.department=Finance" - "com.example.label-with-empty-value"
```

### • Rule 10: services.build.no_cache

`no_cache` disables image builder cache and enforce a full rebuild from source for all image layers. This only applies to layers declared in the Dockerfile, referenced images COULD be retrieved from local image store whenever tag has been updated on registry (see pull).

```yaml
services:
users-service:
image: users-service
build:
no_cache: true
```

### • Rule 11: services.build.pull

`pull` require the image builder to pull referenced images (FROM Dockerfile directive), even if those are already available in the local image store.

### • Rule 12: services.build.shm_size

`shm_size` set the size of the shared memory (/dev/shm partition on Linux) allocated for building Docker image. Specify as an integer value representing the number of bytes or as a string expressing a byte value.

**Byte values:**

- 2b
- 1024kb
- 2048k
- 300m
- 1gb

This:

```yaml
build:
context: .
shm_size: '2gb'
```

V.S. this:

```yaml
build:
context: .
shm_size: 10000000
```

### • Rule 13: services.build.secrets

`Docker Secrets` are only available in `Swarm mode`, so standalone containers can not use this feature.
A given secret is only accessible to those services which have been granted explicit access to it, and while they're running.

### • Rule 14: services.build.tags

`tags` defines a list of tag mappings that MUST be associated to the build image.
This list comes in addition of the `image` property defined in the service section
tags:

- "myimage:mytag"
- "registry/username/myrepos:my-other-tag"

### • Rule 15: services.env_file

Defining an `env_file` inside the yaml will take environment variables from the file and inject them into the container. That makes it visible to your application, but cannot be used for variables inside your yaml that you want docker-compose to expand since that variable expansion happens before the env_file contents are parsed.

```yaml
services:
  users-service:
  env_file: .env
```

When both `env_file` and `environment` are set for a service, values set by `environment` have precedence.
