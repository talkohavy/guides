# SSH Between Macs

Log in from one Mac to another with a key, instead of typing the other Mac's password every time.

```bash
# On the client Mac (the one you type on):
ssh-copy-id -i ~/.ssh/id_ecdsa.pub tal@Tals-MacBook-Air.local
ssh tal@Tals-MacBook-Air.local
```

The public key in that command is the one from [Generate a Key-Pair](./generate-a-key-pair.md).

## The two roles

You have two Macs. Each one already has its own key-pair in `~/.ssh`. Neither one has the other's **public** key yet.

Every SSH connection has two roles:

- **Client.** The Mac you are sitting at. It runs the `ssh` command.
- **Server.** The Mac you are connecting into. It runs `sshd`, which listens on port 22.

Below, **Mac A is the client** and **Mac B is the server**. When one direction works, repeat the same steps the other way.

The goal: Mac B stores Mac A's public key in `~/.ssh/authorized_keys`, in the home directory of the user you log in as.

```bash
cat ~/.ssh/authorized_keys
```

## Step 1: turn on Remote Login (Mac B)

macOS ships with an SSH server, and it is **off** by default.

Open **System Settings → General → Sharing** and turn on **Remote Login**. Click the info button next to it and choose who may log in. "Only these users", with your own user selected, is the right default.

Or from the terminal on Mac B:

```bash
sudo systemsetup -setremotelogin on
sudo systemsetup -getremotelogin   # should print: Remote Login: On
```

:::info
On newer macOS versions, `systemsetup` can refuse to run until Terminal (or iTerm) has **Full Disk Access**. Grant it under System Settings → Privacy & Security, or use the Sharing settings screen instead.
:::

## Step 2: get the username and the address (Mac B)

You need the account name, and an address that Mac A can resolve.

Username:

```bash
whoami
```

Address, either of these:

**Local hostname.** It stays put when the router hands out a new IP. This is the one to use.

```bash
scutil --get LocalHostName   # e.g. Tals-MacBook-Air
```

Add `.local`: `Tals-MacBook-Air.local`. Both Macs have to be on the same local network. `.local` names are resolved by Bonjour, not by a public DNS server.

**IP address.** `en0` is usually Wi-Fi.

```bash
ipconfig getifaddr en0   # e.g. 192.168.1.23
```

The IP changes when the Mac rejoins the network. Prefer the `.local` name.

## Step 3: confirm a password login works (Mac A)

Check the path with a password before involving keys:

```bash
ssh tal@Tals-MacBook-Air.local
```

The first time, type `yes` at the fingerprint prompt. That writes Mac B's host key into `~/.ssh/known_hosts` on Mac A. See [What is SSH?](./what-is-ssh.md).

Then macOS asks for **Mac B's login password**. Once you have a shell, type `exit`.

## Step 4: install your public key (Mac A)

`ssh-copy-id` appends your public key to the server's `authorized_keys`. It ships with OpenSSH, so it is on macOS and on almost every Linux distribution. Windows OpenSSH builds often do not include it.

```bash
ssh-copy-id -i ~/.ssh/id_ecdsa.pub tal@Tals-MacBook-Air.local
```

It asks for Mac B's password one last time, then prints something like:

```bash
Number of key(s) added:        1

Now try logging into the machine, with:   "ssh 'tal@Tals-MacBook-Air.local'"
and check to make sure that only the key(s) you wanted were added.
```

What it did:

1. Connected to Mac B with your password.
2. Created `~/.ssh` on Mac B if it was missing, with mode `700` (only the owner can read, write, or enter it).
3. Appended `id_ecdsa.pub` to `~/.ssh/authorized_keys`, and created that file with mode `600` if it was new.
4. Skipped a key that was already in the file, so running it twice does not add a duplicate.

It never reads your private key. Only the `.pub` file is sent.

Flags worth knowing:

- `-i <file>` chooses the public key. If you omit it, `ssh-copy-id` picks from the agent and from `~/.ssh/id_*.pub`, which may not be the key you meant. Always pass `-i`.
- `-n` is a dry run. It prints the keys it would install and installs nothing.
- `-p <port>` is for a server that is not on port 22.

:::info
The same result by hand:

```bash
cat ~/.ssh/id_ecdsa.pub | ssh tal@Tals-MacBook-Air.local \
  'mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
```

:::

## Step 5: look at the key on the server (Mac B)

The key is in the home directory of the user you logged in as:

```bash
ls -la ~/.ssh
cat ~/.ssh/authorized_keys
```

One line is one allowed public key:

```bash
ecdsa-sha2-nistp521 AAAAE2VjZHNhLXNoYTItbmlzdHA1MjEAAAAI... my-main-key
```

The last field (`my-main-key`) is the `-C` comment from [Generate a Key-Pair](./generate-a-key-pair.md). That is how you tell the lines apart. Give each machine its own comment, for example `tal.macbook-pro`.

To be sure it is the same key, compare fingerprints.

On Mac A:

```bash
ssh-keygen -lf ~/.ssh/id_ecdsa.pub
```

On Mac B:

```bash
ssh-keygen -lf ~/.ssh/authorized_keys
```

The second command prints one fingerprint per line. One of them should match Mac A's fingerprint exactly.

:::caution
`sshd` refuses a key file that other users can write. It does not print an error. It ignores `authorized_keys` and asks for a password instead. If key login fails, fix the modes first:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

:::

## Step 6: log in with the key (Mac A)

```bash
ssh tal@Tals-MacBook-Air.local
```

Mac B's password should not come up. If the private key has a passphrase, SSH asks for **that**. The passphrase unlocks the key file on Mac A. It is not Mac B's login password.

To prove this attempt cannot fall back to a password:

```bash
ssh -o PasswordAuthentication=no tal@Tals-MacBook-Air.local
```

If that command fails, the key was not accepted. Go back to the permissions in Step 5.

## Step 7: give the host a short name

This is the same client file as [A Second Key-Pair](./second-key-pair.md), `~/.ssh/config` on **Mac A**. Add a block for Mac B:

```bash
Host tal
  HostName Tals-MacBook-Air.local
  User tal
  IdentityFile ~/.ssh/id_ecdsa
  IdentitiesOnly yes
  AddKeysToAgent yes
  UseKeychain yes
```

`HostName` and `IdentityFile` are the same host and the same key you just tested. `AddKeysToAgent yes` loads that key into the `ssh-agent` after you unlock it once. `UseKeychain yes` stores the passphrase in the macOS keychain, so a reboot does not make you type it again.

`AddKeysToAgent` is also why other hosts need `IdentitiesOnly yes`. A key loaded here is offered to **every** host unless that host's block says otherwise. See [The ssh-agent](./ssh-agent.md).

Then this is enough:

```bash
ssh tal
```

The next page, [Server Config](./server-config.md), is the other file: the one on Mac B that decides which logins `sshd` will accept. Turn password login off only after Step 6 works.
