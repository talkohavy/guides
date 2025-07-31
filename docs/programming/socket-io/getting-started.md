# Getting Started

## **1. On the server**

```ts
import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// diff-add-start
import { Server } from 'socket.io';
// diff-add-end

const app = express();
const server = createServer(app);
// diff-add-start
const io = new Server(server);
// diff-add-end

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// diff-add-start
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
// diff-add-end

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
```

## **2. On the client**

```tsx
import React, { useEffect, useRef } from 'react';

const socket = window.io();

export default function Chat() {
  const onHitEnter = (value: string) => {
    socket.emit('chat message', value);
  };

  return (
    <form>
      <input onChange={(e) => setText(e.target.value)} autoComplete="off" />
      <button type="button" onClick={onHitEnter}>Send</button>
    </form>
  );
};
```
