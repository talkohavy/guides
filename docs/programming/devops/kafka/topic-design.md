# Kafka - Topic Design

## 1. Choosing the Number of Partitions

- Partitions = **maximum parallelism** of a consumer group. With 6 partitions, at most 6 consumers in a group do useful work.
- Start with something like **6-12** for a normal service topic; go higher for high-throughput topics.
- You can increase partitions later but **never decrease** them, and increasing breaks key-to-partition mapping (see [Keys, Partitioning & Ordering](./keys-partitioning-and-ordering.md)).
- Too many partitions has a cost: more open files, longer leader elections, slower rebalances.

## 2. Retention & Log Compaction

Each topic has a **cleanup policy**:

- **`delete`** (default) - messages older than `retention.ms` (default 7 days) or beyond `retention.bytes` are deleted.
- **`compact`** - Kafka keeps **only the latest message per key**. Perfect for "current state" topics like `user-profiles` or `product-prices`: a new consumer can rebuild the full current state by reading the topic from the beginning.

A message with a key and a `null` value is a **tombstone** - in a compacted topic, it deletes that key.

```js
await producer.send({
  topic: 'user-profiles',
  messages: [{ key: userId, value: null }], // delete user from the compacted view
});
```
