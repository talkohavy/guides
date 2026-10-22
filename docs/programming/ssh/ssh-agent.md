# The ssh-agent

**Renaming, replacing, or deleting key files in `~/.ssh` does not change what the `ssh-agent` holds.**

The agent is a process that keeps private keys in memory so you do not type a passphrase on every connection. Once a key is loaded, SSH offers that in-memory copy. The file on disk is no longer what gets sent.

This shows up after the setup in [A Second Key-Pair](./second-key-pair.md): the config looks right, and GitHub still logs you in as the wrong account.

## 1. See what keys are loaded

```bash
ssh-add -l
```

Each line is one key. It shows the type, the **fingerprint**, and the **comment** (the `-C` value from when the key was created):

```bash
4096 SHA256:sdaBct8z+l1W5Kyz9FEs3F2XlHmpkBH0nGb+m00leE4 tal.mac.work (RSA)
```

Ask GitHub which account that key matched:

```bash
ssh -T git@github.com
```

```bash
Hi <work-account-username>! You've successfully authenticated, but GitHub does not provide shell access.
```

The username in that greeting is the account GitHub attached to the key it accepted.

## 2. What goes wrong - A key stored in memory

A key gets into the agent when something runs `ssh-add`, or when a `Host` block has `AddKeysToAgent yes` (the short-name block in [SSH Between Macs](./ssh-between-macs.md) does this). From then on the agent keeps its own copy.

Say you swap the files so the personal key becomes the default:

```bash
mv ~/.ssh/id_rsa   ~/.ssh/id_rsa_work.bak   # the old work key
mv ~/.ssh/id_rsa_2 ~/.ssh/id_rsa            # the personal key is now the "default"
```

`git push` still uses the **old work key**. Agent keys are offered first, GitHub accepts that key, and you are the work account:

```bash
ERROR: Permission to talkohavy/guides.git denied to <work-account-username>.
```

Compare the agent's fingerprint with the files on disk, to see which file that memory key really is:

```bash
ssh-keygen -lf ~/.ssh/id_rsa
ssh-keygen -lf ~/.ssh/id_rsa_work.bak
```

`ssh-keygen -lf` hashes the file. `ssh-add -l` hashes what is in memory. The line that matches is the key the agent is actually offering.

## 3. Clear all keys from agent memory

Remove every key from the agent, then ask GitHub again:

```bash
ssh-add -D
ssh -T git@github.com
```

You can remove just 1 single key and leave the rest:

```bash
ssh-add -d ~/.ssh/id_rsa_work.bak
```
