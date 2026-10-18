# Kafka - Common Pitfalls

1. **Expecting global ordering.** Order is per partition only. Use a key if order matters (see [Keys, Partitioning & Ordering](./keys-partitioning-and-ordering.md)).
2. **More consumers than partitions.** The extras sit idle. Scaling pods beyond the partition count does nothing.

   ```
   topic "orders" (3 partitions)     group "billing" (5 pods)

   ┌─────────────┐
   │ Partition 0 │ ──► pod-1   working
   │ Partition 1 │ ──► pod-2   working
   │ Partition 2 │ ──► pod-3   working
   └─────────────┘     pod-4   idle
                       pod-5   idle
   ```

   Each partition goes to exactly one pod. With 3 partitions, pods 4 and 5 are never assigned anything, so adding them does not increase throughput.

3. **Slow handlers causing rebalance storms.** If processing a message takes longer than `sessionTimeout` without heartbeats, the consumer is kicked out of the group, its partitions are reassigned, and the message gets processed again elsewhere. Call `heartbeat()` during long work, or move heavy work out of the handler.
4. **Not catching errors in `eachMessage`.** One bad message blocks the whole partition forever (poison pill). Use [retries + DLQ](./retries-and-dead-letter-queues.md).
5. **Non-idempotent handlers.** Duplicates **will** happen - on rebalances, crashes, and deploys (see [Idempotent Consumers](./idempotent-consumers.md)).
6. **Firing `send()` without `await`.** Unhandled rejections mean silently lost events.
7. **Creating a producer per request.** Create one per process at startup and reuse it.
8. **Sharing a `groupId` between different services.** They'd split the messages between them instead of each getting all of them.
9. **Huge messages.** The default max message size is ~1 MB. Store large blobs in S3 and send a reference.
10. **Relying on auto topic creation.** You get default partitions/replication. Create topics explicitly.
11. **Forgetting graceful shutdown.** Every deploy causes delayed rebalances and duplicate processing.
12. **Using `fromBeginning: true` and expecting it to replay on every restart.** It only applies when the group has no committed offsets yet. To replay, [reset offsets](./replaying-messages.md).
