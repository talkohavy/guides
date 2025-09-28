# Kubernetes Architecture & Concepts

## - Concept 1: A Kubernetes Cluster & node

A kubernetes **cluster** consists of **nodes**.  
A **node** is actually a server.

You can include multiple **nodes** (servers) inside a kubernetes **cluster**, and they could be located in different data-centers in different parts of the world. But usually, nodes which belong to the same kubernetes cluster are located close to each other. This is in order to perform tasks more efficiently.

Inside each **node**, there are **pods**, and inside of each **pod** there are **containers** (usually just 1). Each **pod** can have a _pod sibling_, meaning that they're both living under the same **deployment**, or a _pod cousin_, meaning that they're both living under different **deployments**.

Nodes will not automatically form a cluster without your intervention! But after such initial configuration, everything will be automated. And kubernetes will automatically deploy pods on different nodes.

## - Concept 2: Using Service Name for internal communication

Any resource in a Kubernetes cluster, like a **service** or **deployment**, can communicate with others. To let one deployment talk to another, we expose it through a service, which provides a virtual IP. But this IP is dynamic and is only known _after_ creation. So instead, we use the **service name**, which is static and acts as a **stable hostname**. Kubernetes DNS handles the name-to-IP resolution, making it easy for deployments to connect.

## - Concept 3: Node Communication

In [Concept 5](#--concept-2-using-service-name-for-internal-communication), We talked about internal communication between **Services**, but what about **node** communication? How do those nodes actually communicate with each other? How are they managed?

In this case, you do not need to do anything. It is done for you automatically. How?

Well, in a kubernetes cluster there is what's known as a `master node`. The rest of the nodes in the cluster are called `worker nodes`. It's the `master node` job to manage communication between `worker nodes`. It is also the `master node`'s job to distribute load across `worker nodes`. All `pods` related to your application are deployed on `worker node`'s. The `master node` runs in what is known as `system pods`, which are responsible for the actual work of the kubernetes cluster in general. Basically, we could say that a master node in a kubernetes cluster is more like "the control plane", and it does not run your client applications.

**Q**: So, what services actually run on different nodes?

**A**: Let's have a look at the following diagram...

There are services such as _kubelet_, _kube-proxy_, and a _container runtime_. Those services are present ON EACH NODE in the kubernetes cluster. A container runtime is the mechanism where your containers actually run. We mentioned 3: docker, containerd, CRI-O.

## - Concept 4: DNS service

The **DNS service** is a service which runs on the master node, and is **responsible for names resolution** in the entire kubernetes cluster.

## - Concept 5: API Server

**API server** service is the main point of communication between nodes inside the kubernetes world. The **API server** is the main service inside the `master node`.
Using this **API server** service, you could actually manage the entire kubernetes cluster. It is done by using `kubectl`. Or, `kube-control`.

## - Concept 6: kubectl

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

## - Concept 7: kubelet

The **kubelet** is the **primary "node agent"** that runs on each **node**. It can register the node with the apiserver using one of:

- the hostname
- a flag to override the hostname
- or specific logic for a cloud provider.

The **kubelet** works in terms of a _PodSpec_. A _PodSpec_ is a YAML or JSON object that describes a pod. **The kubelet ensures that the containers described in those PodSpecs are running and healthy**. The kubelet doesn't manage containers which were not created by Kubernetes.

Each worker node has 1 **kubelet** service on it, which communicates with an API server service on the master node.

## - Concept 8: kube-Proxy

A **kube-proxy** service is found on each of the worker nodes, and is responsible for network communication within the node, and between nodes.

## - Concept 9: Scheduler

There are services that are present ONLY on the master node.  
One of them is the **scheduler**.  
The **scheduler** is responsible for planning and distributing of the workload inside the cluster.

## - Concept 10: Kube Controller Manager

Kube Controller Manager is a single point which controls everything inside the kubernetes cluster, and it controls what happens on each of the nodes in the cluster.

## - Concept 11: Cloud Controller Manager

Its job is to **interact with your cloud service provider**, where you actually run your kubernetes cluster. Because usually you don't create these clusters to run on your own servers, instead you usually choose to run them on one of the cloud providers.  
which actually performs almost automated creation of all nodes, and the connection between such nodes. And for that, you have to run Cloud Controller Manager service on the master node. Also for example if you want to create deployment of your application inside of the kubernetes cluster, which will be opened to the outside world, and allow connection from outside, you could create a load-balancer IP addresses, and those load-balancer IP addresses are usually provided by those specific cloud providers.

## - Concept 12: etcd

Also on master node, there's such a thing called etcd.
Etcd is a service which actually stores all logs related to the operation of the entire kubernetes cluster, and such logs are stored inside of it as key-value pairs.

---

## - Concept 13: Imperative Vs. Declarative

Up until now, we've used the imperative approach to create deployments & services.
We did so by using kubectl CLI commands. But usually, that's not the way experienced developers use to create all the different objects and resources in kubernetes. In most cases, a declarative approach is used.
In the declarative approach, you create a yaml configuration file or files, which describe a full recipe of how to build and create your entire cluster, all the deployments, all the services, and describes in full what should be done and in what order. After having such yaml files, we would use kubectl's apply command.
Let's do an example right now.
