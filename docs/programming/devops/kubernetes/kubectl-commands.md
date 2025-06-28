# Kubectl Commands

## - Command 0: Check/Upgrade Kubernetes version

**The command:**

```bash
kubectl version --client
```

**Description:**

Kubectl is a command line tool that you use to communicate with the Kubernetes API server. This above command determines whether you already have kubectl installed on your device.

<br/>

## - Command 1: show all contexts list

**The command:**

```bash
kubectl config get-contexts
```

**Description:**

Display one or many contexts from the kubeconfig file.

<br/>

## - Command 2: get current context

**The command:**

```bash
kubectl config current-context
```

**Description:**

Displays the current-context

<br/>

## - Command 3: switch to a context

**The command:**

```bash
kubectl config use-context context-name
```

**Description:**

Display one or many contexts from the kubeconfig file.

<br/>

## - Command 4: view config settings

**The command:**

```bash
kubectl config view
```

**Description:**

Displays a merged kubeconfig settings or a specified kubeconfig file.

**A response example would look like:**

When you haven't set any clusters yet:

```bash
apiVersion: v1
clusters: null
contexts: null
current-context: ""
kind: Config
preferences: {}
users: null
```

<br/>

## - Command 5: show cluster-info

**The command:**

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

## - Command 6: get namespaces

**The command:**

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

## - Command 7: get deployments

**The command:**

```bash
kubectl get deployments {flags}
```

or in the singular form...

```bash
kubectl get deployment {flags}
```

or in the short form...

kubectl get deploy

**Description:**

Get deployments.

**Commonly used options:**

- **Flag 1: -n | --namespace**  
  By default, `kubectl get deployments` returns a list of all the deployments within the `default` namespace. To get deployments from another namespace, use the `--namespace` flag, followed by the namespace's name.

  ```bash
  kubectl get deployments --namespace=kube-system
  ```

<br/>

## - Command 8: get pods

**The command:**

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

## - Command 9: get services

**The command:**

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

## - Command 10: get nodes

**The command:**

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

## - Command 11: get replica sets

**The command:**

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

## - Command 12: show logs of pod

**The command:**

```bash
kubectl logs <pod-name> -n <namespace-name> -f
```

**Description:**

Show logs inside a pod.

<br/>

## - Command 13: kubectl exec

**The command:**

```bash
kubectl exec -it -n <namespace-name> <pod-name> -c <container-name> -- sh
```

**Description:**

Using this command you can:

1. Execute a command inside a **running** pod.
2. Execute a command inside a **running** container inside of a **running** pod.

If the `-n` flag is omitted, the command searches for the pod name inside the `default` namespace. If the `-c` flag is omitted, you are ssh'ing to the pod, and if you _are_ adding the `-c` flag, you are ssh'ing into the container inside the running pod.

This command is very similar to the `docker exec` command. It allows us to take any of the pods inside our cluster, and execute any command we want inside of the running `container` inside of the `pod`.

**Common Use-Case:**

By running the following command:

```bash
kubectl exec -it -n solve-dev solvebe-admin-server-3d45e6 -c solve-admin-server -- sh
```

we try to resolve the "nginx" name from inside of the container which belongs to "pod-name". The response should look like:

```bash
Name: nginx.default.svc.cluster.local
Address: 10.106.227.35
```

The value "10.106.227.35" under IP address is what we got back from the DNS server when we made the request `nslookup nginx`. But where does this IP come from? If you type in the command:

```bash
k get svc
```

You should see:

```bash
NAME    CLUSTER-IP
nginx   10.106.227.35
```

And notice that the 2 IPs match! They're identical.  
Now kubernetes is able to resolve the name of the service, to the corresponding ClusterIP.

<br/>

## - Command 14: port-forward

**The command:**

```bash
kubectl port-forward TYPE/NAME [options] [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N]
```

**Description:**

You way of connecting to a pod from the host.

The `kubectl port-forward` command in Kubernetes allows you to forward one or more local ports to a port on a Pod (or other Kubernetes resource like a Service). **This is useful for debugging or temporarily accessing services running inside your cluster without exposing them externally**.

Use resource type/name such as deployment/my_deployment to select a pod. Resource type defaults to `pod` if omitted.

**Common Use-Case:**

Accessing a web app running in a pod:

```bash
kubectl port-forward svc/my-service 8080:80
```

You can now access the service at http://localhost:8080.

Listen on port 8888 locally (on the host), forwarding to port 5000 in the pod:

```bash
kubectl port-forward pod/mypod 8888:5000
```

Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in the pod:

```bash
kubectl port-forward pod/mypod 5000 6000
```

Listen on ports 5000 and 6000 locally, forwarding data to/from ports 5000 and 6000 in a pod selected by the deployment

```bash
kubectl port-forward deployment/mydeployment 5000 6000
```

Listen on port 8443 locally, forwarding to the targetPort of the service's port named "https" in a pod selected by the service

```bash
kubectl port-forward service/myservice 8443:https
```

**Notes:**

- This is a **temporary and local-only** tunnel; it's not for production use.
- It requires `kubectl` to stay running in your terminal.
- You must have access to the pod via your Kubernetes context.

<br/>

## - Command 15: describe pod

**The command:**

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

- **Controlled By**: this field is related to a subject called deployment - where many identical pods are considered as one collection, and so with this field we could see who controls all those identical pods. This fields basically says: "I belong to this deployment". The value here looks something like: `ReplicaSet/DEPLOYMENT_NAME-<replicaSet-hash>`

- **Image**: which image was utilized for this particular container. That's the image which was specified using the --image flag upon creation of the pod.

- **Events**: in the events section you can see a message saying the pod was successfully assigned to minikube node, a message about the image which was pulled, creation of the container, and starting of tat container.

<br/>

## - Command 16: describe deployment

**The command:**

```bash
kubectl describe deployment DEPLOYMENT_NAME
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

- **Label**: kubernetes automatically assigns labels to each deployment, which appears as something like: `app=DEPLOYMENT_NAME`

- **Annotations**: Created automatically.

- **Selectors**: Selectors are used in order to connect pods to a deployment. In kubernetes, pods & deployments are actually separate objects, so we need some system to know how to assign a pod to a deployment. After creating a new deployment, which creates both a deployment, and a new pod, we would see the same selector on the pod, as well as on the deployment.

- **Replicas**: here we see 5 groups: `desired`, `updated`, `total`, `available`, `unavailable`. Desired is the easiest one to explain. It's the number of pods you wanted in the first place. In the best scenario possible, this number would match the number of available pods. But things can go bad, and a pod can go down, so that's the `unavailable` group.

- **StrategyType**: Here we see the value **RollingUpdate**. This field tells how to perform updated of deployments. We will get back to it a bit later in this course.

- **Pod Template**: notice the corresponding label here, which is "app=nginx-deployment", the same label that is mentioned in the label field. As I've mentioned, that's how the deployment is connected to its pods.

- **Events**: events related to this particular deployment. Here in our case, we can see a single event called "ScalingReplicaSet". But what is a Replica Set? A bit above the event field you see a field called "NewReplicaSet".

- **NewReplicaSet**: a replica set manages all pods related to a deployment, and a replica set is a set of replicas of your application, those are different pods in the same deployment, which all of them are included in the replica set. In our case we see `nginx-deployment-<some-id>`. And that why we see here under events, such replica with a message saying "scaled up to 1", meaning 1 pod. One pod was created in this replica set.

<br/>

## - Command 17: describe service

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

<br/>

## - Command 18: manually delete a pod

**The command:**

```bash
kubectl delete pod <pod-name>
```

**Description:**

Deletes a pod by name.

A pod that's deleted, which was manually created, would be deleted forever.  
A pod that's deleted, which was created by a deployment, would also be deleted forever, but a few seconds later, the deployment would take care of creating a new pod to take its place, and that pod would have a different hash and a different IP address.

<br/>

## - Command 19: manually create pod

**The command:**

```bash
kubectl run <name> --image=IMAGE_NAME
```

**Description:**

A way to manually create a pod.

`kubectl run` command is very similar to the `docker run` command. Just as `docker run` creates one docker container, `kubectl run` creates one single pod. `kubectl run` creates a new pod, and inside it, pulls the image you specified, and runs a new container based on that.

:::info
We usually don't use this command to create new pods. We would use `create deployment` for that purpose instead.
:::

<br/>

## - Command 20: manually create deployment

**The command:**

```bash
kubectl create deployment DEPLOYMENT_NAME --image=IMAGE_NAME
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
  kubectl create deployment DEPLOYMENT_NAME --image IMAGE_NAME --namespace=frontend
  ```

**A response example would look like:**

```bash
deployment.apps/nginx-deployment created
Google's Documentation: Deployments represent a set of multiple identical Pods with no unique identities. A Deployment runs multiple replicas of your application and automatically replaces any instances that fail or become unresponsive. In this way, Deployments help ensure that one or more instances of your application are available to serve user requests. Deployments are managed by the Kubernetes Deployment controller.
```

<br/>

## - Command 21: manually expose a deployment

**The command:**

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

## - Command 22: manually scale a deployment

**The command:**

```bash
kubectl scale deployment DEPLOYMENT_NAME --replicas=#number
```

**Description:**

Scales a `deployment` by its name, and increases/decreases the number of `pods` living inside it according to the number of replicas provided, and based on the number of replicas currently living in the deployment.

**A response example would look like:**

```bash
deployment.apps/nginx-deployment scaled
```

<br/>

## - Command 23: manually delete all resources

**The command:**

```bash
kubectl delete all --all
```

**Description:**

How to delete all quickly. Deletes all the pods, all the deployments, and all the services we've created.

With kubectl, there's an option to delete everything quickly, and that could be done with the `delete all` command. Note that this action does not kill immediately!
If you were to run:

```bash
kubectl get pods
```

immediately after the `delete all` command, you'll see some pods are still alive! However notice their status, it's marked as `Terminating`. Also, note that this command also deleted the default `service` created by Kubernetes, which is also called Kubernetes, but this `service` got re-created again. Check its **AGE** and you'll see that it's only alive for a few seconds.

<br/>

## - Command 24: set image

**The command:**

```bash
kubectl set image DEPLOYMENT_NAME=talkohavy/img-name:2.0.0
```

**Description:**

...

<br/>

## - Command 25: rollout status deploy

**The command:**

```bash
kubectl rollout status deploy DEPLOYMENT_NAME
```

**Description:**

...

<br/>

---
