# Kafka - Production Checklist

## 1. Topics

- [ ] Replication factor **3**, `min.insync.replicas=2`
- [ ] Partition count chosen deliberately
- [ ] Retention set per topic based on business needs
- [ ] Topics created via code/IaC, auto-creation disabled

## 2. Producers

- [ ] `acks: -1` (all) + idempotent producer
- [ ] Every message has a unique event ID and a meaningful key
- [ ] Failures to `send()` are handled (or the outbox pattern is used)

## 3. Consumers

- [ ] Idempotent handlers
- [ ] Retries for transient errors, DLQ for permanent ones
- [ ] Graceful shutdown on `SIGTERM`
- [ ] Long processing calls `heartbeat()`
- [ ] Unknown event types / fields are ignored, not fatal

## 4. Operations

- [ ] Consumer lag is monitored and alerted on
- [ ] DLQ size is monitored and alerted on
- [ ] TLS + SASL authentication, ACLs per service
- [ ] Schemas documented (ideally enforced with a Schema Registry)
