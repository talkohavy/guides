# Kafka - Message Schemas & Evolution

Your topic is a **public contract** between teams. Once other services consume it, changing the payload shape carelessly breaks them.

## 1. Guidelines

- Wrap payloads in an **envelope**: `{ id, type, version, occurredAt, data }`.
- Make **backward-compatible** changes only: add optional fields, never remove or rename fields, never change a field's type.
- For breaking changes, bump `version` or publish to a new topic (`orders.v2`).
- Consumers should **ignore unknown fields and unknown event types**.

## 2. Schema Registry

For stricter guarantees, use **Avro / Protobuf / JSON Schema** with a **Schema Registry** (e.g. Confluent Schema Registry, with [`@kafkajs/confluent-schema-registry`](https://www.npmjs.com/package/@kafkajs/confluent-schema-registry) in Node). The registry rejects incompatible schema changes **before** they reach production.
