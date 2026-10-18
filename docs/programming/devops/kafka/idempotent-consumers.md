# Kafka - Idempotent Consumers

Because of [at-least-once delivery](./delivery-guarantees.md), your handler **will** sometimes see the same message twice. Common strategies:

## 1. Natural Idempotency

Operations that are safe to repeat:

```sql
UPDATE orders SET status = 'PAID' WHERE id = $1;          -- same result if run twice
INSERT INTO users (...) VALUES (...) ON CONFLICT (id) DO NOTHING;
```

## 2. Processed-Messages Table

Record each event ID in the **same DB transaction** as the business change:

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

## 3. Idempotency Keys for External APIs

Pass the event ID as an idempotency key to external services - e.g. Stripe's `Idempotency-Key` header - so a duplicate charge request is ignored.
