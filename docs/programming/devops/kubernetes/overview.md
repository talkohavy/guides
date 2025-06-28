# What is Kubernetes? (K8S)

## - Introduction

Kubernetes is a **CONTAINER ORCHESTRATION** system. It is an open-source tool which specializes in deploying containerized applications to production.

Using docker, you can create as many containers as you want. However, what if you need to create a network of multiple containers running on different computers/servers, and have them talk with each other? Using docker alone, creating this network would prove to be a hard task. Kubernetes rose to the challenge, and it helps you do just that - create containers on different servers (either physical or virtual) and **create this network to allow them to communicate with each other**. This network creation is being done automatically, without the user's intervention.  
The user's only job is to tell kubernetes how many containers you wanna create, based on a specific image you name.

## - Kubernetes Responsibilities

K8s takes care of:

- Automatic deployment of the containerized applications across different servers. As mentioned, servers could be either physical, or virtual. Virtual servers are more common these days. Almost no-one uses a physical one.
- Distribution of the load across multiple servers.
- Auto-scaling of the deployed applications
- Monitoring & health-check of the containers.
- Replacement of the failed containers. In case some containers fail for some reason. All that is being done without your intervention.

## - On what types of environments can k8s run?

Docker is just one of the possible options for k8s to work with.
Docker belongs to a family known as "container runtime". K8S supports more than one container runtime! It doesn't matter which one you choose, but once you choose?
All application parts must use the same container runtime.
Nowadays, Kubernetes supports these types of container runtimes:
