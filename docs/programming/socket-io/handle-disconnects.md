# Handle Disconnects

## 1. Introduction

Now, let's highlight two really important properties of Socket.IO:

1. a Socket.IO client is not always connected
2. a Socket.IO server does not store any event

:::caution
Even over a stable network, it is not possible to maintain a connection alive forever.
:::

Which means that your application needs to be able to **synchronize the local state** of the client with the **global state on the server** after a temporary disconnection.

:::note
The Socket.IO client will automatically try to reconnect after a small delay. However, any missed event during the disconnection period will effectively be lost for this client.
:::

In the context of our chat application, this implies that a disconnected client might miss some messages:

![response headers](/img/disconnected-dark.png)

---

## 2. Connection state recovery

First, let's handle disconnections by pretending that there was no disconnection: this feature is called "Connection state recovery".

This feature will temporarily store all the events that are sent by the server and will try to restore the state of a client when it reconnects:

- restore its rooms
- send any missed events

It must be enabled on the server side:

```ts
const io = new Server(server, {
  // diff-add-start
  connectionStateRecovery: {}
  // diff-add-end
});
```

Now, you may ask:

> But this is an awesome feature, why isn't this enabled by default?

There are several reasons for this:

- it doesn't always work, for example if the server abruptly crashes or gets restarted, then the client state might not be saved
- it is not always possible to enable this feature when scaling up

:::tip
That being said, it is indeed a great feature since you don't have to synchronize the state of the client after a temporary disconnection (for example, when the user switches from WiFi to 4G).
:::

---

## 3. Server delivery

"Server delivery" is all _about what to do when the client reconnects_.  
More specifically, **how to resume client state after a reconnection**. We use the term "Server delivery" as a context of "the server **delivers the state** to the client".

The most common case is:

> The server was about to send some update/messages to the client, but the client was temporarily disconnected, and is soon to be reconnected with the `socket.recovered` set to true.

There are two common ways to synchronize the state of the client upon reconnection:

- either the server sends the whole state
- or the client keeps track of the last event it has processed and the server sends the missing pieces

Both are totally valid solutions and choosing one will depend on your use case. In this tutorial, we will go with the latter.

First, let's persist the messages of our chat application. We will store each message in a database.

In our implementation example, we will use SQLite:

```ts
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
// diff-add-start
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// open the database file
const db = await open({
  filename: 'chat.db',
  driver: sqlite3.Database
});

// create our 'messages' table (you can ignore the 'client_offset' column for now)
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT
  );
`);
// diff-add-end

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {}
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  socket.on('chat message', async (msg) => {
    // diff-add-start
    let result;
    try {
      // store the message in the database
      result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
    } catch (e) {
      // TODO handle the failure
      return;
    }
    // include the offset with the message
    io.emit('chat message', msg, result.lastID);
    // diff-add-end
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
```

The client will then keep track of the offset:

```html
<script>
  // diff-add-start
  const socket = io({
    auth: {
      serverOffset: 0
    }
  });
  // diff-add-end

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });

  // diff-add-start
  socket.on('chat message', (msg, serverOffset) => {
  // diff-add-end
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    // diff-add-start
    socket.auth.serverOffset = serverOffset;
    // diff-add-end
  });
</script>
```

And finally the server will send the missing messages upon (re)connection:

```ts
// [...]

io.on('connection', async (socket) => {
  socket.on('chat message', async (msg) => {
    let result;
    try {
      result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
    } catch (e) {
      // TODO handle the failure
      return;
    }
    io.emit('chat message', msg, result.lastID);
  });

  // diff-add-start
  if (!socket.recovered) {
    // if the connection state recovery was not successful
    try {
      await db.each('SELECT id, content FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('chat message', row.content, row.id);
        }
      )
    } catch (e) {
      // something went wrong
    }
  }
  // diff-add-end
});

// [...]
```

As you will notice, it works:

- after a temporary disconnection (of the client)
- and after a full page refresh

OK, now let's talk about the client delivery.

---

## 4. Client Delivery

Let's see how we can make sure that the server always receives the messages sent by the clients.

:::info
By default, Socket.IO provides an "at most once" guarantee of delivery (also known as "fire and forget"), which means that there will be no retry in case the message does not reach the server.
:::

### A. Buffered events

When a client gets disconnected, any call to `socket.emit()` is buffered until reconnection:

When the sender gets disconnected, and is trying to send messages while offline, the "realtime" message is buffered until the connection is reestablished.

This behavior might be totally sufficient for your application. However, there are a few cases where a message could be lost:

- the connection is severed while the event is being sent
- the server crashes or get restarted while processing the event
- the database is temporarily not available

### B. At least once

We can implement an "at least once" guarantee:

manually with an acknowledgement:

```ts
function emit(socket, event, arg) {
  socket.timeout(5000).emit(event, arg, (err) => {
    if (err) {
      // no ack from the server, let's retry
      emit(socket, event, arg);
    }
  });
}

emit(socket, 'hello', 'world');
```

or with the `retries` option:

```ts
const socket = io({
  ackTimeout: 10000,
  retries: 3
});

socket.emit('hello', 'world');
```

In both cases, the client will retry to send the message until it gets an acknowledgement from the server:

```ts
io.on('connection', (socket) => {
  socket.on('hello', (value, callback) => {
    // once the event is successfully handled
    callback();
  });
})
```

:::tip
With the `retries` option, the order of the messages is guaranteed, as the messages are queued and sent one by one. This is not the case with the first option.
:::

### C. Exactly once

The problem with retries is that the server might now receive the same message multiple times, so it needs a way to uniquely identify each message, and only store it once in the database.

Let's see how we can implement an "exactly once" guarantee in our chat application.

We will start by assigning a unique identifier to each message on the client side:

```html
<script>
  // diff-add-start
  let counter = 0;
  // diff-add-end

  const socket = io({
    auth: {
      serverOffset: 0
    },
    // diff-add-start
    // enable retries
    ackTimeout: 10000,
    retries: 3,
    // diff-add-end
  });

  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
      // diff-add-start
      // compute a unique offset
      const clientOffset = `${socket.id}-${counter++}`;
      socket.emit('chat message', input.value, clientOffset);
      // diff-add-end
      input.value = '';
    }
  });

  socket.on('chat message', (msg, serverOffset) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset;
  });
</script>
```

:::note
The `socket.id` attribute is a random 20-characters identifier which is assigned to each connection.

We could also have used `getRandomValues()` to generate a unique offset.
:::

And then we store this offset alongside the message on the server side:

```ts title=index.ts
// [...]

io.on('connection', async (socket) => {
  // diff-add-start
  socket.on('chat message', async (msg, clientOffset, callback) => {
  // diff-add-end
    let result;
    try {
      // diff-add-start
      result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
      // diff-add-end
    } catch (e) {
      // diff-add-start
      if (e.errno === 19 /* SQLITE_CONSTRAINT */ ) {
        // the message was already inserted, so we notify the client
        callback();
      } else {
        // nothing to do, just let the client retry
      }
      return;
      // diff-add-end
    }
    io.emit('chat message', msg, result.lastID);
    // diff-add-start
    // acknowledge the event
    callback();
    // diff-add-end
  });

  if (!socket.recovered) {
    try {
      await db.each('SELECT id, content FROM messages WHERE id > ?',
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit('chat message', row.content, row.id);
        }
      )
    } catch (e) {
      // something went wrong
    }
  }
});

// [...]
```

This way, the UNIQUE constraint on the `client_offset` column prevents the duplication of the message.

:::caution
Do not forget to acknowledge the event, or else the client will keep retrying (up to `retries` times).

```ts
socket.on('chat message', async (msg, clientOffset, callback) => {
  // ... and finally
  callback();
});
```

:::

:::info
Again, the default guarantee ("at most once") might be sufficient for your application, but now you know how it can be made more reliable.
:::

In the next step, we will see how we can scale our application horizontally.
