# Docker Build

- One of Docker Engine's most used features.
- Whenever you are creating an image you are using Docker Build.
- allows you to package and bundle your code and ship it anywhere.
- It is more than a command, and it's not only about packaging code. It's a whole ecosystem of tools and features.

## Packaging your Software

Build and package your application to run it anywhere: locally or in the cloud.

## Multi-stage builds

Keep your images small and secure with minimal dependencies.

## Multi-platform images

### Multi-platform builds

A multi-platform build refers to a single build invocation that targets multiple different operating system or CPU architecture combinations. When building images, this lets you create a single image that can run on multiple platforms, such as `linux/amd64`, `linux/arm64`, and `windows/amd64`.

### Why multi-platform builds?

Docker solves the "it works on my machine" problem by packaging applications and their dependencies into containers. This makes it easy to run the same application on different environments, such as development, testing, and production.

But containerization by itself only solves part of the problem. Containers share the host kernel, which means that the code that's running inside the container must be compatible with the host's architecture. This is why you can't run a linux/amd64 container on an arm64 host (without using emulation), or a Windows container on a Linux host.

**Multi-platform builds solve this problem** by packaging multiple variants of the same application into a single image. This enables you to run the same image on different types of hardware, such as development machines running x86-64 or ARM-based Amazon EC2 instances in the cloud, without the need for emulation.

#### Difference between single-platform and multi-platform images

![single vs multi-platform image](/img/single-vs-multiplatform-image.svg)

When you push a multi-platform image to a registry, the registry stores the manifest list and all the individual manifests. When you pull the image, the registry returns the manifest list, and Docker automatically selects the correct variant based on the host's architecture. For example, if you run a multi-platform image on an ARM-based Raspberry Pi, Docker selects the `linux/arm64` variant. If you run the same image on an x86-64 laptop, Docker selects the `linux/amd64` variant (if you're using Linux containers).

#### Prerequisites

To build multi-platform images, you first need to make sure that your Docker environment is set up to support it. There are two ways you can do that:

- You can switch from the "classic" image store to the **containerd image store**.
- You can create and **use a custom builder**.

The **"classic" image store** of the Docker Engine **does not support multi-platform images**. Switching to the containerd image store ensures that your Docker Engine can push, pull, and build multi-platform images.

Creating a custom builder that uses a driver with multi-platform support, such as the `docker-container` driver, will let you build multi-platform images without switching to a different image store. However, you still won't be able to load the multi-platform images you build into your Docker Engine image store. But you can push them to a container registry directly with `docker build --push`.

#### Build multi-platform images

When triggering a build, use the --platform flag to define the target platforms for the build output, such as linux/amd64 and linux/arm64:

```bash
docker buildx build --platform linux/amd64,linux/arm64 .
```

#### Strategies

You can build multi-platform images using three different strategies, depending on your use case:

1. Using emulation, via QEMU (**Not Recommended!** Much slower than the other two)
2. Use a builder with multiple native nodes
3. Use cross-compilation with multi-stage builds

##### Multiple native nodes

Using multiple native nodes provide better support for more complicated cases that QEMU can't handle, and also provides better performance.

```bash
docker buildx create --use --name mybuild node-amd64
mybuild
docker buildx create --append --name mybuild node-arm64
docker buildx build --platform linux/amd64,linux/arm64 .
```

## BuildKit

Explore BuildKit, the open source build engine.

## Build drivers

Configure where and how you run your builds.

## Exporters

Export any artifact you like, not just Docker images.

## Build caching

Avoid unnecessary repetitions of costly operations, such as package installs.

## Bake

Orchestrate your builds with Bake.
