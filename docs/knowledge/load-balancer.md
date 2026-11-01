# How do you design a load balancer?

How do you design a load balancer?

A load balancer's job is to distribute traffic evenly across all your servers.

<img src={require('@site/static/img/load-balancer/load-balancer-overview.png').default} alt="load balancer - overview" width="400" />

Let's say we have servers A, B, C and D.

<img src={require('@site/static/img/load-balancer/servers-a-b-c-d.png').default} alt="load balancer - servers a b c d" width="400" />

So how do we actually divide traffic?

## 1. Round-Robin

Let's start with the simplest way. The load balancer keeps a list of the servers, and one number that points to one server on this list.

<img src={require('@site/static/img/load-balancer/round-robin-server-list-pointer.png').default} alt="load balancer - round robin server list pointer" width="400" />

For each request, the load balancer sends the request to the server that represents this number, and then increases the number so that it points to the next server. When the number reaches the end of the list, it goes back to 0. So A, B, C, and D, and then A again. And this is called **round-robin**. The problem is that **round-robin** only follows the fixed order. It never looks at how busy a server is. Let's say a payment request takes 2 seconds, and other requests take milliseconds. **round-robin** doesn't know which request is a payment request. So, in a scenario where a lot of payment requests land on server A, then server A will be taking a lot of time to process, while other servers might get free quickly. But **round-robin** still sends the requests to A even if it is busy:

<img src={require('@site/static/img/load-balancer/round-robin-busy-server.png').default} alt="load balancer - round robin busy server" width="400" />

So we change the logic.

## 2. Least-Connections

The **load balancer keeps a count** of requests that each server is processing, and **sends the next request to the server that has the fewest requests**.

<img src={require('@site/static/img/load-balancer/least-connections-request-counts.png').default} alt="load balancer - least connections request counts" width="400" />

This is called **least-connections approach**. Now you may ask: how does the load balancer know the count of each server? Every request already passes through the load balancer, so when it forwards a request to A, it adds +1 to A's count.

<img src={require('@site/static/img/load-balancer/least-connections-increment-count.png').default} alt="load balancer - least connections increment count" width="400" />

And when A's response comes back, that task is done, it subtracts -1.

<img src={require('@site/static/img/load-balancer/least-connections-decrement-count.png').default} alt="load balancer - least connections decrement count" width="400" />

## 3. is alive

Now, let's say server B dies:

<img src={require('@site/static/img/load-balancer/server-b-dies.png').default} alt="load balancer - server b dies" width="400" />

The load balancer also has to check whether each server is alive. There are 2 ways to catch this:

### - A. Passive health check

First, the load balancer can watch the real traffic. **If one request to server B fails** with an error, or a timeout, **we don't send requests to B for the next 10 seconds**:

<img src={require('@site/static/img/load-balancer/passive-health-check-10-second-pause.png').default} alt="load balancer - passive health check 10 second pause" width="400" />

and then, we send a request to test it. This is called a **passive health check**.

<img src={require('@site/static/img/load-balancer/passive-health-check-test-request.png').default} alt="load balancer - passive health check test request" width="400" />

### - B. Active health check

**The problem with passive health check is that a real user request has to fail first**. Therefore, in the second approach, the load balancer sends its own small request to every server on a fixed time interval.

<img src={require('@site/static/img/load-balancer/active-health-check-probe-requests.png').default} alt="load balancer - active health check probe requests" width="400" />

For example, we can **sends a request every 2 seconds** by default, and **mark a server down if it fails 3 checks in a row**. This is called an **active health check**.

<img src={require('@site/static/img/load-balancer/active-health-check.png').default} alt="load balancer - active health check" width="400" />

## 4. nginx

In practice, you don't implement these algorithms yourself. You can install nginx on your server to make it a load balancer. Inside nginx you can list your servers:

```nginx
upstream backend {
    server a;
    server b;
    server c;
    server d;
}
```

and **round-robin** comes as default. You just need to add one line to select **least connections** approach:

```nginx
upstream backend {
    // diff-add-next-line
  least_conn;
    server a;
    server b;
    server c;
    server d;
}
```

active health checks comes with a paid version called **NGINX Plus**.

## 5. Slow Start a failed Server

Now, a slightly harder interview case. Let's say server B dies, and comes back online after 1 minute. Now, when it starts, it is processing 0 requests. So the load balancer will send B a sudden burst of requests, while B is still warming up. And due to this load, B can fail again.

<img src={require('@site/static/img/load-balancer/slow-start-burst-to-recovered-server.png').default} alt="load balancer - slow start burst to recovered server" width="400" />

To solve this, we have to incorporate the logic that **the load balancer raises B's share slowly**. From 0 to normal load, over a period of time. This is called **slow start**.
