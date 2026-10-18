# Kafka - Producing Messages

## 1. The Producer

```js title="src/producer.js"
import { Partitioners, CompressionTypes } from 'kafkajs';
import { kafka } from './kafka.js';

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
  // Prevents duplicates caused by producer retries
  idempotent: true,
  maxInFlightRequests: 1,
});

await producer.connect();

export async function publishOrderCreated(order) {
  await producer.send({
    topic: 'orders',
    acks: -1, // wait for all in-sync replicas (the default; the safest option)
    compression: CompressionTypes.GZIP,
    messages: [
      {
        key: order.id, // same order → same partition → ordered
        value: JSON.stringify({
          type: 'OrderCreated',
          version: 1,
          occurredAt: new Date().toISOString(),
          data: order,
        }),
        headers: {
          'event-type': 'OrderCreated',
          'correlation-id': order.correlationId ?? '',
        },
      },
    ],
  });
}

// Send many messages in one request - much more efficient than a loop of send() calls
export async function publishMany(orders) {
  await producer.send({
    topic: 'orders',
    messages: orders.map((order) => ({
      key: order.id,
      value: JSON.stringify({ type: 'OrderCreated', version: 1, data: order }),
    })),
  });
}

export async function disconnectProducer() {
  await producer.disconnect();
}
```

## 2. Things Worth Knowing

- **Create one producer per process and reuse it.** Don't connect/disconnect per request - connecting is expensive.
- **`await` the `send()`**. If it rejects, the message was **not** written. Decide what to do: retry, return a 5xx, or save it for later (see the [transactional outbox pattern](./transactional-outbox.md)).
- **`acks`**:
  - `0` - fire and forget (fast, may lose data)
  - `1` - only the leader confirmed (data lost if the leader dies before replicating)
  - `-1` / `all` - all in-sync replicas confirmed (safe)
- **`Partitioners.DefaultPartitioner`** - KafkaJS v2 changed its default partitioner and logs a warning until you pick one explicitly. If you're migrating from v1 and need keys to land on the same partitions as before, use `Partitioners.LegacyPartitioner`.

## 3. Using It From an Express Route

```js
app.post('/orders', async (req, res) => {
  const order = await ordersRepository.create(req.body);
  await publishOrderCreated(order);
  res.status(201).json(order);
});
```

:::warning
This route has a subtle bug: if the DB write succeeds but `publishOrderCreated` fails (or the process crashes in between), the order exists but no event was ever published. See the [transactional outbox pattern](./transactional-outbox.md) for the fix.
:::
