# Public Key Algorithms

When you generate an SSH key, you choose an algorithm. The algorithm decides how the key is built, how long it is, and which clients can use it.

There are four algorithms you will see.

## 1. rsa

An old algorithm, based on the difficulty of factoring large numbers. Use at least **2048** bits. **4096** bits is the size to pick if you still use RSA.

RSA is getting old, and factoring keeps improving. It is quite possible that RSA becomes practically breakable in the foreseeable future. Every SSH client supports it, which is why it is still everywhere, but a newer algorithm is a better choice.

## 2. dsa

An old US government Digital Signature Algorithm, based on the difficulty of computing discrete logarithms. A key size of 1024 bits was the normal one.

:::caution
DSA in its original form is no longer recommended. Do not generate a DSA key.
:::

## 3. ecdsa

A newer Digital Signature Algorithm standardized by the US government, using elliptic curves. This is a good algorithm for current use, and it is the one this guide generates in [Generate a Key-Pair](./generate-a-key-pair.md).

Only three key sizes exist: **256**, **384**, and **521** bits. Always use **521**. The keys stay small, and the larger size is the safer of the three. Most SSH clients support ECDSA.

## 4. ed25519

A newer algorithm added in OpenSSH. Keys are small, and the algorithm is fast.

Support in clients used to be patchy, which is why this guide does not treat it as the default choice. On a current OpenSSH, `ssh-keygen` with no flags generates an ed25519 key. See [Generate a Key-Pair](./generate-a-key-pair.md).
