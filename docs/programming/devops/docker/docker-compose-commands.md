# Docker-Compose commands

## - Command 1: docker-compose build

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

---

## - Command 2: docker-compose up

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

---

## - Command 3: docker-compose down

```bash
docker-compose down
```

**Description:**

This command stops and removes an application's containers (is it?).

---

## - Command 4: docker-compose ps

```bash
docker-compose ps
```

**Description:**

Show all running containers relevant to the current application.

The command `docker-compose ps` shows you all the running containers relevant to _THIS APPLICATION_. This is in contrast to running it "cousin", `docker ps`, which shows you all the running containers, across _ALL APPLICATIONS_.

---
