# Kafka - Core Concepts

```
                        Kafka Cluster
             ┌───────────────────────────────────┐
             │  Topic: orders                    │
             │                                   │
Producer ──► │  Partition 0: [0][1][2][3][4] ──► │ ──► Consumer Group "billing"
             │  Partition 1: [0][1][2]       ──► │       ├─ consumer A (P0, P1)
             │  Partition 2: [0][1][2][3]    ──► │       └─ consumer B (P2)
             │                                   │
             │                                   │ ──► Consumer Group "email"
             │                                   │       └─ consumer C (P0, P1, P2)
             └───────────────────────────────────┘
```

## - Event (Message / Record)

A single piece of data written to Kafka. It has:

- **key** (optional) - used to decide which partition the message goes to. Example: `orderId`, `userId`.
- **value** - the payload (bytes - usually JSON, Avro, or Protobuf).
- **headers** (optional) - metadata, e.g. `correlation-id`, `event-type`, `schema-version`.
- **timestamp**

## - Topic

A named stream of events, e.g. `orders`, `user-signups`. Think of it as a table name for events.

## - Partition

Each topic is split into **partitions**. A partition is an ordered, immutable sequence of messages. Partitions are the unit of:

- **Parallelism** - more partitions means more consumers can work in parallel.
- **Ordering** - order is guaranteed **only within a partition**, never across the whole topic.

## - Offset

The position of a message inside a partition (`0`, `1`, `2`, ...). Consumers **commit** offsets to remember "I've processed everything up to here". If a consumer restarts, it continues from the last committed offset. Important Note: the **consumer decides when** to commit, and **Kafka itself stores** the committed offset, on the brokers.

## - Broker

A **broker** is a **Kafka server**. A cluster is made of several brokers, and partitions are spread across them.

## - Replication

Each partition has **N replicas** (the **replication factor**, usually `3` in production) on different brokers. One replica is the **leader** (handles reads/writes), the others are **followers**. If the leader's broker dies, a follower takes over.

**ISR (In-Sync Replicas)** - the replicas that are fully caught up with the leader.

## - Producer

An application that writes messages to a topic.

## - Consumer & Consumer Group

A **consumer** reads messages from topics. Consumers are always part of a **consumer group** (identified by a `groupId`).

From the rules below we will understand that **there should be more partitions than there are consumers**.  
Before we talk about kafka rules, let's talk about some important key factors:

- `Group & Group ID`: usually we consider a the name of the application/service as a group. For example, **orders** service is defined with groupId of "orders".
- `partition count`: Stratigically speaking, the partition count should be at least the numbers of pods for that service. We will soon se why.
- One group often subscribes to one topic, and that is the usual setup, but Kafka does not bind a group to a single topic.
- `different groups`:

Let's see why. The rules that matter:

1. Within a group, **each partition is assigned to exactly one consumer**. The partition rule applies **inside one group, for one topic**.
2. Different groups are completely independent - each gets **all** the messages.
3. If you have more consumers in a group than partitions, the extra consumers **sit idle**.

   ```
   topic "orders" (3 partitions)     group "billing" (5 pods)

   ┌─────────────┐
   │ Partition 0 │ ──► pod-1   working
   │ Partition 1 │ ──► pod-2   working
   │ Partition 2 │ ──► pod-3   working
   └─────────────┘     pod-4   idle
                       pod-5   idle
   ```

So: **`groupId` = "a logical application"**. All replicas (pods) of your `billing-service` share the same `groupId`. A different service uses a different `groupId`.

## - Rebalance

When a consumer joins or leaves a group (deploy, crash, scale up/down), Kafka **reassigns partitions** among the group members. During a rebalance, consumption pauses briefly. Frequent rebalances are a common source of pain (see [Common Pitfalls](./common-pitfalls.md)).

## - KRaft vs. ZooKeeper

Older Kafka versions needed a separate **ZooKeeper** cluster for metadata. Modern Kafka (3.3+, and Kafka 4.0 removed ZooKeeper entirely) uses **KRaft** mode, where Kafka manages its own metadata. If a tutorial tells you to install ZooKeeper, it's outdated.
