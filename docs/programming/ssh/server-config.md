# Server Config

Every file so far was **client** config. `~/.ssh/config` controls how **your** `ssh` command connects out.

The machine you connect **into** has a separate config. It controls who `sshd` accepts. On the Mac-to-Mac setup, that machine is Mac B. See [SSH Between Macs](./ssh-between-macs.md).

| File                      | Side   | What it controls                                 |
| ------------------------- | ------ | ------------------------------------------------ |
| `~/.ssh/config`           | client | your outgoing connections, for your user only    |
| `/etc/ssh/ssh_config`     | client | outgoing connections, for every user on this Mac |
| `/etc/ssh/sshd_config`    | server | incoming connections (the **d** is the daemon)   |
| `/etc/ssh/sshd_config.d/` | server | extra server files, included by the line below   |

On macOS, the top of `/etc/ssh/sshd_config` contains:

```bash
Include /etc/ssh/sshd_config.d/*
```

A macOS update can replace `sshd_config`. Put your own settings in a file under `sshd_config.d/` so they survive that.

```bash
ls /etc/ssh/sshd_config.d/
sudo nano /etc/ssh/sshd_config.d/010-custom.conf
```

:::info
In `sshd_config`, **the first value wins**. A later line for the same setting is ignored. Included files are read in alphabetical order, before the rest of `sshd_config`. A name like `010-custom.conf` is read before `100-` or `zzz-` files that might set the same option.
:::

## Keys only, no passwords

Do this only after a key login already works. On the Mac-to-Mac walkthrough, that is Step 6 of [SSH Between Macs](./ssh-between-macs.md).

```bash
# /etc/ssh/sshd_config.d/010-custom.conf
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
```

- `PubkeyAuthentication yes` allows key login. This is usually already the default. Setting it here makes the file state the policy on its own.
- `PasswordAuthentication no` rejects a plain password.
- `KbdInteractiveAuthentication no` closes the other password door. macOS runs `sshd` with `UsePAM yes`, and PAM can still prompt for a password through keyboard-interactive login. Older OpenSSH calls this setting `ChallengeResponseAuthentication`.
- `PermitRootLogin no` means nobody can SSH in directly as `root`.

Two more you may want later:

- `AllowUsers tal` limits SSH to the listed accounts on this machine.
- `Port 2222` moves the listener off port 22. A client then needs `ssh -p 2222`, or a `Port 2222` line in that host's block in `~/.ssh/config`.

## Check it, then apply it

`sshd -t` checks syntax and prints nothing when the file is valid:

```bash
sudo sshd -t
```

`sshd -T` prints the settings the daemon will actually use, after includes and "first value wins":

```bash
sudo sshd -T | grep -i passwordauthentication
```

You want `passwordauthentication no`.

Restart the listener so the new file is loaded. On macOS, toggling **Remote Login** off and on in System Settings does it. From the terminal:

```bash
sudo launchctl kickstart -k system/com.openssh.sshd
```

Keep the SSH session you already have open while you test a **new** login from another window. The open session stays up even if the new config is wrong.

:::caution
Confirm key login **before** you turn password login off, and test from a second terminal. On a Mac in front of you, the local keyboard can still fix a bad config. On a remote server, this is how you lock yourself out.
:::
