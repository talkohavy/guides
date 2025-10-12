# Most useful Commands

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
docker run -t --rm -p 8888:8888 IMAGE_NAME
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
