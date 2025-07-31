# Rooms

## Introduction

In Socket.IO jargon, a room is an arbitrary channel that sockets can join and leave. It can be used to broadcast events to a subset of connected clients:

```ts
io.on('connection', (socket) => {
  // join the room named 'some room'
  socket.join('some room');

  // broadcast to all connected clients in the room
  io.to('some room').emit('hello', 'world');

  // broadcast to all connected clients except those in the room
  io.except('some room').emit('hello', 'world');

  // leave the room
  socket.leave('some room');
});
```
