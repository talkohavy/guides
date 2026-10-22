# What is SSH?

## 1. What is SSH?

SSH (Secure Socket Shell) **is a network protocol that gives you a secure way to access a computer over an unsecured network**. System administrators use it constantly, and so does Git, when it talks to GitHub or Bitbucket.

It does two jobs at once:

- **Authentication.** Proves who you are, either with a password or with a **public key** (preferred).
- **Encryption.** Scrambles the traffic between the two computers, so anyone watching the network sees noise.

An SSH server (`sshd`) listens on **port 22** of a TCP connection by default.

## 2. How a connection starts

You type:

```bash
ssh UserName@SSHserver.example.com
```

The client tries to connect to `server.example.com` as that user.

The **first time you connect to a host**, which the client does not know it yet, **it shows the remote machine's public key fingerprint** and asks you to confirm:

```bash
The authenticity of host 'sample.ssh.com (192.0.2.1)' can't be established.
ED25519 key fingerprint is SHA256:abcdefghijklmnopqrstuvwxyz0123456789ABCD.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

The **confirmation** (Answering `yes`) **stores the host's public key** in `~/.ssh/known_hosts`.

The **next time you connect**, **the client compares the server's key with the one it saved**. If they match, it connects without asking. That saved key is how the client knows it is still talking to the same machine.
