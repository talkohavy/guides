# Kafka - Node.js Setup

## 1. Choosing a Client

| Library                                                                                        | Notes                                                                                                                                      |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [`kafkajs`](https://kafka.js.org/)                                                             | Pure JavaScript, great API and docs, the most common choice in tutorials. Maintenance has slowed down.                                     |
| [`@confluentinc/kafka-javascript`](https://github.com/confluentinc/confluent-kafka-javascript) | Officially supported by Confluent, built on `librdkafka` (fast, battle-tested). Offers a **KafkaJS-compatible API**, so migrating is easy. |
| [`node-rdkafka`](https://github.com/Blizzard/node-rdkafka)                                     | Also `librdkafka`-based, older, callback-style API.                                                                                        |

The examples in this guide use **`kafkajs`** because its API is the easiest to learn, and the concepts carry over 1:1 to the Confluent client's KafkaJS-compatible mode.

```bash
npm install kafkajs
```

## 2. Project Layout

```
src/
  kafka.js          # shared Kafka client
  admin.js          # create topics
  producer.js       # publish events
  consumer.js       # consume events
```

## 3. The Client

```js title="src/kafka.js"
import { Kafka, logLevel } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'orders-service',
  brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 300,
    retries: 8,
  },
  // In production (e.g. Confluent Cloud, AWS MSK) you'll typically need:
  // ssl: true,
  // sasl: {
  //   mechanism: 'plain', // or 'scram-sha-512'
  //   username: process.env.KAFKA_USERNAME,
  //   password: process.env.KAFKA_PASSWORD,
  // },
});
```

## 4. Creating Topics (Admin)

Don't rely on auto-created topics - they get default settings you probably don't want. Create topics explicitly (in a migration script, Terraform, or an operator like Strimzi).

```js title="src/admin.js"
import { kafka } from './kafka.js';

const admin = kafka.admin();

await admin.connect();

await admin.createTopics({
  waitForLeaders: true,
  topics: [
    {
      topic: 'orders',
      numPartitions: 6,
      replicationFactor: 1, // 3 in production
      configEntries: [
        { name: 'retention.ms', value: String(7 * 24 * 60 * 60 * 1000) }, // 7 days
      ],
    },
    {
      topic: 'orders.dlq',
      numPartitions: 1,
      replicationFactor: 1,
    },
  ],
});

console.log(await admin.listTopics());

await admin.disconnect();
```

`createTopics` returns `false` (instead of throwing) if the topic already exists, so it's safe to run repeatedly.
