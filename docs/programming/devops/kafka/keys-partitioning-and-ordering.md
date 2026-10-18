# Kafka - Keys, Partitioning & Ordering

This is the single most important design decision when producing messages.

## 1. How a Message Picks a Partition

When you send a message:

- **With a key** - Kafka hashes the key and picks a partition: `partition = hash(key) % numPartitions`. **Same key → same partition → ordered.**
- **Without a key** - messages are spread across partitions (sticky/round-robin). No ordering guarantee.

```
key = "order-42"  ──hash──►  Partition 1  ──►  OrderCreated, OrderPaid, OrderShipped (in order ✅)
key = "order-77"  ──hash──►  Partition 0  ──►  OrderCreated, OrderCancelled          (in order ✅)
```

## 2. Choosing a Key

**Rule of thumb:** use the ID of the entity whose events must stay in order as the key (`orderId`, `userId`, `accountId`).

:::warning
Adding partitions to an existing topic **changes** `hash(key) % numPartitions`, so new messages for the same key may land in a different partition than old ones. That breaks per-key ordering during the transition. Pick a reasonable partition count up front (see [Topic Design](./topic-design.md)).
:::

:::tip
Watch out for **hot keys**. If 80% of your traffic has the same key (e.g. one huge tenant), 80% of the traffic goes to one partition, and one consumer does all the work.
:::
