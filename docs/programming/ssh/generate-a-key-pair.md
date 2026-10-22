# Generate a Key-Pair

**Quick copy:**

New ecdsa:

```bash
ssh-keygen -t ecdsa -b 521 -C tal.personal.mac
```

Old rsa:

```bash
ssh-keygen -t rsa -b 4096 -C tal.personal.mac
```

## 1. Creating a Key-Pair

`ssh-keygen` writes two files: a **private key**, which stays on this computer, and a **public key** (the `.pub` file), which you copy to servers and Git hosts.

The algorithm you pass with `-t` is one of the four in [Public Key Algorithms](./public-key-algorithms.md). This guide uses **ecdsa**.

`-C` is a comment stored inside the key. It shows up later in `ssh-add -l` and in `authorized_keys`, so make it a name you will recognize, like the machine the key lives on.

## 2. The options

### rsa

```bash
ssh-keygen -t rsa -b 4096 -C tal.personal.mac
```

Works everywhere. RSA is old enough that a different algorithm is the better default. Details in [Public Key Algorithms](./public-key-algorithms.md).

### ecdsa (recommended)

```bash
ssh-keygen -t ecdsa -b 521 -f "${HOME}/.ssh/id_ecdsa" -C my-main-key
```

`-b 521` is the key size. `-f` is the file path, so the key is named `id_ecdsa` instead of whatever the default name would be.

### ed25519

```bash
ssh-keygen -t ed25519 -C my-main-key
```

### No flags

```bash
ssh-keygen
```

On current OpenSSH this is **ed25519**. The files are `~/.ssh/id_ed25519` and `~/.ssh/id_ed25519.pub`. The comment defaults to `user@hostname` on the machine where you ran the command.

`ssh-keygen` also asks for a **passphrase**. That passphrase encrypts the private key file on disk. It is not the password of the server you will log into. An empty passphrase means anyone who copies the private key file can use it.
