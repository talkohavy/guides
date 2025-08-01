# Scaling horizontally

Now that our application is resilient to temporary network interruptions, let's see how we can horizontally scale it in order to be able to support thousands of concurrent clients.

:::note

- Horizontal scaling (also known as "scaling out") means adding new servers to your infrastructure to cope with new demands
- Vertical scaling (also known as "scaling up") means adding more resources (processing power, memory, storage, ...) to your existing infrastructure

:::

First step: let's use all the available cores of the host. By default, Node.js runs your Javascript code in a single thread, which means that even with a 32-core CPU, only one core will be used. Fortunately, the Node.js `cluster` module provides a convenient way to create one worker thread per core.

We will also need a way to forward events between the Socket.IO servers. We call this component an "Adapter".

![Adapter](/img/adapter-dark.png)

So let's install the cluster adapter:

```bash
pnpm add @socket.io/cluster-adapter
```

```ts
import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
// diff-add-start
import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import { createAdapter, setupPrimary } from '@socket.io/cluster-adapter';
// diff-add-end

if (cluster.isPrimary) {
  // diff-add-start
  const numCPUs = availableParallelism();
  // create one worker per available core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      PORT: 3000 + i
    });
  }

  // set up the adapter on the primary thread
  setupPrimary();
  // diff-add-end
} else {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    // set up the adapter on each worker thread
    adapter: createAdapter()
  });

  // [...]

  // diff-add-start
  // each worker will listen on a distinct port
  const port = process.env.PORT;

  server.listen(port, () => {
    console.log(`server running at http://localhost:${port}`);
  });
  // diff-add-end
}
```

That's it! This will spawn one worker thread per CPU available on your machine. Let's see it in action:

With the implementation above, we can ,for example, have 4 browsers:

- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3002`
- `http://localhost:3003`

and have each browser tab connected to a different Socket.IO server, and the adapter is simply forwarding the chat message events between them.

:::tip
There are currently 5 official adapter implementations:

- the Redis adapter
- the Redis Streams adapter
- the MongoDB adapter
- the Postgres adapter
- the Cluster adapter

So you can choose the one that best suits your needs. However, please note that some implementations do not support the **Connection state recovery** feature, you can find the compatibility matrix [here](https://socket.io/docs/v4/connection-state-recovery#compatibility-with-existing-adapters).

:::

:::note
In most cases, you would also need to ensure that all the HTTP requests of a Socket.IO session reach the same server (also known as "sticky session"). This was not needed in the simple example above though, as each Socket.IO server has its own port.

More information [here](https://socket.io/docs/v4/using-multiple-nodes/).

:::
