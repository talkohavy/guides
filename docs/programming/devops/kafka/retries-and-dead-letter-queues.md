# Kafka - Retries & Dead Letter Queues

## 1. Classify Your Errors

Not every error deserves a retry:

| Error type    | Examples                                                          | What to do                      |
| ------------- | ----------------------------------------------------------------- | ------------------------------- |
| **Transient** | DB timeout, 503 from another service, network blip                | Retry with backoff              |
| **Permanent** | Invalid JSON, schema violation, business rule ("order not found") | Don't retry - send to a **DLQ** |

## 2. Retries + Dead Letter Queue (DLQ)

A **DLQ** is a separate topic where messages that can't be processed end up, so they don't block the partition. You can inspect them later, fix the bug, and replay them.

```js title="src/consumer.js"
import { kafka } from './kafka.js';

const consumer = kafka.consumer({ groupId: 'billing-service' });
const producer = kafka.producer();

class PermanentError extends Error {}

const MAX_ATTEMPTS = 3;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function processWithRetry(handler, message, heartbeat) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await handler(message);
    } catch (err) {
      if (err instanceof PermanentError || attempt >= MAX_ATTEMPTS) throw err;
      await sleep(2 ** attempt * 200); // 400ms, 800ms, ...
      await heartbeat();
    }
  }
}

async function sendToDlq({ topic, partition, message }, err) {
  await producer.send({
    topic: `${topic}.dlq`,
    messages: [
      {
        key: message.key,
        value: message.value,
        headers: {
          ...message.headers,
          'dlq-original-topic': topic,
          'dlq-original-partition': String(partition),
          'dlq-original-offset': message.offset,
          'dlq-error': err.message,
          'dlq-failed-at': new Date().toISOString(),
        },
      },
    ],
  });
}

async function handleOrderMessage(message) {
  let event;
  try {
    event = JSON.parse(message.value.toString());
  } catch {
    throw new PermanentError('Invalid JSON');
  }
  if (event.type === 'OrderCreated') {
    await chargeCustomer(event.data);
  }
}

await Promise.all([consumer.connect(), producer.connect()]);
await consumer.subscribe({ topics: ['orders'] });

await consumer.run({
  eachMessage: async ({ topic, partition, message, heartbeat }) => {
    try {
      await processWithRetry(handleOrderMessage, message, heartbeat);
    } catch (err) {
      console.error('Sending message to DLQ', { topic, partition, offset: message.offset, err });
      // If this throws (Kafka is down), let it bubble up - the message will be retried
      await sendToDlq({ topic, partition, message }, err);
    }
  },
});
```

:::tip
In-process retries **block the partition** while they wait. Keep them short (seconds). For longer delays (minutes/hours), use dedicated **retry topics** (`orders.retry.1m`, `orders.retry.10m`) consumed by a worker that waits until the message is due before re-processing it.
:::
