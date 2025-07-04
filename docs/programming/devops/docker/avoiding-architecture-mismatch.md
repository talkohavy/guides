# Avoiding Docker Architecture Mismatch

## 1. The Problem: Building on macOS for Linux Deployment

If you're developing on macOS (ARM64 or Intel) but deploying to Linux servers, you need to be aware of architecture mismatches. By default, Docker builds images for your host architecture, which can cause issues when deploying.

## 2. Quick Solution: Always Specify the Target Platform

The simplest fix is to always build for Linux when you plan to deploy on Linux servers:

Instead of doing this (which builds for your local architecture):

```bash
# ❌
docker build -t myapp .
```

Do this (build specifically for Linux x86_64):

```bash
# ✅
docker build --platform linux/amd64 -t myapp .
```

## 3. How to Spot Architecture Mismatch Problems

### 1. Error Messages

When you try to run an image built for the wrong architecture, you'll see errors like:

```bash
# On Linux server trying to run ARM64 image:
exec /usr/local/bin/docker-entrypoint.sh: exec format error

# Or:
standard_init_linux.go:228: exec user process caused: exec format error
```

### 2. Check Your Image Architecture

You can inspect what architecture your image was built for:

Check the architecture of an image

```bash
docker image inspect myapp:latest | grep Architecture
```

### 3. Check Your Host Architecture

```bash
uname -m
```

On macOS it would output: _arm64 (Apple Silicon) or x86_64 (Intel Mac)_  
On Linux it would output: _x86_64, aarch64, etc_

## 4. Practical Workflow for macOS → Linux Deployment

### Local Development

```bash
# Build for local testing (matches your Mac's architecture)
docker build -t myapp:local .

# Run locally for development
docker run myapp:local
```

### Building for Production

Build specifically for Linux deployment:

```bash
docker build --platform linux/amd64 -t myapp:prod .
```

Push to registry (most CI/CD systems run on Linux x86_64):

```bash
docker push myapp:prod
```
