# Kafka - Replaying Messages

One of Kafka's superpowers: fixed a bug in your consumer? **Reprocess history** by resetting the group's offsets.

```bash
# Stop all consumers in the group first, then:
docker exec -it kafka /opt/kafka/bin/kafka-consumer-groups.sh \
  --bootstrap-server localhost:9092 --group billing-service --topic orders \
  --reset-offsets --to-datetime 2026-10-01T00:00:00.000 --execute
```

Other options: `--to-earliest`, `--to-latest`, `--shift-by -100`, `--to-offset 42`. Replace `--execute` with `--dry-run` to preview.

:::info
This is another reason why [idempotent consumers](./idempotent-consumers.md) matter - a replay re-delivers messages your service has already processed.
:::
