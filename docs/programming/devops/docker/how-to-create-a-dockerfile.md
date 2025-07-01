# How to create a Dockerfile

A **Dockerfile** is a text document needed for the `docker build` process.  
A **Dockerfile** contains all the instructions a user could call on the command line to assemble an image. A **Dockerfile** must begin with a `FROM` instruction.

When you call the command `docker build` (or `docker-compose build`), docker builds your image by reading the instructions from a target **Dockerfile**. Docker then runs the instructions inside it in a sequential order.

Here is a basic **Dockerfile** you can copy:

```dockerfile
FROM node

CMD ["echo", "hello world"]
```

**<font size="5" Dockerfile Instructions/>**

## - Instruction 1: FROM

```dockerfile
FROM node:19-alpine3.16
```

**Description:**

The `FROM` instruction initializes a new build stage and sets the base image for subsequent instructions.

A **Dockerfile** must begin with a `FROM` instruction. `FROM` may appear after globally scoped `ARG`'s, comments, or parser directives. The `FROM` instruction specifies the parent image.

## - Instruction 2: ARG

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

You can set a _default value_ to and **ARG**, in case an outside value wasn't provided:

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

## - Instruction 3: WORKDIR

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

## - Instruction 4: COPY

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

## - Instruction 5: RUN

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

## - Instruction 6: ENTRYPOINT

```dockerfile
ENTRYPOINT
```

## - Instruction 7: CMD

````dockerfile
CMD [ "pnpm", "run", "start" ]
```dockerfile
````

## - Instruction 8: EXPOSE

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
