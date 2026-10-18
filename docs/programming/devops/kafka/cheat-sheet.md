# Kafka - Cheat Sheet

## 1. Glossary

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

## 2. Further Reading

- [Apache Kafka documentation](https://kafka.apache.org/documentation/)
- [KafkaJS documentation](https://kafka.js.org/docs/getting-started)
- [Confluent Kafka JavaScript client](https://github.com/confluentinc/confluent-kafka-javascript)
- [Confluent Developer - free courses](https://developer.confluent.io/)
- [Kafka: The Definitive Guide (O'Reilly)](https://www.confluent.io/resources/kafka-the-definitive-guide-v2/)
- [Transactional outbox pattern - microservices.io](https://microservices.io/patterns/data/transactional-outbox.html)
