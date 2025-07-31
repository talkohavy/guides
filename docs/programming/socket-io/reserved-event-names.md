# Reserved Event Names

:::caution

The following event names are reserved and must not be used in your application:

- `connect`
- `connect_error`
- `disconnect`
- `disconnecting`
- `newListener`
- `removeListener`

```js
// BAD, will throw an error
socket.emit("disconnecting");
```
