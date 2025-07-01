# How to create a Docker-Compose file

## - Rule 1: services

A Compose file **MUST** declare a `services` key in the root.  
The `services` value is an object (a map) whose keys are string representations of _service names_, and whose values are _service definitions_.  
A _service definition_ contains the configuration that is applied to each container started for that service.  
Each service MAY also include a `build` section, which defines how to create the Docker image for the service.  
Compose implementations _may_ support building docker images using this service definition.
If not implemented, the `build` section _should_ be ignored and the Compose file **MUST** still be considered valid.  
`build` support is an OPTIONAL aspect of the Compose specification, and is described in detail in the Build support documentation.

Each Service defines runtime constraints and requirements to run its containers.
The `deploy` section groups these constraints and allows the platform to adjust the deployment strategy to best match containers' needs with available resources. Deploy support is an OPTIONAL aspect of the Compose specification, and is described in detail in the Deployment support documentation. If not implemented the Deploy section SHOULD be ignored and the Compose file MUST still be considered valid.

---

## - Rule 2: services.image

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

---

## - Rule 3: services.build

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

---

## - Rule 4: services.build.context (REQUIRED)

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

---

## - Rule 5: services.build.dockerfile

`dockerfile` allows to set an alternate Dockerfile. A relative path MUST be resolved from the build context. Compose implementations MUST warn user about absolute path used to define Dockerfile as those prevent Compose file from being portable. When set, `dockerfile_inline` attribute is not allowed and a Compose Implementation SHOULD reject any Compose file having both set.

```yaml
build:
context: .
dockerfile: webapp.Dockerfile
```

---

## - Rule 6: services.build.dockerfile_inline

`dockerfile_inline` allows to define Dockerfile content as inlined string in a Compose file. When set, `dockerfile` attribute is not allowed and a Compose Implementation SHOULD reject any Compose file having both set.
Use of YAML multi-line string syntax is recommended to define Dockerfile content:

```dockerfile
build:
context: .
dockerfile_inline: |
FROM baseimage
RUN some command
```

---

## - Rule 7: services.build.args

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

---

## - Rule 8: services.build.privileged

`privileged` configures the service image to build with elevated privileges. Support and actual impacts are platform-specific.
build:
context: .
privileged: true

---

## - Rule 9: services.build.labels

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

---

## - Rule 10: services.build.no_cache

`no_cache` disables image builder cache and enforce a full rebuild from source for all image layers. This only applies to layers declared in the Dockerfile, referenced images COULD be retrieved from local image store whenever tag has been updated on registry (see pull).

```yaml
services:
users-service:
image: users-service
build:
no_cache: true
```

---

## - Rule 11: services.build.pull

`pull` require the image builder to pull referenced images (FROM Dockerfile directive), even if those are already available in the local image store.

---

## - Rule 12: services.build.shm_size

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

---

## - Rule 13: services.build.secrets

`Docker Secrets` are only available in `Swarm mode`, so standalone containers can not use this feature.
A given secret is only accessible to those services which have been granted explicit access to it, and while they're running.

---

## - Rule 14: services.build.tags

`tags` defines a list of tag mappings that MUST be associated to the build image.
This list comes in addition of the `image` property defined in the service section
tags:

- "myimage:mytag"
- "registry/username/myrepos:my-other-tag"

---

## - Rule 15: services.env_file

Defining an `env_file` inside the yaml will take environment variables from the file and inject them into the container. That makes it visible to your application, but cannot be used for variables inside your yaml that you want docker-compose to expand since that variable expansion happens before the env_file contents are parsed.

```yaml
services:
  users-service:
  env_file: .env
```

When both `env_file` and `environment` are set for a service, values set by `environment` have precedence.
