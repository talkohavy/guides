# Kafka - Delivery Guarantees

| Semantics         | Meaning                                | How you get it                                                              |
| ----------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| **At most once**  | Messages may be lost, never duplicated | Commit offset **before** processing                                         |
| **At least once** | Never lost, may be **duplicated**      | Commit offset **after** processing (default in most clients)                |
| **Exactly once**  | Never lost, never duplicated           | Kafka transactions + idempotent producer, **only** for Kafka-to-Kafka flows |

In practice, almost every backend service uses **at-least-once** delivery plus **idempotent consumers**. Assume every message can arrive more than once, and design your handlers so processing the same message twice is harmless (see [Idempotent Consumers](./idempotent-consumers.md)).

Exactly-once has its own page later in the guide: [Exactly-Once (Kafka Transactions)](./exactly-once.md).
