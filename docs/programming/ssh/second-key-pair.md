# A Second Key-Pair

**Two accounts on the same Git host cannot share one public key!**

A _personal_ GitHub account and a _work_ GitHub account each need their own key. This page is how you create the second key and tell SSH which account should use it.

## 1. Why one key is not enough

You have an account on a Git host (GitHub, Bitbucket, and so on). Cloning a repository authenticates with SSH: your computer offers a **public key**, and the host checks it against the public key you saved on that account.

`git clone` and `git pull` do not ask which key to use. With no config file, SSH offers the default private key (`~/.ssh/id_rsa`, or whichever default key you generated).

**One account can hold many repositories**, and every repository on that account can use the same account-level public key. That part is fine.

The rule that forces a second key: **two different accounts on the same Git host cannot share the same public key.** Upload a key that is already attached to account 1, and the host rejects it for account 2.

Two obvious questions:

1. Why two accounts? Well, consider one as your personal account, and the other account as your work account (using company email).
2. Would a second computer fix it? Yes. A second computer would have its own key-pair, so its default key would be a different public key. A second key on _this_ computer does the same job, once SSH knows when to use it.

## 2. Generate a second key

```bash
ssh-keygen -t ecdsa -b 521 -f "~/.ssh/id_ecdsa_2" -C tal.mac.home
```

Or:

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa_2 -C tal.mac.home
```

This writes `~/.ssh/id_rsa_2` and `~/.ssh/id_rsa_2.pub` (or id_ecdsa_2).

:::info
`-f` sets the file name. Without it, `ssh-keygen -t rsa` writes `~/.ssh/id_rsa` and overwrites the key you already have. The path has to be `~/.ssh/...`. A bare `-f id_rsa_2` writes the files in whatever directory you happen to be in.
:::

Upload `id_rsa_2.pub` to the **second** Git account. Leave the first account on the original public key.

## 3. Tell SSH which key belongs to which account

Creating the key files is not enough. SSH still has to be told when to use the second key.

When an SSH connection starts, the ssh client reads `~/.ssh/config` if that file exists. If it does not, SSH falls back to the default private key.

Create the file with no extension:

```bash
code "~/.ssh/config"
```

```bash
# Account 1
Host github.com
  HostName github.com
  IdentityFile ~/.ssh/id_rsa
  IdentitiesOnly yes

# Account 2
Host github.com_2
  HostName github.com
  IdentityFile ~/.ssh/id_rsa_2
  IdentitiesOnly yes
```

Each block is one `Host` name, and each `Host` name must be unique.

- **Host** is a custom name you choose. I.e. `git@github.com_2:...`.
- **HostName** is the real DNS server. Both blocks (Account 1 & Account 2) talk to `github.com`.
- **IdentityFile** is the private key to be used by this block.
- **IdentitiesOnly yes** means "offer only that key". Do not skip it. See the caution below.

Account 1 is the normal case: `git@github.com:...` uses `id_rsa`.

Account 2 is the special case: the `Host` name has a suffix (`_2`, or any label you like), and `IdentityFile` points at the second private key.

:::caution
`IdentityFile` alone does **not** mean "use only this key". It adds that key to the list of keys SSH will try. Keys already loaded in the `ssh-agent` are tried **first**.

So if `id_rsa` is already in the agent (for example because another `Host` block has `AddKeysToAgent yes`, like the Mac block in [SSH Between Macs](./ssh-between-macs.md)), SSH offers `id_rsa` to GitHub even when you connect to `github.com_2`. GitHub accepts the first key it recognizes, and logs you in as **account 1**:

```bash
ERROR: Permission to talkohavy/guides.git denied to <account-1-username>.
```

`IdentitiesOnly yes` fixes this. SSH then offers only the keys listed in `IdentityFile` for that host, and ignores everything else in the agent.

See which keys the agent holds right now:

```bash
ssh-add -l
```

Renaming the files on disk does not change that list. That case is covered in [The ssh-agent](./ssh-agent.md).
:::

## 4. Check which account GitHub sees

Before cloning, ask GitHub who it thinks you are:

```bash
ssh -T git@github.com_2
```

You want the username of **account 2**:

```bash
Hi talkohavy! You've successfully authenticated, but GitHub does not provide shell access.
```

If the username is wrong, add `-v` and look at which key was offered:

```bash
ssh -vT git@github.com_2 2>&1 | grep -E "Offering|Hi "
```

The `Offering public key` line shows the key's comment (the `-C` value) and where it came from. `explicit` means it came from `IdentityFile`. `agent` means it came from the `ssh-agent`.

## 5. Clone with the second host name

A normal clone uses the real host, and hits account 1:

```bash
git clone git@github.com:talkohavy/email-builder.git
```

To use account 2, add "\_2" to the `Host` name:

```bash
git clone git@github.com_2:talkohavy/email-builder.git
```
