# Docker Commands

## - Command 1: build an image

**The command:**

```bash
docker build . -f path/to/Dockerfile -t talkohavy/repository:0.0.1 --no-cache
```

<br/>

## - Command 2: upload an image

**The command:**

```bash
docker build . -f path/to/Dockerfile -t talkohavy/repository:0.0.1 --no-cache
```

<br/>

## - Command 3: Just run an image locally

```bash
docker run -t --rm -e PORT=3000 IMAGE_ID
```

<br/>

## - Command 4: Run & SSH into image locally

```bash
docker run -it --rm -e PORT=3000 IMAGE_ID sh
```

<br/>

## - Command 5: Run an image & expose port to host

```bash
docker run -t --rm -p 8888:8888 imageName
```

<br/>

## - Command 6: Show logs of a running container

```bash
docker logs IMAGE_NAME_OR_ID
```

<br/>

## - Command 7: SSH into a running container

```bash
docker exec -it CONTAINER_NAME_ID sh
```

<br/>

## - Command 8: Copy a file into a container

When on your desktop, run the following:

```bash
docker cp ~/Desktop/my-file.txt CONTAINER_NAME_ID:/path/in/container/my-file.txt
```

---

## **2. Docker Commands**

<font size={6}>Table of contents</font>

<br/>

### • Command 1: docker system prune

```bash
docker system prune [OPTIONS] NAME[:TAG|@DIGEST]
```

**Description:**

Remove all unused containers, networks, images (both _dangling_ and _unreferenced_), and optionally, volumes.

<br/>

### • Command 2: docker login

```bash
docker login
```

You can authenticate to any public or private registry for which you have credentials to, in order to push your images, and pull them for later use.

When you don't specify a registry, the default one is used, which is `https://index.docker.io/v1/`.

You'll need to provide 2 credentials to login with: `username` & `password`.

Avoid using the `--password` flag! Use `--password-stdin` instead.

Example usage:

```bash
echo -n $DOCKER_ACCESS_TOKEN | docker login https://index.docker.io/v1/ -u talkohavy --password-stdin
```

<br/>

### • Command 2: docker push

```bash
docker image push [OPTIONS] NAME[:TAG]
```

Upload an image to a registry.

When the image gets pushed to is dependant on the registry you provided when you did the `docker login`. In docker login, if the registry is omitted, dockerhub is chosen by default.

In case of pushing to dockerhub, you have you **personal namespace** there, which you created and named `talkohavy`. This is also your username.

Inside `talkohavy` namespace, you have `repositories`.

Each `repository` is an image, and all its versions. For example, "api-gateway@0.0.1" & "api-gateway@0.0.2".

Tp push an image to dockerhub, you mush first build it with **proper naming convention**:

```bash
docker build . -t username/repository@0.0.1
```

For example:

```bash
docker build . -t talkohavy/frontend@0.0.1
```

### • Command 3: docker pull

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

The most simple form:

```bash
docker build .
```

A complex example:

```bash
docker build . -f /path/to/Dockerfile -t ai_gateway_service --no-cache
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

### • Command 14: Show context list

```bash
docker context ls
```
