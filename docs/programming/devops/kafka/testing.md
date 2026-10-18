# Kafka - Testing

## 1. Unit Tests

Keep business logic in plain functions (`handleOrderMessage(event)`) that don't know about Kafka. Test them without a broker.

## 2. Integration Tests

Run a real broker with [Testcontainers](https://node.testcontainers.org/modules/kafka/):

```js
import { KafkaContainer } from '@testcontainers/kafka';
import { Kafka } from 'kafkajs';

let container;
let kafka;

beforeAll(async () => {
  container = await new KafkaContainer('confluentinc/cp-kafka:7.7.0').withKraft().start();
  kafka = new Kafka({
    brokers: [`${container.getHost()}:${container.getMappedPort(9093)}`],
  });
}, 120_000);

afterAll(async () => {
  await container?.stop();
});

test('publishes OrderCreated', async () => {
  // produce, then consume with a unique groupId and assert on the message
});
```

Use a **unique `groupId` and topic name per test** to avoid tests interfering with each other.
