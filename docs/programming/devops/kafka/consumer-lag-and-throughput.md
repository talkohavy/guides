# Kafka - Consumer Lag & Throughput

## 1. Consumer Lag

**Lag** = (latest offset in the partition) − (consumer group's committed offset). It's the number of messages your service hasn't processed yet, and it's **the most important metric to monitor**.

- Lag that keeps **growing** → consumers can't keep up (scale out, if you have enough partitions, or speed up processing).
- Lag **stuck** on one partition → probably a poison pill or a hung handler.

Check it with `kafka-consumer-groups.sh --describe` (see [Useful CLI Commands](./running-kafka-locally.md#2-useful-cli-commands)), Kafka UI, or export it to Prometheus with [kafka-exporter](https://github.com/danielqsj/kafka_exporter) or Burrow.

## 2. Batch Processing with `eachBatch`

When lag grows because each message does expensive I/O, batching is often the fix. For high-throughput consumers (e.g. bulk inserts into a DB), process messages in batches:

```js
await consumer.run({
  eachBatchAutoResolve: false,
  eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
    const rows = [];
    for (const message of batch.messages) {
      if (!isRunning() || isStale()) break;
      rows.push(JSON.parse(message.value.toString()));
    }

    await db.bulkInsert('events', rows);

    // Mark only the messages we actually inserted as processed
    for (const message of batch.messages.slice(0, rows.length)) {
      resolveOffset(message.offset);
    }
    await heartbeat();
  },
});
```
