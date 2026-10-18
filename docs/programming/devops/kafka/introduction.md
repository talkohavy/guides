# Kafka - Introduction

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

## 2. Typical Use Cases

- **Decoupling services** - `orders-service` publishes `OrderCreated`, and `billing`, `email`, and `analytics` each react independently.
- **Event-driven architecture / event sourcing** - the log is the source of truth.
- **Streaming data pipelines** - moving data between databases, search indexes, data lakes (often via Kafka Connect).
- **Activity tracking, metrics, logs** - high-throughput ingestion.
