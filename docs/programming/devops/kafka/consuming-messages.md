# Kafka - Consuming Messages

## 1. The Consumer

```js title="src/consumer.js"
import { kafka } from './kafka.js';

const consumer = kafka.consumer({
  groupId: 'billing-service',
  sessionTimeout: 30_000, // consumer considered dead if no heartbeat within this window
  heartbeatInterval: 3_000,
});

await consumer.connect();

await consumer.subscribe({
  topics: ['orders'],
  // Only applies when the group has NO committed offsets yet (first ever run).
  // false = start from new messages only; true = read the whole history.
  fromBeginning: false,
});

await consumer.run({
  // How many partitions to process in parallel within this one process.
  // Order is still preserved inside each partition.
  partitionsConsumedConcurrently: 3,

  eachMessage: async ({ topic, partition, message, heartbeat }) => {
    const event = JSON.parse(message.value.toString());

    console.log({
      topic,
      partition,
      offset: message.offset,
      key: message.key?.toString(),
      type: event.type,
    });

    switch (event.type) {
      case 'OrderCreated':
        await chargeCustomer(event.data);
        break;
      default:
        // Unknown events should not crash the consumer - newer producers may add types
        break;
    }

    // For long-running work, call heartbeat() periodically
    // so the group coordinator knows this consumer is still alive
    await heartbeat();
  },
});
```

## 2. How Offsets Get Committed

- By default, **`autoCommit` is on**. KafkaJS commits the offset of a message only **after** `eachMessage` resolves (batched every few seconds). That gives you **at-least-once** delivery.
- If `eachMessage` **throws**, the offset is not committed, KafkaJS retries the message, and if it keeps failing the consumer crashes and restarts - **re-processing the same message forever**. That's a "poison pill". Handle errors deliberately (see [Retries & Dead Letter Queues](./retries-and-dead-letter-queues.md)).
- If the process crashes after processing but before the commit, the message is processed again on restart → **duplicates are normal**. Make handlers idempotent (see [Idempotent Consumers](./idempotent-consumers.md)).

## 3. Graceful Shutdown

Always disconnect on shutdown. Otherwise the group waits for `sessionTimeout` before it notices your consumer is gone, and its partitions sit unprocessed in the meantime. Disconnecting also commits the latest offsets.

```js
const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down`);
  try {
    await consumer.disconnect();
    await disconnectProducer();
  } finally {
    process.exit(0);
  }
};

process.once('SIGTERM', shutdown); // Kubernetes sends SIGTERM on pod termination
process.once('SIGINT', shutdown); // Ctrl+C
```

## 4. Consumer Events (Observability)

```js
const { CRASH, REBALANCING, GROUP_JOIN } = consumer.events;

consumer.on(GROUP_JOIN, ({ payload }) => {
  console.log('Joined group, assigned:', payload.memberAssignment);
});

consumer.on(REBALANCING, () => console.warn('Rebalancing...'));

consumer.on(CRASH, ({ payload }) => {
  console.error('Consumer crashed', payload.error);
  // payload.restart tells you whether KafkaJS will restart it automatically
});
```
