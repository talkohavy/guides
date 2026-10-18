# Kafka - Running Kafka Locally

## 1. Docker Compose

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

## 2. Useful CLI Commands

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

:::tip Try it
Produce a few messages with the same key (e.g. `order-42:created`, `order-42:paid`) and a few with different keys, then consume with `print.partition=true`. You'll see every `order-42` message land in the same partition - exactly what [Keys, Partitioning & Ordering](./keys-partitioning-and-ordering.md) describes.
:::
