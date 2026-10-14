# Kafka - Getting Started

## 1. What is Kafka?

**Kafka** is a **distributed, append-only log**. Applications write **events** (messages) to it, and other applications read those events, at their own pace, as many times as they want.

That's the key difference from a classic message queue (RabbitMQ, SQS):

|                                              | Classic queue       | Kafka                                  |
| -------------------------------------------- | ------------------- | -------------------------------------- |
| What happens after a message is read?        | It's removed        | It **stays** (until retention expires) |
| Who tracks what was read?                    | The broker          | The **consumer** (via offsets)         |
| Can multiple services read the same message? | Needs fan-out setup | Yes, out of the box                    |
| Can you re-read old messages?                | No                  | Yes, just move the offset back         |
| Ordering                                     | Usually per queue   | Per **partition**                      |

Typical use cases:

- **Decoupling services** - `orders-service` publishes `OrderCreated`, and `billing`, `email`, and `analytics` each react independently.
- **Event-driven architecture / event sourcing** - the log is the source of truth.
- **Streaming data pipelines** - moving data between databases, search indexes, data lakes (often via Kafka Connect).
- **Activity tracking, metrics, logs** - high-throughput ingestion.

---

## 2. Core Concepts

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

### - Event (Message / Record)

A single piece of data written to Kafka. It has:

- **key** (optional) - used to decide which partition the message goes to. Example: `orderId`, `userId`.
- **value** - the payload (bytes - usually JSON, Avro, or Protobuf).
- **headers** (optional) - metadata, e.g. `correlation-id`, `event-type`, `schema-version`.
- **timestamp**

### - Topic

A named stream of events, e.g. `orders`, `user-signups`. Think of it as a table name for events.

### - Partition

Each topic is split into **partitions**. A partition is an ordered, immutable sequence of messages. Partitions are the unit of:

- **Parallelism** - more partitions means more consumers can work in parallel.
- **Ordering** - order is guaranteed **only within a partition**, never across the whole topic.

### - Offset

The position of a message inside a partition (`0`, `1`, `2`, ...). Consumers **commit** offsets to remember "I've processed everything up to here". If a consumer restarts, it continues from the last committed offset.

### - Broker

A Kafka server. A cluster is made of several brokers, and partitions are spread across them.

### - Replication

Each partition has **N replicas** (the **replication factor**, usually `3` in production) on different brokers. One replica is the **leader** (handles reads/writes), the others are **followers**. If the leader's broker dies, a follower takes over.

**ISR (In-Sync Replicas)** - the replicas that are fully caught up with the leader.

### - Producer

An application that writes messages to a topic.

### - Consumer & Consumer Group

A **consumer** reads messages from topics. Consumers are always part of a **consumer group** (identified by a `groupId`).

The rules that matter:

1. Within a group, **each partition is assigned to exactly one consumer**.
2. Different groups are completely independent - each gets **all** the messages.
3. If you have more consumers in a group than partitions, the extra consumers **sit idle**.

So: **`groupId` = "a logical application"**. All replicas (pods) of your `billing-service` share the same `groupId`. A different service uses a different `groupId`.

### - Rebalance

When a consumer joins or leaves a group (deploy, crash, scale up/down), Kafka **reassigns partitions** among the group members. During a rebalance, consumption pauses briefly. Frequent rebalances are a common source of pain (see [section 9](#9-common-pitfalls)).

### - KRaft vs. ZooKeeper

Older Kafka versions needed a separate **ZooKeeper** cluster for metadata. Modern Kafka (3.3+, and Kafka 4.0 removed ZooKeeper entirely) uses **KRaft** mode, where Kafka manages its own metadata. If a tutorial tells you to install ZooKeeper, it's outdated.

---

## 3. Keys, Partitioning & Ordering

This is the single most important design decision when producing messages.

When you send a message:

- **With a key** - Kafka hashes the key and picks a partition: `partition = hash(key) % numPartitions`. **Same key → same partition → ordered.**
- **Without a key** - messages are spread across partitions (sticky/round-robin). No ordering guarantee.

```
key = "order-42"  ──hash──►  Partition 1  ──►  OrderCreated, OrderPaid, OrderShipped (in order ✅)
key = "order-77"  ──hash──►  Partition 0  ──►  OrderCreated, OrderCancelled          (in order ✅)
```

**Rule of thumb:** use the ID of the entity whose events must stay in order as the key (`orderId`, `userId`, `accountId`).

:::warning
Adding partitions to an existing topic **changes** `hash(key) % numPartitions`, so new messages for the same key may land in a different partition than old ones. That breaks per-key ordering during the transition. Pick a reasonable partition count up front.
:::

:::tip
Watch out for **hot keys**. If 80% of your traffic has the same key (e.g. one huge tenant), 80% of the traffic goes to one partition, and one consumer does all the work.
:::

---

## 4. Delivery Guarantees

| Semantics         | Meaning                                | How you get it                                                              |
| ----------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| **At most once**  | Messages may be lost, never duplicated | Commit offset **before** processing                                         |
| **At least once** | Never lost, may be **duplicated**      | Commit offset **after** processing (default in most clients)                |
| **Exactly once**  | Never lost, never duplicated           | Kafka transactions + idempotent producer, **only** for Kafka-to-Kafka flows |

In practice, almost every backend service uses **at-least-once** delivery plus **idempotent consumers**. Assume every message can arrive more than once, and design your handlers so processing the same message twice is harmless (see [section 7.3](#73-idempotent-consumers)).

---

## 5. Running Kafka Locally

### 5.1 Docker Compose

Create a `docker-compose.yml`. It runs a single Kafka broker in KRaft mode plus [Kafka UI](https://github.com/kafbat/kafka-ui) - a web dashboard for browsing topics, messages, and consumer groups.

```yaml
services:
  kafka:
    image: apache/kafka:3.9.0
    container_name: kafka
    ports:
      - '9092:9092'
    environment:
      CLUSTER_ID: '4L6g3nShT-eMCtK--X86sw'
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      # EXTERNAL - for your Node app on the host (localhost:9092)
      # INTERNAL - for other containers (kafka:29092)
      KAFKA_LISTENERS: EXTERNAL://:9092,INTERNAL://:29092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: EXTERNAL://localhost:9092,INTERNAL://kafka:29092
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,INTERNAL:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      # Single broker, so internal topics can't be replicated
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR: 1
      KAFKA_TRANSACTION_STATE_LOG_MIN_ISR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      KAFKA_NUM_PARTITIONS: 3
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: 'false'

  kafka-ui:
    image: ghcr.io/kafbat/kafka-ui:latest
    container_name: kafka-ui
    ports:
      - '8080:8080'
    environment:
      KAFKA_CLUSTERS_0_NAME: local
      KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS: kafka:29092
    depends_on:
      - kafka
```

```bash
docker compose up -d
```

Open [http://localhost:8080](http://localhost:8080) to see the UI.

:::info Why two listeners?
Kafka tells clients **which address to connect to** (the "advertised listener"). Your Node app on the host needs `localhost:9092`, while Kafka UI inside Docker needs `kafka:29092`. Getting this wrong is the #1 cause of "I can connect but nothing works" errors locally.
:::

### 5.2 Useful CLI Commands

The CLI tools live inside the container at `/opt/kafka/bin`.

```bash
# Create a topic
docker exec -it kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 \
  --create --topic orders --partitions 3 --replication-factor 1

# List topics
docker exec -it kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --list

# Describe a topic (partitions, leaders, replicas)
docker exec -it kafka /opt/kafka/bin/kafka-topics.sh \
  --bootstrap-server localhost:9092 --describe --topic orders

# Produce messages from the terminal (format: key:value)
docker exec -it kafka /opt/kafka/bin/kafka-console-producer.sh \
  --bootstrap-server localhost:9092 --topic orders \
  --property parse.key=true --property key.separator=:

# Consume messages from the beginning, printing keys and partitions
docker exec -it kafka /opt/kafka/bin/kafka-console-consumer.sh \
  --bootstrap-server localhost:9092 --topic orders --from-beginning \
  --property print.key=true --property print.partition=true --property print.offset=true

# List consumer groups
docker exec -it kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 --list

# Describe a consumer group - shows LAG per partition
docker exec -it kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 --describe --group billing-service

# Reset a group's offsets to the beginning (the group must be stopped)
docker exec -it kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 --group billing-service --topic orders \
  --reset-offsets --to-earliest --execute
```

---

## 6. Kafka in Node.js

### 6.1 Choosing a Client

| Library                                                                                        | Notes                                                                                                                                      |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| [`kafkajs`](https://kafka.js.org/)                                                             | Pure JavaScript, great API and docs, the most common choice in tutorials. Maintenance has slowed down.                                     |
| [`@confluentinc/kafka-javascript`](https://github.com/confluentinc/confluent-kafka-javascript) | Officially supported by Confluent, built on `librdkafka` (fast, battle-tested). Offers a **KafkaJS-compatible API**, so migrating is easy. |
| [`node-rdkafka`](https://github.com/Blizzard/node-rdkafka)                                     | Also `librdkafka`-based, older, callback-style API.                                                                                        |

The examples below use **`kafkajs`** because its API is the easiest to learn, and the concepts carry over 1:1 to the Confluent client's KafkaJS-compatible mode.

```bash
npm install kafkajs
```

### 6.2 Project Layout

```
src/
  kafka.js          # shared Kafka client
  admin.js          # create topics
  producer.js       # publish events
  consumer.js       # consume events
```

### 6.3 The Client

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

### 6.4 Creating Topics (Admin)

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

### 6.5 Producer

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

Things worth knowing:

- **Create one producer per process and reuse it.** Don't connect/disconnect per request - connecting is expensive.
- **`await` the `send()`**. If it rejects, the message was **not** written. Decide what to do: retry, return a 5xx, or save it for later (see the [outbox pattern](#81-the-transactional-outbox-pattern)).
- **`acks`**:
  - `0` - fire and forget (fast, may lose data)
  - `1` - only the leader confirmed (data lost if the leader dies before replicating)
  - `-1` / `all` - all in-sync replicas confirmed (safe)
- **`Partitioners.DefaultPartitioner`** - KafkaJS v2 changed its default partitioner and logs a warning until you pick one explicitly. If you're migrating from v1 and need keys to land on the same partitions as before, use `Partitioners.LegacyPartitioner`.

Using it from an Express route:

```js
app.post('/orders', async (req, res) => {
  const order = await ordersRepository.create(req.body);
  await publishOrderCreated(order);
  res.status(201).json(order);
});
```

:::warning
This route has a subtle bug: if the DB write succeeds but `publishOrderCreated` fails (or the process crashes in between), the order exists but no event was ever published. See the [transactional outbox pattern](#81-the-transactional-outbox-pattern) for the fix.
:::

### 6.6 Consumer

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

How offsets get committed here:

- By default, **`autoCommit` is on**. KafkaJS commits the offset of a message only **after** `eachMessage` resolves (batched every few seconds). That gives you **at-least-once** delivery.
- If `eachMessage` **throws**, the offset is not committed, KafkaJS retries the message, and if it keeps failing the consumer crashes and restarts - **re-processing the same message forever**. That's a "poison pill". Handle errors deliberately (next section).
- If the process crashes after processing but before the commit, the message is processed again on restart → **duplicates are normal**. Make handlers idempotent.

### 6.7 Graceful Shutdown

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

### 6.8 Consumer Events (Observability)

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

---

## 7. Error Handling Patterns

### 7.1 Classify Your Errors

Not every error deserves a retry:

| Error type    | Examples                                                          | What to do                      |
| ------------- | ----------------------------------------------------------------- | ------------------------------- |
| **Transient** | DB timeout, 503 from another service, network blip                | Retry with backoff              |
| **Permanent** | Invalid JSON, schema violation, business rule ("order not found") | Don't retry - send to a **DLQ** |

### 7.2 Retries + Dead Letter Queue (DLQ)

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

### 7.3 Idempotent Consumers

Because of at-least-once delivery, your handler **will** sometimes see the same message twice. Common strategies:

**1. Natural idempotency** - operations that are safe to repeat:

```sql
UPDATE orders SET status = 'PAID' WHERE id = $1;          -- same result if run twice
INSERT INTO users (...) VALUES (...) ON CONFLICT (id) DO NOTHING;
```

**2. Processed-messages table** - record each event ID in the **same DB transaction** as the business change:

```sql
CREATE TABLE processed_events (
  consumer_group TEXT NOT NULL,
  event_id       TEXT NOT NULL,
  processed_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (consumer_group, event_id)
);
```

```js
async function handleOnce(event, fn) {
  await db.transaction(async (tx) => {
    const { rowCount } = await tx.query(
      `INSERT INTO processed_events (consumer_group, event_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      ['billing-service', event.id],
    );
    if (rowCount === 0) return; // already processed - skip
    await fn(tx);
  });
}
```

This only works if every event has a **unique ID**, so always include one (e.g. a UUID) when producing.

**3. Idempotency keys for external APIs** - e.g. pass the event ID as Stripe's `Idempotency-Key` header, so a duplicate charge request is ignored.

---

## 8. Intermediate Topics

### 8.1 The Transactional Outbox Pattern

**Problem:** you want to save to the DB **and** publish to Kafka atomically. You can't - they're two different systems. Either can fail after the other succeeded.

**Solution:** write the event to an `outbox` table **in the same DB transaction** as your business data. A separate process reads the outbox and publishes to Kafka.

```
┌─────────────── single DB transaction ───────────────┐
│  INSERT INTO orders (...)                            │
│  INSERT INTO outbox (topic, key, payload) (...)      │
└──────────────────────────────────────────────────────┘
                         │
                         ▼
          Outbox relay (polling or CDC with Debezium)
                         │
                         ▼
                   Kafka topic "orders"
```

```js
// In the request handler
await db.transaction(async (tx) => {
  const order = await tx.orders.insert(req.body);
  await tx.outbox.insert({
    id: crypto.randomUUID(),
    topic: 'orders',
    key: order.id,
    payload: JSON.stringify({ type: 'OrderCreated', data: order }),
  });
});

// A simple polling relay (runs in a loop / worker)
async function relayOutbox() {
  const rows = await db.query(
    `SELECT * FROM outbox WHERE published_at IS NULL
     ORDER BY created_at LIMIT 100
     FOR UPDATE SKIP LOCKED`,
  );
  if (rows.length === 0) return;

  await producer.send({
    topic: 'orders',
    messages: rows.map((r) => ({ key: r.key, value: r.payload, headers: { 'event-id': r.id } })),
  });

  await db.query(`UPDATE outbox SET published_at = now() WHERE id = ANY($1)`, [rows.map((r) => r.id)]);
}
```

The relay can still publish twice (crash between `send` and `UPDATE`), which is fine - your consumers are idempotent. For higher scale, replace polling with **CDC** (Change Data Capture) using **Debezium**, which reads the DB's transaction log.

### 8.2 Message Schemas & Evolution

Your topic is a **public contract** between teams. Once other services consume it, changing the payload shape carelessly breaks them.

Guidelines:

- Wrap payloads in an **envelope**: `{ id, type, version, occurredAt, data }`.
- Make **backward-compatible** changes only: add optional fields, never remove or rename fields, never change a field's type.
- For breaking changes, bump `version` or publish to a new topic (`orders.v2`).
- Consumers should **ignore unknown fields and unknown event types**.

For stricter guarantees, use **Avro / Protobuf / JSON Schema** with a **Schema Registry** (e.g. Confluent Schema Registry, with [`@kafkajs/confluent-schema-registry`](https://www.npmjs.com/package/@kafkajs/confluent-schema-registry) in Node). The registry rejects incompatible schema changes **before** they reach production.

### 8.3 Choosing the Number of Partitions

- Partitions = **maximum parallelism** of a consumer group. With 6 partitions, at most 6 consumers in a group do useful work.
- Start with something like **6-12** for a normal service topic; go higher for high-throughput topics.
- You can increase partitions later but **never decrease** them, and increasing breaks key-to-partition mapping (see [section 3](#3-keys-partitioning--ordering)).
- Too many partitions has a cost: more open files, longer leader elections, slower rebalances.

### 8.4 Retention & Log Compaction

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

### 8.5 Consumer Lag

**Lag** = (latest offset in the partition) − (consumer group's committed offset). It's the number of messages your service hasn't processed yet, and it's **the most important metric to monitor**.

- Lag that keeps **growing** → consumers can't keep up (scale out, if you have enough partitions, or speed up processing).
- Lag **stuck** on one partition → probably a poison pill or a hung handler.

Check it with `kafka-consumer-groups.sh --describe` (see [section 5.2](#52-useful-cli-commands)), Kafka UI, or export it to Prometheus with [kafka-exporter](https://github.com/danielqsj/kafka_exporter) or Burrow.

### 8.6 Batch Processing with `eachBatch`

For high-throughput consumers (e.g. bulk inserts into a DB), process messages in batches:

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

### 8.7 Replaying Messages

One of Kafka's superpowers: fixed a bug in your consumer? **Reprocess history** by resetting the group's offsets.

```bash
# Stop all consumers in the group first, then:
docker exec -it kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 --group billing-service --topic orders \
  --reset-offsets --to-datetime 2026-10-01T00:00:00.000 --execute
```

Other options: `--to-earliest`, `--to-latest`, `--shift-by -100`, `--to-offset 42`. Replace `--execute` with `--dry-run` to preview. (This is another reason why idempotent consumers matter.)

### 8.8 Exactly-Once (Kafka Transactions)

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
Exactly-once covers **only Kafka-to-Kafka** writes. The moment you write to a database or call an HTTP API, you're back to at-least-once + idempotency.
:::

---

## 9. Common Pitfalls

1. **Expecting global ordering.** Order is per partition only. Use a key if order matters.
2. **More consumers than partitions.** The extras sit idle. Scaling pods beyond the partition count does nothing.
3. **Slow handlers causing rebalance storms.** If processing a message takes longer than `sessionTimeout` without heartbeats, the consumer is kicked out of the group, its partitions are reassigned, and the message gets processed again elsewhere. Call `heartbeat()` during long work, or move heavy work out of the handler.
4. **Not catching errors in `eachMessage`.** One bad message blocks the whole partition forever (poison pill). Use retries + DLQ.
5. **Non-idempotent handlers.** Duplicates **will** happen - on rebalances, crashes, and deploys.
6. **Firing `send()` without `await`.** Unhandled rejections mean silently lost events.
7. **Creating a producer per request.** Create one per process at startup and reuse it.
8. **Sharing a `groupId` between different services.** They'd split the messages between them instead of each getting all of them.
9. **Huge messages.** The default max message size is ~1 MB. Store large blobs in S3 and send a reference.
10. **Relying on auto topic creation.** You get default partitions/replication. Create topics explicitly.
11. **Forgetting graceful shutdown.** Every deploy causes delayed rebalances and duplicate processing.
12. **Using `fromBeginning: true` and expecting it to replay on every restart.** It only applies when the group has no committed offsets yet. To replay, reset offsets.

---

## 10. Testing

- **Unit tests** - keep business logic in plain functions (`handleOrderMessage(event)`) that don't know about Kafka. Test them without a broker.
- **Integration tests** - run a real broker with [Testcontainers](https://node.testcontainers.org/modules/kafka/):

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

---

## 11. Production Checklist

**Topics**

- [ ] Replication factor **3**, `min.insync.replicas=2`
- [ ] Partition count chosen deliberately
- [ ] Retention set per topic based on business needs
- [ ] Topics created via code/IaC, auto-creation disabled

**Producers**

- [ ] `acks: -1` (all) + idempotent producer
- [ ] Every message has a unique event ID and a meaningful key
- [ ] Failures to `send()` are handled (or the outbox pattern is used)

**Consumers**

- [ ] Idempotent handlers
- [ ] Retries for transient errors, DLQ for permanent ones
- [ ] Graceful shutdown on `SIGTERM`
- [ ] Long processing calls `heartbeat()`
- [ ] Unknown event types / fields are ignored, not fatal

**Operations**

- [ ] Consumer lag is monitored and alerted on
- [ ] DLQ size is monitored and alerted on
- [ ] TLS + SASL authentication, ACLs per service
- [ ] Schemas documented (ideally enforced with a Schema Registry)

---

## 12. Cheat Sheet

| Term               | One-liner                                                         |
| ------------------ | ----------------------------------------------------------------- |
| Topic              | Named stream of events                                            |
| Partition          | Ordered shard of a topic; unit of parallelism and ordering        |
| Offset             | Position of a message in a partition                              |
| Key                | Decides the partition; same key = same partition = ordered        |
| Broker             | A Kafka server                                                    |
| Replication factor | How many copies of each partition exist                           |
| Consumer group     | A set of consumers sharing the work; one partition → one consumer |
| Rebalance          | Reassigning partitions when group membership changes              |
| Lag                | How far behind a consumer group is                                |
| DLQ                | Topic for messages that couldn't be processed                     |
| Compaction         | Keep only the latest value per key                                |
| Tombstone          | Message with `null` value; deletes a key in a compacted topic     |
| Outbox             | DB table used to publish events atomically with business data     |

---

## 13. Further Reading

- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
- [KafkaJS documentation](https://kafka.js.org/docs/getting-started)
- [Confluent Kafka JavaScript client](https://github.com/confluentinc/confluent-kafka-javascript)
- [Confluent Developer - free courses](https://developer.confluent.io/)
- [Kafka: The Definitive Guide (O'Reilly)](https://www.confluent.io/resources/kafka-the-definitive-guide-v2/)
- [Transactional outbox pattern - microservices.io](https://microservices.io/patterns/data/transactional-outbox.html)
