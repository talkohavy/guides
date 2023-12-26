---
sidebar_label: '10. Kubernetes'
sidebar_position: 8
---

# Guide For Kubernetes

## 1. **What is Kubernetes? (K8S)**

### - Introduction

Kubernetes is de-facto the standard for deploying containerized applications into production. Kubernetes is open-source, which means it's free for use.

Kubernetes definition: _"Kubernetes is a container orchestration system"._

Using docker, you can create as many containers as you want. However, what if you wanted to create a network of multiple containers on different computers/servers, and have them talk with each other? Using docker alone, creating this network would prove to be a hard task. Kubernetes rose to the challenge, and it helps you do just that - create containers on different servers (either physical or virtual) and create this sort of network to allow them to communicate with each other. This network creation is being done automatically, without the user's intervention.
The user's only job is to tell kubernetes how many containers you want to create, based on specific image.

### - What does k8s takes care of?

K8s takes care of:

- Automatic deployment of the containerized applications across different servers. As mentioned, servers could be either physical, or virtual. Virtual servers are more common these days. Almost no-one uses a physical one.
- Distribution of the load across multiple servers.
- Auto-scaling of the deployed applications
- Monitoring & health-check of the containers.
- Replacement of the failed containers. In case some containers fail for some reason. All that is being done without your intervention.

### - On what types of environments can k8s run?

Docker is just one of the possible options for k8s to work with.
Docker belongs to a family known as "container runtime". K8S supports more than one container runtime! It doesn't matter which one you choose, but once you choose?
All application parts must use the same container runtime.
Nowadays, Kubernetes supports these types of container runtimes:

---

## 2. **Deep Dive - Kubernetes Architecture & Terminology**

Let's start with some terminology and talk about the architecture of kubernetes:

### Random info

- **Selectors**: Selectors are used in order to connect pods to a deployment. In kubernetes, pods & deployments are actually separate objects, so we need some system to know how to assign a pod to a deployment. After creating a new deployment, which creates both a deployment, and a new pod, we would see the same selector on the pod, as well as on the deployment.

- **Replicas**: here we see 5 groups: `desired`, `updated`, `total`, `available`, `unavailable`. Desired is the easiest one to explain. It's the number of pods you wanted in the first place. In the best scenario possible, this number would match the number of available pods. But things can go bad, and a pod can go down, so that's the `unavailable` group.

- **StrategyType**: Here we see the value **RollingUpdate**. This field tells how to perform updated of deployments. We will get back to it a bit later in this course.

- **Pod Template**: notice the corresponding label here, which is "app=nginx-deployment", the same label that is mentioned in the label field. As I've mentioned, that's how the deployment is connected to its pods.

- **NewReplicaSet**: a replica set manages all pods related to a deployment, and a replica set is a set of replicas of your application, those are different pods in the same deployment, which all of them are included in the replica set. In our case we see `nginx-deployment-<some-id>`. And that why we see here under events, such replica with a message saying "scaled up to 1", meaning 1 pod. One pod was created in this replica set.

- **ReplicaSet**: In Kubernetes, a ReplicaSet is a controller that ensures a specified number of replica Pods are running at all times. It is part of the broader concept of controllers in Kubernetes, which are responsible for managing and maintaining a desired state of the cluster.

Here are the key components and concepts associated with a ReplicaSet:

1. **Desired State**: A ReplicaSet specifies the desired number of replicas (identical copies) of a Pod that should be running. This is defined using the replicas field in the ReplicaSet configuration.

2. **Pod Template**: The ReplicaSet uses a template to create new Pods. The template specifies the characteristics of the Pod, such as the container image, volumes, and other settings. When the ReplicaSet creates new Pods, it uses this template.

3. **Selector**: The ReplicaSet uses a label selector to identify the Pods it is managing. The selector is defined in the ReplicaSet configuration and matches the labels assigned to the Pods.

4. **Scaling**: The primary purpose of a ReplicaSet is to maintain the desired number of replicas. If the actual number of Pods deviates from the desired state (either too many or too few), the ReplicaSet controller takes corrective actions to scale the number of Pods up or down.

**ReplicaSet V.S. Deployment**

A ReplicaSet and a Deployment are both abstractions in Kubernetes that facilitate the management of multiple replica Pods, ensuring high availability and reliability. While they serve similar purposes, there are some key differences between them.

**ReplicaSet:**

1. **Purpose**: The primary purpose of a ReplicaSet is to maintain a specified number of replica Pods running at all times. It doesn't provide higher-level deployment features such as rolling updates or rollbacks.

2. **Updates**: If you need to update the application running in your Pods (e.g., updating the container image), you typically need to manually delete the existing ReplicaSet and create a new one with the updated configuration. This approach can result in downtime during the transition.

**Deployment:**

1. **Purpose**: A Deployment is a higher-level abstraction that builds on top of ReplicaSets. It adds declarative updates to applications, allowing you to describe the desired state for your application and automatically handling the deployment process.

2. **Rolling Updates and Rollbacks**: Deployments support rolling updates, allowing you to update your application with minimal downtime by gradually replacing old Pods with new ones. If something goes wrong, Deployments support easy rollbacks to a previous version.

3. **Declarative Configuration**: Deployments use a declarative configuration to define the desired state of the application, making it easier to manage and update. You define the desired state, and the Deployment controller takes care of making it happen.

**Connection and Recommendations:**

1. **Deployment Uses ReplicaSets**: Behind the scenes, a Deployment manages a ReplicaSet. When you create a Deployment, it creates and manages the associated ReplicaSets to ensure the desired number of replicas are running.

2. **Use Cases**:

   - **ReplicaSet**: Use a ReplicaSet when you need a basic way to ensure a certain number of identical Pods are always running. If you don't need advanced deployment features like rolling updates and rollbacks, a ReplicaSet may be sufficient.

   - **Deployment**: Use a Deployment when you want to manage the deployment and scaling of applications more declaratively. Deployments are particularly useful when you need to update your application without downtime, handle rollbacks, or manage multiple environments (e.g., development, staging, production) with different configurations.

3. **Recommendation**:

   - For most use cases, it is recommended to use Deployments over ReplicaSets. Deployments provide more features, including rolling updates and rollbacks, making application updates smoother and less error-prone.

   - Deployments are considered a higher-level abstraction that abstracts away some of the complexities associated with managing replica sets directly.

In summary, while ReplicaSets are a fundamental building block for managing replicated Pods, Deployments offer a higher-level abstraction with additional features that simplify the management of application updates and scaling. Deployments are generally preferred for managing applications in a production environment.

### • Term 1: Pod

Pod is the smallest unit in the kubernetes world.  
In docker world, container is the smallest unit. In kubernetes, it is the pod.  
Containers are created INSIDE of a pod!  
The pod's anatomy is as follows:  
Inside the pod, there could be one or more containers.  
Also, there are shared volumes, and shared network resources.  
For example, a shared IP address.

This means that all containers that inside the same pod, share volumes, and an IP address.  
The most common scenario is to have a single pod run a single container.  
But sometimes, when containers have to be tightened together and heavily depend on one other, and they could exist in the same namespace, it is plausible & possible to create several containers in the same pod.  
But again, single container per pod is the most common use-case.

### • Term 2: A Kubernetes Cluster & node

A kubernetes `cluster` consists of `nodes`.  
A `node` is actually a server.

You can include multiple `nodes` (servers) inside a kubernetes `cluster`, and they could be located in different data-centers in different parts of the world. But usually, nodes which belong to the same kubernetes cluster are located close to each other. This is in order to perform tasks more efficiently.

Inside the `nodes`, there are `pods`. A `Pod` is the smallest unit possible in the kubernetes world. And like we said earlier, inside of each `pod` there are `containers`. Usually, 1 `pod` holds 1 `container` inside. While this the most common scenario, no one prevents you from running 2+ containers inside a pod. Each `pod` can have _pod siblings_, meaning that they're all living inside a single node, or _pod cousins_, where 2 pods are living inside different nodes.

Nodes will not automatically form a cluster without your intervention! But after such initial configuration, everything will be automated. And kubernetes will automatically deploy pods on different nodes.

**Node Communication**

How do those nodes actually communicate with each other? How are they managed? Well, in a kubernetes cluster there is what's known as a `master node`. The rest of the nodes in the cluster are called `worker nodes`. The `master node` manages the `worker nodes`. It's the `master node`'s job to distribute load across `worker nodes`. All `pods` related to your application are deployed on `worker node`. The `master node` runs only in `system pods`, which are responsible for actual work of the kubernetes cluster in general. Basically, we could say that a master node in a kubernetes cluster is more like "the control plane", and it does not run your client applications.

**Q**: So, what services actually run on different nodes?

**A**: Let's have a look at the following diagram...

There are services such as _kubelet_, _kube-proxy_, and a container runtime.  
Those services are present ON EACH NODE in the kubernetes cluster.  
You already know what is a container runtime -- a container runtime runs actual containers inside of each node. We mentioned 3: docker, containerd, CRI-O.

### • Term 3: Kubelet

Such service, which exists on each worker node, communicates with an API server service on the master node.

### • Term 4: Kube-Proxy

Kube-proxy, which same as kubelet is present on each node as well, is responsible for network communication inside of each node, and between nodes.

### • Term 5: Scheduler

There are services that are present ONLY on the master node.  
One of them is the scheduler.  
The scheduler is responsible for planning and distribution of the workload in the cluster.

### • Term 6: Kube Controller Manager

Kube Controller Manager is a single point which controls everything inside the kubernetes cluster, and it controls what happens on each of the nodes in the cluster.

### • Term 7: Cloud Controller Manager

Its job is to interact with your cloud service provider, where you actually run your kubernetes cluster. Because usually you don't create such clusters yourself using just your own servers, instead you could very easily run the kubernetes clusters from one of the cloud providers, which actually performs almost automated creation of all nodes, and the connection between such nodes. And for that, you have to run Cloud Controller Manager service on the master node. Also for example if you want to create deployment of your application inside of the kubernetes cluster, which will be opened to the outside world, and allow connection from outside, you could create a load-balancer IP addresses, and those load-balancer IP addresses are usually provided by those specific cloud providers.

### • Term 8: etcd

Also on master node, there's such a thing called etcd.
Etcd is a service which actually stores all logs related to the operation of the entire kubernetes cluster, and such logs are stored inside of it as key-value pairs.

### • Term 9: DNS service

Also there are other services which are running on master node, for example, a DNS service, which is responsible for names resolution in the entire kubernetes cluster, and for instance using a DNS service, you could connect to specific deployment by the name of the corresponding deployment service. In such way, you could connect different deployments with each other.

### • Term 10: API Server

API server service is the main point of communication between nodes inside the kubernetes world. The API server is the main service inside the master node.
Using this API server service, you could actually manage the entire kubernetes cluster.  
And how is it done?

It is done by using kubectl. Or, kube-control.

### • Term 11: kubectl

Kubectl is a separate command-line tool, which allows you to connect with a specific kubernetes cluster, and manage it remotely.  
kubectl could even be ran on your local machine.  
Using kubectl, you could manage a remote kubernetes cluster.  
It connects using REST API to the API Server service on the master node. This communication happens, of course, over https. By the way, other nodes on the cluster (i.e. worker nodes) communicate with the master node in the same fashion. What that means is that by using the kubectl tool, you could manage any remote kubernetes cluster.

That's it for the kubernetes architecture overview, and you know that:  
A kubernetes cluster consists of nodes.  
One of the nodes is a master node.  
The master node manages the rest of the nodes, which are called worker nodes.  
On each node there are pods.  
Pods are created automatically by kubernetes.  
Inside each pod there are containers. Usually just single container per pod.  
All containers inside of a pod share same namespace of that pod (IP address, etc).  
Pod are the smallest unit in kubernetes.  
Pods could be created, removed, moved from one node to another, and all this happens automatically without your intervention.  
API Server service is the center main point of communication between master node and other worker nodes.  
Using the API Server service, you could manage the kubernetes cluster by using the kubectl tool, which has to be installed on your computer, if you perform management from your computer.

---

## 3. **Download & Install Minikube and Kubectl**

### • A. Installing Minikube

Of course you could create a cluster on one of the famous big cloud providers, like Amazon Web Services, or Google Cloud, but such services aren't offered for free. You have to pay even for creating the slowest bat-shit cluster. If you want a **_free_** solution, you could create a cluster locally on your machine, and for that there's such a tool called "minikube".

This tool could create a cluster for us, but this cluster would be a "single node cluster", where this node would be both the master node AND the worker node. Nonetheless, for our testing purposes this is just fine.
In order to run minikube successfully, you have to use either a virtual machine, OR a container manager.

Here are all the _virtual machines_ and _container managers_ that are supported by `minikube`:

- VirtualBox
- VMware
- Docker
- Hyper-V
- Parallels

I suggest you go ahead and use _Hyper-V_ if you are a windows user, and if you are a Macos user - you could go ahead with VirtualBox or VMware or Parallel.

:::caution
There's also an option to run minikube as a container inside of `docker`. Of course, if you have docker already installed on your computer you could use it in order to create a kubernetes cluster using minikube, and essentially it will create a separate docker container, and inside of that container all pods would be created. But I personally don't recommend you go ahead with the docker option, because it comes with some limitations. For example, I was not able to change the _container runtime_ inside of the docker container to containerd, or to CRI-O. and therefore, I recommend you go ahead with the other options I mentioned above.
:::

By the way, Hyper-V is available on windows out-of-the-box, and you could utilize it as virtual machine manager for running minikube node. To summarize, using minikube you will create single node kubernetes cluster, but as I've mentioned before, you have to use a specific tool in order to manage this cluster, and this tool is called `kubectl`.

`kubectl` is included in `minikube`, but if you want to use that included version of kubectl, you'd have to state the command `minikube-kubectl`, which is not that convenient, therefore I recommend you would install `kubectl` separately. By installing `kubectl` as a separate tool, you will also be able to manage other kubernetes clusters, which are located remotely, for example on an AWS cloud.

On the same website, go to the Getting Started page, and under "Learning Environment" click the "See install tools". There, click on the minikube "Getting Started" link. I chose to install it using the package manager.  
The install command was:

```bash
winget install minikube
```

After the installation, open System Environment, and Add To Path the minikube variable:

```bash
C:\Program Files\Kubernetes\Minikube
```

Run `minikube` inside a new terminal and check that it worked.

### • B. Installing Kubctl

The main website for kubernetes is kubernetes.io.
It contains everything you need, from details on how to set local learning environment, production environment, and even including downloads to tools such as the kubectl.
https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
No idea how, but I already had kubectl on my windows machine!!!
Choose the option of:  
**_ Install on Windows using Chocolatey or Scoop _**
I'm starting to like this chocolaty package manager for windows, since I've used it for several other softwares on windows.

### • C. VScode Extension for k8s

If you are using VScode as your main editor (which you are), I suggest you install an extension called `Kubernetes`. Using such extension, you could very fast create yaml configuration files for your deployments and services in kubernetes.

---

## **4. Minikube Commands**

A minikube cluster consists of 1 node, that serves both as the master node & the worker node, looks like that:

![minikube cluster](/img/kubernetes/minikube-cluster.png)

On the left, you can see at the top level the Kubernetes Cluster. Under the Kubernetes Cluster, there could be 1 or more nodes (servers). Minikube used to have only 1 (it can now have more). Under the Node, there could be 1 or more pods. Under the pod, there could be 1 or more containers. Usually? A pod holds only 1 container.

When creating a minikube cluster for the first time, by default, it's created with:

- 1 kubernetes cluster
- 1 node (that acts like both the master & worker node)
- 1 pod

### - Command 1: minikube start

It's your 1st time running this command:

- Option 1: start a cluster using the _docker_ driver

```bash
minikube start --driver=docker
```

- Option 2: make _docker_ the default driver, then you could use short: `minikube start`

```bash
minikube config set driver docker
minikube start
```

It's your 2nd+ time running this command:

```bash
minikube start
```

**Description:**

Starts a kubernetes cluster locally on your machine.

For this command to work, your machine's Docker Engine needs to be running. It should take a few minutes to start a minikube cluster. That cluster has only 1 node, which acts as both the master node & the worker node.

**A response example would look like:**

```bash
- minikube v1.26.1 on Microsoft Windows 10 Home 10.0.19044 Build 19044
- Using the docker driver based on user configuration
- Using Docker Desktop driver with root privileges
- Starting control plane node minikube in cluster minikube
- Pulling base image ...
  > gcr.io/k8s-minikube/kicbase: 74.85 MiB / 386.61 MiB 19.36% 4.79 MiB p/s
```

<br/>

### - Command 2: minikube stop

```bash
minikube stop
```

**Description:**

Stops a running local Kubernetes cluster.

Stops a local Kubernetes cluster. This command stops the underlying VM or container, but keeps user data intact. The cluster can be started again with the "start" command.

**A response example would look like:**

```bash
- minikube v1.26.1 on Microsoft Windows 10 Home 10.0.19044 Build 19044
- Using the docker driver based on user configuration
- Using Docker Desktop driver with root privileges
- Starting control plane node minikube in cluster minikube
- Pulling base image ...
  > gcr.io/k8s-minikube/kicbase: 74.85 MiB / 386.61 MiB 19.36% 4.79 MiB p/s
```

<br/>

### - Command 3: minikube status

```bash
minikube status
```

**Description:**

Shows the status of your kubernetes cluster.

**An example for a good response would look like:**

```bash
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

**If a cluster does not exist, the response would appear as such:**

```bash
Profile "minikube" not found.
```

<br/>

### - Command 4: minikube delete

```bash
minikube delete
```

**Description:**

Deletes an existing minikube cluster.

**A response example would look like:**

```bash
- Deleting "minikube" in docker ...
- Deleting container "minikube" ...
- Removing C:\Users\tal\.minikube\machines\minikube ...
- Removed all traces of the "minikube" cluster.
```

<br/>

### - Command 5: minikube ip

```bash
minikube ip
```

**Description:**

Returns the IP address of the specified node.

By default, it returns the ip of the node which is considered as the primary control plane. To get the ip of some other node, use the `-n`, `--node` flag followed by its name.

<br/>

### - Command 6: minikube node list

```bash
minikube node list
```

**Description:**

Returns a list of all nodes inside the minikube cluster.

I'm not sure as to why & how this could be useful, since the stupid Russian guys said a minikube cluster can only consist of 1 node, so the list would only contain 1 node, right?

**A response example would look like:**

```bash
minikube 192.168.49.2
```

I also noticed that after the `node` keyword can come multiple options:

- start
- stop
- add
- delete
- list

<br/>

### - Command 7: minikube ssh

```bash
minikube ssh
```

**Description:**

A way to connect to your minikube cluster.

With this command you don't even need to enter a password! So it's much more comfortable.

**A response example would look like:**

```
docker@minikube:~$
```

We can learn from the output above that when running the command `minikube start`, minikube creates a default _username_ called "docker", with a default _password_ of "tcuser".

- **Username**: docker
- **Password**: tcuser

<br/>

### - Command 8: minikube service

```bash
minikube service <name-of-service> <flags>
```

**Description:**

In a case of a NodePort type of service, this is a way to open up a service in your default browser, without having to know the auto-generated ip address of your node. The ip address which was assigned when using the `expose deployment --type=NodePort` command. You could use the flag `--url`, to get back only the url, without opening a web browser.

---

## **5. Kubectl Commands**

### - Command 1: kubectl config view

```bash
kubectl config view
```

**Description:**

Displays a merged kubeconfig settings or a specified kubeconfig file.

<br/>

### - Command 2: kubectl cluster-info

```bash
kubectl cluster-info
```

**Description:**

Display endpoint information about the master and services in the cluster.

**A response example would look like:**

```bash
Kubernetes control plane is running at https://127.0.0.1:54341
CoreDNS is running at https://127.0.0.1:54341/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

<br/>

### - Command 3: kubectl get namespaces

```bash
kubectl get namespaces
```

**Description:**

Returns a list of current namespaces inside the cluster.

So what are namespaces for in kubernetes? In Kubernetes, namespaces provide a mechanism for isolating groups of resources within a single cluster. Names of resources need to be unique within a namespace, but not across namespaces. By default, a minikube cluster comes with 4 namespaces: default, kube-node-lease, kube-public, and kube-system.

**A response example would look like:**

```bash
NAME STATUS AGE
default Active 29m
kube-node-lease Active 29m
kube-public Active 29m
kube-system Active 29m
```

<br/>

### - Command 4: kubectl get nodes

```bash
kubectl get nodes <flags>
```

**Description:**

Returns a list of nodes.

**Commonly used options:**

- **Flag 1: -n | --namespace**  
  By default, `kubectl get nodes` returns a list of all the nodes within the `default` namespace. To get nodes from another namespace, use the `--namespace` flag, followed by the namespace's name.

  ```bash
  kubectl get nodes --namespace=kube-system
  ```

**A response example would look like:**

```bash
NAME READY STATUS RESTARTS AGE
coredns-6d4b75cb6d-jz8r9 1/1 Running 0 54m
etcd-minikube 1/1 Running 0 54m
kube-apiserver-minikube 1/1 Running 0 54m
kube-controller-manager-minikube1/1 Running 0 54m
kube-proxy-g75dw 1/1 Running 0 54m
kube-scheduler-minikube 1/1 Running 0 54m
storage-provisioner 1/1 Running 1 (54m ago) 54m
```

<br/>

### - Command 5: kubectl run

```bash
kubectl run <name> --image=<image-name>
```

**Description:**

A way to manually create a pod.

`kubectl run` command is very similar to the `docker run` command. Just as `docker run` creates one docker container, `kubectl run` creates one single pod. `kubectl run` creates a new pod, and inside it, pulls the image you specified, and runs a new container based on that.

:::info
We usually don't use this command to create new pods. We would use `create deployment` for that purpose instead.
:::

<br/>

### - Command 6: kubectl get deployments

```bash
kubectl get deployments {flags}
```

or in the singular form...

```bash
kubectl get deployment {flags}
```

**Description:**

Get deployments.

**Commonly used options:**

- **Flag 1: -n | --namespace**  
  By default, `kubectl get deployments` returns a list of all the deployments within the `default` namespace. To get deployments from another namespace, use the `--namespace` flag, followed by the namespace's name.

  ```bash
  kubectl get deployments --namespace=kube-system
  ```

<br/>

### - Command 7: kubectl create deployment

```bash
kubectl create deployment <deployment-name> --image=<image-name>
```

**Description:**

Creates a new `deployment` with exactly 1 new `pod`.

The `deployment` is given the name you specified. `deployment-name` is a **required** field. `image-name` is a **required** field.  
Inside the newly created `pod`, an image is pulled, built, and a `container` starts to run. This is according to the image you provided. A `deployment` can later be scaled up, or down as you like, to include more pods.

Even if you want a deployment to have just 1 pod, it is still more reasonable to create a deployment with 1 pod, instead of creating 1 pod outside of a deployment using the `kubectl run` command (A command which creates a pod). There are 3 reasons for that:

1. **Scale**: Creating a pod with `kubectl run` doesn't let you scale. You wouldn't be able to increase the quantity of the pods if you needed to.
2. **Failure**: If the pod created outside a deployment dies for some reason, it won't restart itself.
3. **Load Balancing**: In a case of 2+ pods, even if you've found a way to get around the 2 points above, and create an army of pods, you'd still need to create your own mechanism for load balancing. A deployment basically acts as a load balancer out of the box automatically for you.

For those reasons mentioned above, the most common way to create `pods` (whether it's 1 or 2+ identical ones) is by wrapping them in a `deployment`. With a `deployment`, you're able to increase or decrease the quantity of the pods, modify configuration, and so much more. It would even distribute the load (load-balancing) automatically for you! That's the whole purpose of the deployment. A minimal downside to this is that you won't be able to know which pod exactly gave you back the response, but is it really a downside though? I mean, they're 100% identical.

**Commonly used options:**

- **Flag 1: -n | --namespace**  
  By default, `kubectl create deployment` creates a deployment in the `default` namespace. To create a deployment in another namespace, use the `--namespace` flag, followed by the namespace's name.

  ```bash
  kubectl create deployment <deployment-name> --image <image-name> --namespace=frontend
  ```

**A response example would look like:**

```bash
deployment.apps/nginx-deployment created
Google's Documentation: Deployments represent a set of multiple identical Pods with no unique identities. A Deployment runs multiple replicas of your application and automatically replaces any instances that fail or become unresponsive. In this way, Deployments help ensure that one or more instances of your application are available to serve user requests. Deployments are managed by the Kubernetes Deployment controller.
```

<br/>

### - Command 8: kubectl describe deployment

```bash
kubectl describe deployment <deployment-name>
```

**Description:**

Get details about a specific deployment.

**A response example would look like:**

```bash
Name: nginx-deployment
Namespace: default
CreationTimestamp: Thu, 15 Sep 2022 23:33:18 +0300
Labels: app=nginx-deployment
Annotations: deployment.kubernetes.io/revision: 1
Selector: app=nginx-deployment
Replicas: 1 desired | 1 updated | 1 total | 1 available | 0 unavailable
StrategyType: RollingUpdate
MinReadySeconds: 0
RollingUpdateStrategy: 25% max unavailable, 25% max surge
Pod Template:
Labels: app=nginx-deployment
Containers:
nginx:
Image: nginx
Port: <none>
Host Port: <none>
Environment: <none>
Mounts: <none>
Volumes: <none>
Conditions:
Type Status Reason

---

Available True MinimumReplicasAvailable
Progressing True NewReplicaSetAvailable
OldReplicaSets: <none>
NewReplicaSet: nginx-deployment-85c6d5f6dd (1/1 replicas created)
Events:
Type Reason Age From Message

---

Normal ScalingReplicaSet 11m deployment-controller Scaled up replica set nginx-deployment-85c6d5f6dd to 1
```

**The details in the response above are:**

- **Name**: The name of the deployment, which was given by the developer.

- **Namespace**: The namespace where the deployment lives. Defaults to `default`.

- **Label**: kubernetes automatically assigns labels to each deployment, which appears as something like: `app=<deployment-name>`

- **Annotations**: Created automatically.

- **Selectors**: Selectors are used in order to connect pods to a deployment. In kubernetes, pods & deployments are actually separate objects, so we need some system to know how to assign a pod to a deployment. After creating a new deployment, which creates both a deployment, and a new pod, we would see the same selector on the pod, as well as on the deployment.

- **Replicas**: here we see 5 groups: `desired`, `updated`, `total`, `available`, `unavailable`. Desired is the easiest one to explain. It's the number of pods you wanted in the first place. In the best scenario possible, this number would match the number of available pods. But things can go bad, and a pod can go down, so that's the `unavailable` group.

- **StrategyType**: Here we see the value **RollingUpdate**. This field tells how to perform updated of deployments. We will get back to it a bit later in this course.

- **Pod Template**: notice the corresponding label here, which is "app=nginx-deployment", the same label that is mentioned in the label field. As I've mentioned, that's how the deployment is connected to its pods.

- **Events**: events related to this particular deployment. Here in our case, we can see a single event called "ScalingReplicaSet". But what is a Replica Set? A bit above the event field you see a field called "NewReplicaSet".

- **NewReplicaSet**: a replica set manages all pods related to a deployment, and a replica set is a set of replicas of your application, those are different pods in the same deployment, which all of them are included in the replica set. In our case we see `nginx-deployment-<some-id>`. And that why we see here under events, such replica with a message saying "scaled up to 1", meaning 1 pod. One pod was created in this replica set.

<br/>

### - Command 9: kubectl scale deployment

```bash
kubectl scale deployment <deployment-name> --replicas=#number
```

**Description:**

Scales a `deployment` by its name, and increases/decreases the number of `pods` living inside it according to the number of replicas provided, and based on the number of replicas currently living in the deployment.

**A response example would look like:**

```bash
deployment.apps/nginx-deployment scaled
```

<br/>

### - Command 10: kubectl get rs

```bash
kubectl get rs
```

**Description:**

Get replica sets.

Basically, when you create a `deployment`, it also creates a ReplicaSet under the hood. With `kubectl get rs` you can see all the replica sets which were created. Although you can create ReplicaSets directly, it is not recommended, and you should always be using deployments to do it for you.

:::info
Basically `kubectl get deployments` & `kubectl get rs` are both doing the same thing, only in the latter you could also see the replicaSet's hash, where in the former it is hidden from you, and you can only see the deployment's name.
:::

<br/>

### - Command 11: kubectl get pods

```bash
kubectl get pods <flags>
```

**Description:**

Get pods.

In the response of the `kubectl get pods` command, under the pods' names, you'll notice 3 things:

- The deployment's name
- The replicaSet's hash
- The pod's unique hash

Also, notice how to pods' IPs are internal IPs. Meaning, they cannot be accessed from the outside world (which is a good thing!).

**Commonly used options:**

- **Flag 1: -n | --namespace**  
  By default, `kubectl get pods` returns a list of all pod within the `default` namespace. To get pod living on another namespace, use the `--namespace` flag, followed by the namespace's name.

  ```bash
  kubectl get pod --namespace=luckylove
  ```

- **Flag 2: -o**  
  To view a little more information, like the ip address for example, add the `-o wide` option:

  ```bash
  kubectl get pods -o wide
  ```

<br/>

### - Command 12: kubectl describe pod

```bash
kubectl describe pod <pod-name>
```

**Description:**

Get a full description about a specific pod (identify by name).

Some really useful information coming from the response is:

- **name**: name of the pod
- **namespace**: the namespace it belongs to (automatically assigned to default).
- **Start time**: the start time of the pod.
- **Status**: the status of the pod (running, stopped, etc.)
- **IP**: the IP address which was assigned to this specific pod. Note that this is an internal IP address! You will not be able to connect to it from outside. In order to be able to connect to pods, you have to create services in kubernetes.

- **Containers & Container ID**: Containers hold a list of all docker containers which are running inside of our pod. An item on that list would have a container ID, which is the container ID that was generated/given to it.

- **Controlled By**: this field is related to a subject called deployment - where many identical pods are considered as one collection, and so with this field we could see who controls all those identical pods. This fields basically says: "I belong to this deployment". The value here looks something like: `ReplicaSet/<deployment-name>-<replicaSet-hash>`

- **Image**: which image was utilized for this particular container. That's the image which was specified using the --image flag upon creation of the pod.

- **Events**: in the events section you can see a message saying the pod was successfully assigned to minikube node, a message about the image which was pulled, creation of the container, and starting of tat container.

<br/>

### - Command 13: kubectl delete pod

```bash
kubectl delete pod <pod-name>
```

**Description:**

Deletes a pod by name.

A pod that's deleted, which was manually created, would be deleted forever.  
A pod that's deleted, which was created by a deployment, would also be deleted forever, but a few seconds later, the deployment would take care of creating a new pod to take its place, and that pod would have a different hash and a different IP address.

<br/>

### - Command 14: kubectl expose deployment

```bash
kubectl expose deployment <deploy-name> --type=LoadBalancer --name=<my-service> --port=<port> --target-port=<tar-port>
```

**Description:**

Create a `service` object that exposes the deployment.

**Commonly used options:**

- **Flag 1: --target-port**  
   The _port number on the container_ that the service should direct traffic to.

  ```bash
  kubectl expose deployment nginx-deployment --type=LoadBalancer --name=my-service --port=8000 --target-port=80
  ```

- **Flag 2: --port**  
   The port number on the `service` to which external resources should tap into.

  ```bash
  kubectl expose deployment nginx-deployment --type=LoadBalancer --name=my-service --port=5000 --target-port=80
  ```

**A response example would look like:**

```bash
service/my-service exposed
```

<br/>

### - Command 15: kubectl get services / a specific service

The plural form gets you many:

```bash
kubectl get services
# or...
kubectl get svc
```

The singular form gets a specific service: (by name)

```bash
kubectl get service <service-name>
```

**Description:**

Feels like this is an unnecessary command!

It doesn't give you more information than what `kubectl get services` gives back! It is more of a regex filterer to the `kubectl get services` command.  
Displays information about Services / a specific Service.

**A response example would look like:**

```bash
NAME TYPE CLUSTER-IP EXTERNAL-IP PORT(S) AGE
kubernetes ClusterIP 10.96.0.1 <none> 443/TCP 10h
my-service LoadBalancer 10.109.250.82 <pending> 8080:30000/TCP 64s
```

<br/>

### - Command 16: kubectl describe services

```bash
kubectl describe service <my-service>
```

**Description:**

Display detailed information about a Service.

**A response example would look like:**

```bash
Name: my-service
Namespace: default
Labels: app=nginx-deployment
Annotations: <none>
Selector: app=nginx-deployment
Type: LoadBalancer
IP Family Policy: SingleStack
IP Families: IPv4
IP: 10.109.250.82
IPs: 10.109.250.82
Port: <unset> 8080/TCP
TargetPort: 3000/TCP
NodePort: <unset> 30000/TCP
Endpoints: 172.17.0.3:3000,172.17.0.4:3000,172.17.0.6:3000
Session Affinity: None
External Traffic Policy: Cluster
Events: <none>
```

- **IP**: The `ip` attribute of each `service` is auto-generated & assigned by kubernetes. The `ip` of a `service` serves as the entry point to it. By running `curl <clusterUrl-serviceIP>` on a live kubernetes cluster, you'd get a response from one of the endpoints (a.k.a. `pods`) attached to that `service`. Kubernetes will decide for you which `pod` would be the one to answer each particular request. In the example guide on the youtube channel, he used an express server which responded with `hello from ${os.hostname()}`, and that way, even though all pods are identical, he was able to determine which `pod` was the one serving the request, and gave back an answer, because the hostname included the replicaSet's hash, AND the specific hash for that serving `pod`. The concatenation of the replicaSet has + the pod's hash make up for the **NAME** of the pod.

- **endpoints**: The `endpoints` attribute contains all the `pods` related to this `service`. Load will be distributed across these endpoints. Notice the port number 3000 at the end of each endpoint in the response example above? That's because we ran the command `kubectl expose deployment` with a flag known as `--target-port` and set its value to 3000.

- **TargetPort**: The `TargetPort` attribute in the response also mentions this exact same value, 3000.

- **port**: The `port` attribute is consistent with the --port=8080 flag which was used. The is the port which the `service` will serve requests upon.

- **selector**: The `selector` attribute marks how this service is actually connected to those particular pods. All those pods also have the exact same label.

- **namespace**: The `namespace` where the service lives. It will be set to `default` if not specified otherwise, and it is same for all the pods that are linked to it, and the matching deployment.

---

## 6. **Kubernetes Configuration Templates**

### • A. Pod Configuration

### • B. Deployment Configuration

`Deployments` use a `Pod` template, which contains a specification for its Pods. The Pod specification determines how each Pod should look like: what applications should run inside its containers, which volumes the Pods should mount, its labels, and more. When a Deployment's Pod template is changed, new Pods are automatically created one at a time.

### • C. Service Configuration

### • D. ???

### • E. ReplicaSet

Here's a simple example of a ReplicaSet YAML configuration:

```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: my-replicaset
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-container
        image: my-image:latest
```

- **replicas**: 3 indicates that the ReplicaSet should maintain three replicas.

- **selector**: specifies the label selector, and matchLabels defines the labels that the Pods managed by this ReplicaSet should have (app: my-app).

- **template**: provides the specification for the Pods created by the ReplicaSet. The Pods will have the label app: my-app and contain a container named my-container running the my-image:latest image.

If a node fails or if the number of Pods falls below the desired state for any reason, the ReplicaSet controller automatically creates new Pods to meet the specified replica count. Similarly, if there are too many Pods, the controller will scale down the number of replicas.
