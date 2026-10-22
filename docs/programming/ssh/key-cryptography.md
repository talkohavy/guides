# Private and Public Key Cryptography

SSH login with a key is **built on one idea**:

**A pair of keys that are linked such that you cannot guess one from the other.**

## 1. What we want

You have a **secret key**. You use it to **encode** some information, which turns a readable message into something that looks like random noise. You send that noise to somebody else, and they **decrypt** it and get the back message. Anyone listening on the wire, learns nothing about what you sent.

## 2. Asymmetric keys

You generate a **pair** of keys, key A and key B.

You cannot derive one key from the other, but they are linked:

- Anything encrypted with key A can only be decrypted with key B.
- Anything encrypted with key B can only be decrypted with key A.

You pick one and call it the **public key**. The other becomes the **private key**.

The public key is public. You publish it: email, a Git host, a cloud VM. It sits out in the world with your name on it.

The private key stays secret. You never share it with anyone.

### -A. Encrypting to someone

Both of us generate a key-pair, and we each have the other's public key.

If you want to send me a message, you do not need a secret from me. You encrypt the message with **my public key** and send it. Only my private key can decrypt it, and only I have that key. Nobody else reading the traffic can read the message.

### - B. Proving you sent it

There is a second trick. If I encrypt something with **my private key** and publish the result, anyone can decrypt it, because my public key is public. So why encrypt it?

Because the fact that it can be _decrypted_ with my public key means that it was _encrypted_ with my private key. Only I have that key, so the message really came from me. That is a signature.

### - C. Both at once

The interesting case is when I do both. If I encrypt with **my private key**, and then encrypt again with **your public key**, then:

1. Nobody else can read the message.
2. You know nobody else can read the message.
3. You know the message came from me, not an imposter.
4. You know the message was not modified, because a change would no longer decrypt with the keys.

We never had to meet in the dark like spies, and exchange envelopes. In fact we've never even met. That is how two sides can still trust each other, and how they can agree on a shared **session key** for the rest of the connection.

That **session key** is then used throughout the entire session (hence its name) to encrypt data on the wire.

SSH uses this every time you log in with a key. **The server stores your public key. Your computer proves it holds the matching private key**, without ever sending that private key across the network.
