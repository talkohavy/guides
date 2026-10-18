# Kafka - The Transactional Outbox Pattern

## 1. The Problem

You want to save to the DB **and** publish to Kafka atomically. You can't - they're two different systems. Either can fail after the other succeeded.

## 2. The Solution

Write the event to an `outbox` table **in the same DB transaction** as your business data. A separate process reads the outbox and publishes to Kafka.

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

## 3. Implementation

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

The relay can still publish twice (crash between `send` and `UPDATE`), which is fine - your consumers are [idempotent](./idempotent-consumers.md). For higher scale, replace polling with **CDC** (Change Data Capture) using **Debezium**, which reads the DB's transaction log.
