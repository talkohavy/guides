# Kafka - Exactly-Once (Kafka Transactions)

When a consumer reads from topic A and writes results to topic B (**consume → transform → produce**), Kafka transactions can make "write output + commit input offset" atomic:

```js
const producer = kafka.producer({
  transactionalId: 'order-enricher-1', // must be stable and unique per producer instance
  idempotent: true,
  maxInFlightRequests: 1,
});

await consumer.run({
  autoCommit: false,
  eachMessage: async ({ topic, partition, message }) => {
    const tx = await producer.transaction();
    try {
      await tx.send({ topic: 'orders.enriched', messages: [{ key: message.key, value: enrich(message.value) }] });
      await tx.sendOffsets({
        consumerGroupId: 'order-enricher',
        topics: [{ topic, partitions: [{ partition, offset: (BigInt(message.offset) + 1n).toString() }] }],
      });
      await tx.commit();
    } catch (err) {
      await tx.abort();
      throw err;
    }
  },
});
```

Downstream consumers must use `readUncommitted: false` (the default) to only see committed messages.

:::warning
Exactly-once covers **only Kafka-to-Kafka** writes. The moment you write to a database or call an HTTP API, you're back to at-least-once + [idempotency](./idempotent-consumers.md).
:::
