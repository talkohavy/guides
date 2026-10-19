# Guide for SSH

**Quick copy:**

```bash
ssh-keygen -t rsa -b 4096 -C tal-kohavy.personal.mac
```

## 1. What is SSH?

### - About SSH

SSH, also known as `Secure Shell` or `Secure Socket Shell`, is a network protocol that gives users, particularly system administrators, a secure way to access a computer over an unsecured network.

`Secure Shell` provides an **authentication mechanism** either by a strong password or by a **public key** (preferred), as well as **an encrypted data communication system** between two computers connecting over an open network, such as the internet.

An SSH server (sshd), listens on port 22 of a TCP connection by default.

### - How does it work?

You type a command:

```bash
ssh UserName@SSHserver.example.com
```

The client will **attempt to connect** the server named server.example.com, using the specified user.  
If this is their **first time negotiating**, the **client will be prompted** with the remote's public key fingerprint and prompted to connect:

```bash
The authenticity of host 'sample.ssh.com' cannot be established.
 DSA key fingerprint is 01:23:45:67:89:ab:cd:ef:ff:fe:dc:ba:98:76:54:32:10.
 Are you sure you want to continue connecting (yes/no)?
```

Answer `yes` to continue.  
Then, the host's public key is stored in inside a hidden file called `~/.ssh/known_hosts`. Once the host key has been stored, the client can connect directly to that server again without need for any approvals; the host key authenticates the connection.

---

## 2. Private/Public Key Cryptography

The basic idea of how it works is such a clever, and dare I say cool, idea.

### - What we want to achieve

You have a **secret key**. You use that to **encode** some information, which converts it from a readable form to an un-readable form, effectively garbage, which looks like random noise. You then transfer that garbage to somebody else, and they are then able to **decrypt** it and get the message out. And anyone who's listening on your communication is unable to find out anything about the information that you are communicating.

### - Solution: Asymmetric System

What you do is **you generate a pair of keys**, also known as key-pair. key A & key B.  
**You can't guess one key from the other**, but **they are linked in a special way** such that:

- **Anything you encrypt with key A, can only be decrypted with key B**.
- **Anything that you encrypt with key B, can only be decrypted with key A**.

So you generate a pair of these keys, and you just pick one of them and you say "This is my public key", which makes the other one as your private. Now, the public key is public. You publish it everywhere. You put it on email, you upload it to git provider server, to a GCP ubuntu machine, whatever. Basically the idea is it's everywhere out there in the world with your name on it.

**The private key**, the other key of this pair, that one **you keep absolutely secret**. And you can do some really cool things with it once this system is set up. Consider a case where I generate a key-pair, and also you generate a key-pair. We both have one another's public keys, so now... if you want to send me a message, I don't have to share anything with you. You just know my public key, encrypt something with my public key, send it to me, and you know that I can decrypt it, right? Because you know I have my private key. And then, there's another thing you can do with this, which is... **if I encrypt something with my private key**, and then publish it... now on the surface of it you think: well, what's the point of encrypting it with your private key? Because if your public key is out there, then anyone can decrypt it, so why bother encrypting it?

But! **The fact that it can be decrypted with your public key, means that it must have been encrypted with your private key**. Which means that **it must have been you who sent the message**, because only you have your private key. Cryptographically, you can be certain that it's an authentic message really from that person.

So now the best thing happens when I do both, where **I encrypt something with my private key, and then encrypt it again with your public key**. And only then I send it to you. And if we communicate like this:

1. I know nobody else can read the message.
2. You know nobody else can read the message.
3. You know that the message came from me, and not an imposter.
4. You also know that the message hasn't been modified, because any modification to the message also requires the keys.

That's a great secure system, in which we didn't have to meet up in a park in shifty way and exchange envelopes. In fact, we've never even met. And **that's how two sides can generate and exchange a symmetric session key**.

---

## 3. Public Key Algorithms

SSH supports several public key algorithms for authentication keys. You need to choose an algorithm for how to generate your key, which would in turn affect its and security level.  
There are 4 available algorithms which you could choose to make that key.

### - option 1: rsa

An old algorithm based on the difficulty of factoring large numbers. A key size of at least 2048 bits is recommended for RSA; 4096 bits is better. RSA is getting old and significant advances are being made in factoring. Choosing a different algorithm may be advisable. It is quite possible the RSA algorithm will become practically breakable in the foreseeable future. All SSH clients support this algorithm.

### - option 2: dsa

An old US government Digital Signature Algorithm. It is based on the difficulty of computing discrete logarithms. A key size of 1024 would normally be used with it.

:::caution
DSA in its original form is no longer recommended.
:::

### - option 3: ecdsa

A new Digital Signature Algorithm standardized by the US government, using elliptic curves. This is probably a good algorithm for current applications. Only three key sizes are supported: 256, 384, and 521 (sick!) bits. We would recommend always using it with 521 bits, since the keys are still small and probably more secure than the smaller keys (even though they should be safe as well). Most SSH clients now support this algorithm.

### - option 4: ed25519

This is a new algorithm added in OpenSSH. Support for it in clients is not yet universal. Thus, its use in general purpose applications may not yet be advisable.

---

## 4. Generate a key-pair (public & private)

Run either one of these commands:

- option 1: rsa

```bash
ssh-keygen -t rsa -b 4096 -C talkohavy
```

- option 2: dsa

```bash
ssh-keygen -t dsa
```

- option 3: ecdsa ( **recommended!!!** )

```bash
ssh-keygen -t ecdsa -b 521 -f ${HOME}/.ssh/id_ecdsa -C my-main-key
```

- option 4: ed25519

```bash
ssh-keygen -t ed25519
```

- option 5: the default one (find out what this means!!!)

```bash
ssh-keygen
```

I recommend using option 3, with `ecdsa`.  
Why? Well, for the reason mentioned above.

1. `rsa` is getting old, so even though all SSH clients support this algorithm, choosing a different algorithm is advised.
2. `dsa` is out of the question.
3. `ecdsa` is a new Digital Signature Algorithm standardized by the US government, is considered a good algorithm for current applications. It is recommended you always use it with a key size of 521 bits. Also, most SSH clients now support this algorithm.

By running this command, you've created a key-pair (private & public) in a directory called `.ssh`, probably located here:

```bash
cd ~/.ssh
```

Print the public key:

```bash
cat ~/.ssh/id_rsa.pub
```

---

## 5. Create a second key-pair of public/private keys

**<font size="6">TLDR;</font>**  
**Two different `accounts`, on the same git provider, CANNOT share the same **public key**!**

### - The background story

You have an `account` on a git provider (Bitbucket / Github / etc. ).  
You want to clone a project from that `account`, to your `computer`.  
The clone operation asks that you verify yourself (authenticate), and nowadays the only way to do that is with an SSH call, in which your computer both sends a **public key**, and receives a **public key** from the other person (in which case - the git provider).  
Today, all git providers ask that on your `account` you set/provide a **unique** **public key**.

When you clone a project, you essentially send an SSH request behind the scenes, which uses your `default private key`. You did not tell it which key to pick from! it took picked the default one automatically! Your git provider will then use the **public key**, which you uploaded to it before hand, to try and decipher the message.

Now here's the kicker:  
A single `account` may have _many_ `projects` in it (i.e. `repositories`), and all those `projects` may use the same `account` level **public key**. This is great! I can create as many `projects` as I like, and use the same **public key**! I can share my **public key** across different `projects`.

So why do I need a second `key-pair` of public/private keys?

There's a harsh rule that goes for all git providers, which says:  
**Two different `accounts`, on the same git provider, CANNOT share the same **public key**!**

Two questions which you can ask:

1. Why do you have two accounts?
2. Can't you just use another computer?

Answer to 1: I have a two `accounts`, because the first one is my own personal account, and the second one is a work account, provided to me on a company email.

Answer to 2: Technically, yes, that would solve my problem, because the pairing between `a computer` and a `git provider account` is what causing the problem. How would a different computer solve the problem? Because that second computer would have a **different** `key-pair`, which for that second computer it would be the `default private key`.

### - Step 1: generate a second public key

Run this command:

```bash
ssh-keygen -t rsa -b 4096 -C tal.mac.home -f id_rsa_2
```

What this command did was generate 2 more files (another key-pair) inside your `.ssh` folder, `id_rsa_2` & `id_rsa_2.pub`.

:::info
Note that I added a NEW flag -f to specify the name of the two generated files. If I hadn't, the default name would be `id_rsa`, which is a file that I already have, and would therefore get overridden.
:::

### - Step 2: Creating a config file

Creating the new key-pair isn't enough, because we need a way to tell our SSH API call to use it.

Earlier we said that the `git pull` and `git clone` commands issue an SSH API call behind the scenes. And when it does, when an SSH API call is being issued, it actually goes behind the scenes and looks for a `config file` named `config`, and operates according to what it says.  
In the absence of a config file, it **by default** reaches for the `default private key` named as `id_rsa`.  
Now that we have 2 id_rsa's, we don't want this behavior to continue, so we need to create a `config` file to override the default behavior.

Inside the `.ssh` directory, create a config file named `config`, without an extension:

```bash
code $HOME/.ssh/config
```

Fill the `config` file with this:

```bash
# Account 1
Host github.com
 Hostname github.com
 IdentityFile ~/.ssh/id_rsa

# Account 2
Host github.com_2
 Hostname github.com
 IdentityFile ~/.ssh/id_rsa_2
```

You see here 2 blocks.  
Blocks are divided by the `Host`. Each host must be unique.  
You can tell that I've created 2 directives, one for each account.  
Account 1 will be the default case. It represents what usually happens in cases which we do not have a config file.  
It states the:

- **host**: The URL provided by us.
- **hostname**: The ACTUAL URL of the remote server (in our case it's the git provider – bitbucket).
- **IdentityFile**: A `relative path` to the `private-key` file to be used for the encryption of the message that would be sent over using the SSH API call.

Account 2 will be the **UNIQUE** case.  
This is where it gets interesting.  
In the host part, the URL which we provide, we're adding a "\_2" (could be anything we want), and in the `IdentityFile` we mention the path to the second `private-key` file.

### - Step 3: do a git clone

Let's do a git clone as you normally would, only now add the '\_2' to the host.  
So instead of doing this:

```bash
git clone git@github.com:talkohavy/email-builder.git
```

```bash
git clone git@github.com_2:talkohavy/email-builder.git
```

Press Enter and... Cross fingers!

**Enjoy! :-)**

---

## 6. SSH from one Mac into another

**<font size="6">TLDR;</font>**

```bash
# On the client Mac (the one you type on):
ssh-copy-id -i ~/.ssh/id_ecdsa.pub tal@Tals-MacBook-Air.local
ssh tal@Tals-MacBook-Air.local
```

### - The setup

You have two Macs. Each one already has its own key-pair inside `~/.ssh`, but neither one knows about the other's **public key** yet.

In every SSH connection there are two roles:

- **client**: the Mac you're sitting at, the one running the `ssh` command.
- **server**: the Mac you're connecting _into_. It runs an SSH daemon (`sshd`) that listens on port 22.

In this section, **Mac A is the client** and **Mac B is the server**. Once it works in one direction, you repeat the same steps the other way around.

The goal: Mac B should hold Mac A's **public key** in a file called `~/.ssh/authorized_keys`.

```bash
cat ~/.ssh/authorized_keys
```

### - Step 1: enable Remote Login on the server (Mac B)

**macOS** ships with an **SSH server**, but it **is turned off by default**.

Go to **System Settings → General → Sharing**, and turn on **Remote Login**.  
Click the ⓘ next to it to choose which users are allowed to log in. "Only these users" with your own user is a good choice.

Or, from the terminal:

```bash
sudo systemsetup -setremotelogin on
sudo systemsetup -getremotelogin   # should print: Remote Login: On
```

:::info
On newer macOS versions, `systemsetup` might complain that it needs **Full Disk Access**. If that happens, either grant your terminal app Full Disk Access (System Settings → Privacy & Security), or use the GUI instead.
:::

### - Step 2: find the server's address and username (on Mac B)

To connect, you need two things: **who** you log in as, and **where** the machine is.

The username:

```bash
whoami
```

The address can be either the local hostname or the IP address.

- **Local hostname** (recommended, it doesn't change when the router hands out a new IP):

```bash
scutil --get LocalHostName   # e.g. Tals-MacBook-Air
```

You use it with a `.local` suffix: `Tals-MacBook-Air.local`. This works as long as both Macs are on the same local network.

- **IP address** (`en0` is usually the Wi-Fi interface):

```bash
ipconfig getifaddr en0   # e.g. 192.168.1.23
```

### - Step 3: make sure a password login works (from Mac A)

Before involving keys, check with a password:

```bash
ssh tal@Tals-MacBook-Air.local
```

First time you'll see a prompt, type `yes`, to store Mac B's host key inside `~/.ssh/known_hosts`.  
Then you'll be **prompted for a password**. Once in, type `exit` to go back.

So far you're logging in with a password. Next, you'll switch to keys.

### - Step 4: copy your public key with `ssh-copy-id` (from Mac A)

`ssh-copy-id` is a small helper script that installs your public key on a remote machine so you can log in with keys from then on. It comes from `OpenSSH`, the same project that provides `ssh`, `sshd` and `ssh-keygen`.
This tool ships with macOS, but isn't specific to macOS. In Linux, for example, it is included on almost every distribution. For windows, it is not included.

```bash
ssh-copy-id -i ~/.ssh/id_ecdsa.pub tal@Tals-MacBook-Air.local
```

It asks for Mac B's password one last time, and then prints something like:

```bash
Number of key(s) added:        1

Now try logging into the machine, with:   "ssh 'tal@Tals-MacBook-Air.local'"
and check to make sure that only the key(s) you wanted were added.
```

**What did it do behind the scenes?**

1. It connected to Mac B with SSH, using your password.
2. It created `~/.ssh` on Mac B if it didn't exist, with `700` permissions (only the owner can read, write, or enter it).
3. It **appended** the contents of `id_ecdsa.pub` to `~/.ssh/authorized_keys` on Mac B, and created that file with `600` permissions if needed.
4. It skipped any key that was already in there, so running it twice won't add duplicates.

It never touches your **private key**. Only the `.pub` file is sent.

**Useful flags:**

- `-i <file>`: which public key to send. If you leave it out, `ssh-copy-id` picks keys on its own (from your `ssh-agent`, or the default `~/.ssh/id_*.pub` files), which might not be the key you meant. **Always pass `-i`**.
- `-n`: dry run. It prints which keys _would_ be installed, without installing anything.
- `-p <port>`: if the server listens on a port other than 22.

:::info
`ssh-copy-id` is just a convenience. Doing it by hand comes down to the same thing:

```bash
cat ~/.ssh/id_ecdsa.pub | ssh tal@Tals-MacBook-Air.local \
  'mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys'
```

:::

### - Step 5: verify where the key ended up (on Mac B)

The key lives in the **home folder of the user you logged in as**, in a file called `authorized_keys`:

```bash
ls -la ~/.ssh
cat ~/.ssh/authorized_keys
```

Every line in `authorized_keys` is one allowed public key. It looks like this:

```bash
ecdsa-sha2-nistp521 AAAAE2VjZHNhLXNoYTItbmlzdHA1MjEAAAAI... my-main-key
```

The last part (`my-main-key`) is the comment you set with `-C` when you created the key (section 4). That's how you tell which line belongs to which machine. It's one more reason to give each key a clear comment like `tal.macbook-pro`.

To be completely sure it's the same key, compare **fingerprints**. On Mac A:

```bash
ssh-keygen -lf ~/.ssh/id_ecdsa.pub
```

On Mac B:

```bash
ssh-keygen -lf ~/.ssh/authorized_keys
```

The second command prints one fingerprint per line in the file. One of them should match Mac A's fingerprint exactly.

:::caution
SSH is strict about permissions. If `~/.ssh` or `authorized_keys` can be written by anyone other than you, `sshd` **silently ignores** the file and falls back to asking for a password. If key login doesn't work, check these first:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

:::

### - Step 6: log in with your key (from Mac A)

```bash
ssh tal@Tals-MacBook-Air.local
```

This time you shouldn't be asked for Mac B's password. If your private key has a passphrase, you'll be asked for **that** instead. That's your key's passphrase, which is a different thing from Mac B's password.

To prove you really logged in with the key and didn't fall back to a password, turn password login off for this one attempt:

```bash
ssh -o PasswordAuthentication=no tal@Tals-MacBook-Air.local
```

Enjoy! ✅ 🙂

### - Step 7: give it a short name (client-side `~/.ssh/config`)

This is the same client `config` file from section 5. Add a block for the other Mac on each client:

```bash
Host tal
  HostName talmac.local
  User tal
  IdentityFile ~/.ssh/id_rsa
  AddKeysToAgent yes
  UseKeychain yes
```

Now this is enough:

```bash
ssh tal
```

### - Step 9: the server-side config file (`sshd_config`)

So far, every config file we've touched was a **client** config. It controls how _your_ `ssh` command behaves when it connects somewhere.  
The **server** has its own config, which controls who `sshd` lets in, and how. Don't mix them up:

| File                      | Side   | Controls                                       |
| ------------------------- | ------ | ---------------------------------------------- |
| `~/.ssh/config`           | client | your outgoing connections (your user only)     |
| `/etc/ssh/ssh_config`     | client | outgoing connections, for all users            |
| `/etc/ssh/sshd_config`    | server | incoming connections (note the **d**, daemon)  |
| `/etc/ssh/sshd_config.d/` | server | extra server config files, loaded by the above |

On macOS, the top of `/etc/ssh/sshd_config` contains this line:

```bash
Include /etc/ssh/sshd_config.d/*
```

So instead of editing `sshd_config` itself, which a macOS update might overwrite, put your own settings in a separate file inside `sshd_config.d/`:

```bash
ls /etc/ssh/sshd_config.d/                     # see what's already there
sudo nano /etc/ssh/sshd_config.d/010-custom.conf
```

:::info
In `sshd_config`, **the first value set for a setting wins**. Later lines for the same setting are ignored. The included files are read in alphabetical order, before the rest of `sshd_config`. Giving your file a low number like `010-` makes sure it's read before anything else.
:::

**Example: allow keys only, no passwords**

Once key login works (Step 6), you can lock the server down:

```bash
# /etc/ssh/sshd_config.d/010-custom.conf
PubkeyAuthentication yes
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin no
```

- `PasswordAuthentication no`: rejects plain password logins.
- `KbdInteractiveAuthentication no`: macOS runs `sshd` with `UsePAM yes`, and PAM can still show a password prompt through "keyboard-interactive" login. This closes that door too. (Older OpenSSH versions call it `ChallengeResponseAuthentication`.)
- `PermitRootLogin no`: nobody can SSH in directly as `root`.

Other settings you might add later:

- `AllowUsers tal.kohavy`: only these server users may log in
- `Port 2222`: listen on a different port.

**Validate and apply:**

checks the syntax, prints nothing if it's OK:

```bash
sudo sshd -t
```

shows the setting sshd will actually use:

```bash
sudo sshd -T | grep -i passwordauthentication  # shows the setting sshd will actually use
```

Final enjoy! ✅✅✅

:::caution
Make sure key login works **before** you turn off password login, and keep an existing SSH session open while you test. With Macs you can always fix things at the physical keyboard. On a remote server, you can lock yourself out for good.
:::
