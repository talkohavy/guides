# How do you scale a database?

## 1. Introduction

How do you scale a database as your application grows?

**Three common techniques are Replication, Partitioning and Sharding**.

Each technique solves a different scaling problem.

So, how do you know which one to use? and why?

---

## 2. Replication

### TLDR;

Instead of relying on one database, we create additional copies, called **replicas**.

Primary is the only one allowed to write, and its writes are propagated to the replicas.

This helps us:

- handle far more read requests
- reduce load on the primary, that handle writes
- increased availability (one down, another is there, and if primary down, a replica can become one if we've configured a failover)

Limitations:

- replication lag. a display order request right after purchase must go to the primary.

### Background

Imagine we're building an online store, where customers can browse products, place orders, and make payments. We have a frontend, a backend API, and **single database** that stores our customers, products, and orders.

Initially, everything works fine. But as more customers start using the application, our database has to handle more requests. And if we look at those requests, we'll notice that most customers are simply browsing products. That means **our database handles far more reads than writes**. As traffic continues to increase, **it becomes difficult for a single database server to handle all those read requests**. One way to solve this is through **Replication**.

Instead of relying on one database, we create additional copies, called **replicas**.

For example, we could have one primary database, and 2 read replicas. When a customer places an order, the backend sends the write requests to the primary database. The primary saves the order, and those changes are copied to the replicas. Meanwhile, when customers browse products, the backend can distribute those read requests across the replicas. This reduces the read load on the primary, because more database servers are now handling the requests.

### Pros

#### - A. Reduced READ load

More replicas mean less load on each replicas for read requests. This **reduces the read load on the primary, which is in charge of all write operations**, because more database servers are now handling the requests.

#### - B. Improved availability

Replication can also improve availability.

For example, if the primary database fails, one of the replicas can be promoted to become the new primary, provided we've configured a **failover**.

### Cons

But **Replication** also comes with limitation. One of them, is...

#### - A. Replication lag

When data changes on the primary, those changes need to be copied to the replicas. That's called propagation. And depending on how replication is configured, that process might not happen immediately.

Let's say a customer places an order, and then opens their order history. If the application reads from a replica that hasn't received the latest changes, the new order might not appear yet. And that's bad. That's why **requests that require the most recent data may need to read directly from the primary**.

#### - B. many WRITES isn't solved

There's also another limitation. Although replication helps us handle more reads, our primary database is still responsible for all the writes. So adding more replicas doesn't necessarily solve a write bottleneck.

---

## 3. Partitioning

Now, let's look at a different problem in our online store application. As the business grows, customers continue placing orders, and over time, our orders table grow to +100M of records. Imagine our finance team wants to retrieve all the orders places in March. We could used indexes to make those queries more efficient, but managing such a large table, especially when it contains YEARS of historical data, can become challenging. **This is where partitioning becomes useful**.

**Partitioning allows us to divide a large table into smaller, more manageable sections called partitions**.

For example, instead of keeping all our order in one physical table, we can organize them by month. Orders places in january belong to one partition, February belong to another, and March belong to another. The interesting part is that **from our application's perspective, we're still working with one logical Orders table**. The database handles how those record are organized internally.

Now, when the finance team requests orders from March, the database can identify the March partition, and skip the partitions for other months. **This is called partition pruning**. Instead of considering data from every month, **the database can focus on the partition containing the records we need**. This isn't just useful for queries - imagine we want to archive orders from several years ago. With monthly partitions, we can manage or archive older data more easily, without having to delete millions of individual records one by one.

Partitioning can also be done in different ways. We can divide data using:

- Date ranges
- specific values
- or hash functions

depending on how our application accesses the data.

But, partitioning doesn't automatically make every query faster. It's effectiveness depend on how we organize the partitions, and whether our queries can take advantage of that structure. And there's something else to consider: in our example, **all partitions are still stored on the same database server**. That means they're sharing the same CPU, memory, and storage resources. **So while partitioning makes large datasets easier to organize, query and maintain, it doesn't remove the limitations of that single server**.

---

## 4. Sharding

Now, notice the difference between the two techniques we've covered:

- With **Replication**, we're creating copies of our data, so multiple server can handle read requests.
- With **Partitioning**, we're dividing large tables into smaller sections, to make certain queries and data management more efficient.

but what happens when our database grows _beyond_ what one server can handle?

Let's say our online store has millions of customers, and the volume of orders has increased significantly. At this point, our primary database is struggling with write traffic. And storing all that data on one server is becoming difficult. Adding more READ replicas won't solve the primary's WRITE bottleneck, and diving our table into partitions on that same server won't give us more computing resources either. **What we need now is a way to distribute our data and workload across multiple servers**. This is where **Sharding** comes in.

With **Sharding**, instead of keeping all our data on one database server, we distribute it across multiple servers called shards.

Let's say we have 3 shards. Rather than storing every customer's orders on one server, we spread those orders across those 3 shards. Each shard stores a different portion of our data. But how does the application know which shard contains a particular customer's orders? For that, we need something called a **shard key**.

A **shard key** is a field that determines how data is distributed across our shards.

For example, we could use the customer's ID. A routing layer uses that id to determine which shard should store or retrieve that customer's orders. So when a customer opens their orders history, the request is routed to the shard containing their orders. And when different customers place orders, their WRITE request can be handled by different shards. Instead of one database server handling every WRITE, the workload is now distributed across multiple machines. This allows us to scale our storage, and potentially handle more READ & WRITE traffic.

But sharding introduces some additional complexity. One of the biggest challenges is **choosing the right shard key**. If we choose a poor shard key, we might end up with one shard handling most of the traffic, while the others receive very few requests. **This problem is called a hot shard**.

And because our data is now distributed across multiple servers, queries that need information from several shards can become more complicated. The same applies to certain joins and transactions.

We also need to think about how data will be redistributed when we add more shards in the future.

So, while sharding helps us scale beyond a single database server, it requires more planning and coordination. And there's one important thing to understand about sharding and partitioning. Sharding is actually a form of horizontal partitioning. Partitioning is the broader concept of dividing data into smaller parts, while sharding distributes those part across separate database nodes. So these techniques are closely related, and in a real application, we can even combine all 3.

Let's return to our online store one last time. We could use sharding to distribute customer orders across multiple database servers. Within each shard, we could partition the orders by month, to make large datasets easier to query and manage. And! we could create replicas of each shard to improve READ capacity and availability. Now, we use replication, partitioning, _and_ sharding together, with each technique solving a different problem.

So, how do you know which one your application needs?

- If your database is struggling with too many READ requests, Replication may help distribute that workload.
- If you're dealing with very large tables, that are becoming difficult to query or maintain, partitioning may be useful.
- And if a single database server can no longer handle your storage requirements, or WRITE traffic, sharding becomes an option.

Notice that it doesn't mean every application needs all 3, so before introducing additional complexity, you should also consider optimizing slow queries. Adding the right indexes, or upgrading your existing database server. Because scaling a database isn't about using the most complicated architecture. It's about understanding what's causing the bottleneck, and choosing the right solution.
