---
sidebar_label: '6. SSH'
sidebar_position: 4
---

# Guide for SSH

## 1. Private/Public Key Cryptography

The basic idea of how it works is such a clever, and dare I say cool, idea.

### What we want to achieve

You have a `secret key`. You use that to `encode` some information, which converts it from a readable form to an un-readable form, effectively garbage, which looks like random noise. You then transfer that garbage to somebody else, and they are then able to `decrypt` it and get the message out. And anyone who's listening on your communication is unable to find out anything about the information that you are communicating.

### Solution 1: Symmetric System (BAD)

The simplest way of thinking about it is to say, well there's a `message`, like _"hello"_, which I want to `encrypt`, and so I do some process on it, using a `secret key`, which then converts the `message` into nonsense (i.e. _xyz123_), and then you send it to the other person, and they `decrypt` it, with a process which is kind of the same but in reverse, using... the same `secret key`, and then I get _"hello"_ back on the other end.  
And that's nice and simple, and it works.  
But it has a problem which is you both need to know what this `secret key` is.  
So, if it's two people, and they want to communicate with one another privately, they'd have to agree on a `secret key`, and then somehow share it with one another.  
So they might meet in the park late at night in secret and exchange envelops, or whatever. And this is the kind of things spies used to do.  
And the problem with that is... first it's very inconvenient, and secondly & most importantly - sometimes you physically can't do it.  
Like the case of two gentleman that have never met, yet they want to do something over the internet.  
So the problem becomes, how do I send this `secret key` to you, without just sending it in plain-text, unencrypted.  
In order for us to share the key safely we need a secure encrypted connection, but we can't establish a secure encrypted connection without key!  
There's a way of solving this problem, which is with **Asymmetric Encryption**.

### Solution 2: Asymmetric System (Good !)

What you do is you generate 2 keys. key*A & key_B.
And basically? It's the same as before. You got your `message` that says *"Hello"\_, you encrypt it with key_A, get garbage, send the garbage over to the other person, and then the other person uses key_B to decrypt it, and get out the `message`.  
Now,
you can't guess one key from the other, but they are linked in such a way, that anything you encrypt with key_A, can only be decrypted with key_B.  
And anything that you encrypt with key_B, can only be decrypted with key_A.  
And what you do is you generate a pair of these keys, which is also known as a key-pair, and you just pick one of them and you say "This is my `public key`", which makes the other one as your private. Now, the `public key` is public. You publish it everywhere. You put it on email, you upload it to git provider server, to a GCP ubuntu machine, whatever. Basically the idea is it's everywhere out there in the world with your name on it.  
The private key, the other key of this pair, that one you keep absolutely secret.  
And you can do some really cool things with it once this system is set up.  
Consider a case where I generate a key-pair, and also you generate a key-pair.  
We both have one another's `public keys`, so now... if you want to send me a message, I don't have to share anything with you. You just know my public key, encrypt something with my public key, send it to me, and you know that I can decrypt it, right? Because you know I have my private key.  
And then, there's another thing you can do with this, which is... if I encrypt something with my private key, and then publish it... now on the surface of it you think: well, what's the point of encrypting it with your `private key`? Because if your `public key` is out there, then anyone can decrypt it, so why bother encrypting it?

But! The fact that it can be `decrypted` with your `public key`, means that it must have been `encrypted` with your `private key`. Which means that it must have been you who sent it, because only you have your `private key`. Cryptographically, you can be certain that it's an authentic message really from that person.

So the best thing happens when I do both!  
Where I `encrypt` something with my `private key`, and then with your `public key`. And only then I send it to you.  
And if we communicate like this, I know nobody else can read the message. You know nobody else can read the message. You know that the message came from me, and not an imposter, and you also know that the message hasn't been modified, because any modification to the message also requires the keys.  
That's a great secure system, in which we didn't have to meet up in a park in shifty way and exchange envelopes. We in fact have never met.

---

## 2. What is SSH?

### About SSH

SSH, also known as `Secure Shell` or `Secure Socket Shell`, is a network protocol that gives users, particularly system administrators, a secure way to access a computer over an unsecured network.

SSH also refers to the suite of utilities that implement the SSH protocol. `Secure Shell` provides an **authentication mechanism** either by a strong password or by a `public key`, as well as **an encrypted data communication system** between two computers connecting over an open network, such as the internet.

In addition to providing strong encryption, SSH is widely used by network administrators to manage systems and applications remotely, enabling them to log in to another computer over a network, execute commands and move files from one computer to another.

SSH refers both to the cryptographic network protocol and to the suite of utilities that implement that protocol. SSH uses the client-server model. An SSH server, by default, listens on the standard Transmission Control Protocol (TCP) port 22.

### How does SSH work?

The most basic use of SSH is to connect to a remote host for a terminal session. The form of that command is the following:

```bash
ssh UserName@SSHserver.example.com
```

This command will cause the client to attempt to connect to the server named server.example.com, using the user ID UserName. If this is the first time negotiating a connection between the local host and the server, the user will be prompted with the remote host's public key fingerprint and prompted to connect, despite there having been no prior connection:

```bash
The authenticity of host 'sample.ssh.com' cannot be established.
 DSA key fingerprint is 01:23:45:67:89:ab:cd:ef:ff:fe:dc:ba:98:76:54:32:10.
 Are you sure you want to continue connecting (yes/no)?
```

Answering yes to the prompt will cause the session to continue, and the host key is stored in the local system's known_hosts file. This is a hidden file, stored by default in a hidden directory, called /.ssh/known_hosts, in the user's home directory. Once the host key has been stored in the known_hosts file, the client system can connect directly to that server again without need for any approvals; the host key authenticates the connection.

---

## 3. Public Key Algorithms

SSH supports several public key algorithms for authentication keys. You need to choose an algorithm for how to generate your key, which would in turn affect its and security level.  
There are 4 available algorithms which you could choose to make that key.

### option 1: rsa

An old algorithm based on the difficulty of factoring large numbers. A key size of at least 2048 bits is recommended for RSA; 4096 bits is better. RSA is getting old and significant advances are being made in factoring. Choosing a different algorithm may be advisable. It is quite possible the RSA algorithm will become practically breakable in the foreseeable future. All SSH clients support this algorithm.

### option 2: dsa

An old US government Digital Signature Algorithm. It is based on the difficulty of computing discrete logarithms. A key size of 1024 would normally be used with it.

:::caution
DSA in its original form is no longer recommended.
:::

### option 3: ecdsa

A new Digital Signature Algorithm standardized by the US government, using elliptic curves. This is probably a good algorithm for current applications. Only three key sizes are supported: 256, 384, and 521 (sick!) bits. We would recommend always using it with 521 bits, since the keys are still small and probably more secure than the smaller keys (even though they should be safe as well). Most SSH clients now support this algorithm.

### option 4: ed25519

This is a new algorithm added in OpenSSH. Support for it in clients is not yet universal. Thus, its use in general purpose applications may not yet be advisable.

---

## 4. Generate a key-pair (public & private)

Run either one of these commands:

```bash
# - option 1: rsa
ssh-keygen -t rsa -b 4096 -C talkohavy

# - option 2: dsa
ssh-keygen -t dsa

# - option 3: ecdsa ( recommended!!! )
ssh-keygen -t ecdsa -b 521 -f $HOME\.ssh\talkohavy_ecdsa -C talkohavy_ecdsa

# - option 4: ed25519
ssh-keygen -t ed25519

# - option 5: the default one (find out what this means!!!)
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

## 5. Create A Second key-pair of public/private keys

**<font size="6">TLDR;</font>**  
**Two different `accounts`, on the same git provider, CANNOT share the same `public key`!!!**

### - The background story

You have an `account` on a git provider (Bitbucket / Github / etc. ).  
You want to clone a project from that `account`, to your `computer`.  
The clone operation asks that you verify yourself (authenticate), and nowadays the only way to do that is with an SSH call, in which your computer both sends a `public key`, and receives a `public key` from the other person (in which case - the git provider).  
Today, all git providers ask that on your `account` you set/provide a **unique** `public key`.

When you clone a project, you essentially send an SSH request behind the scenes, which uses your `default private key`. You did not tell it which key to pick from! it took picked the default one automatically! Your git provider will then use the `public key`, which you uploaded to it before hand, to try and decipher the message.

Now here's the kicker:  
A single `account` may have _many_ `projects` in it (i.e. `repositories`), and all those `projects` may use the same `account` level `public key`. This is great! I can create as many `projects` as I like, and use the same `public key`! I can share my `public key` across different `projects`.

So why do I need a second `key-pair` of public/private keys?

There's a harsh rule that goes for all git providers, which says:  
**Two different `accounts`, on the same git provider, CANNOT share the same `public key`!!!**

Two questions which you can ask:

1. Why do you have two accounts?
2. Can't you just use another computer?

Answer to 1: I have a two `accounts`, because the first one is my own personal account, and the second one is a work account, provided to me on a company email.

Answer to 2: Technically, yes, that would solve my problem, because the pairing between `a computer` and a `git provider account` is what causing the problem. How would a different computer solve the problem? Because that second computer would have a **different** `key-pair`, which for that second computer it would be the `default private key`.

### - Step 1: generate a second public key

Run this command:

```bash
ssh-keygen -t rsa -b 4096 -C tal_home_2 -f id_rsa_2
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
Host bitbucket.org
 Hostname bitbucket.org
 IdentityFile ~/.ssh/id_rsa

# Account 2
Host bitbucket.org_2
 Hostname bitbucket.org
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
git clone git@bitbucket.org:talkohavy/email-builder.git
```

```bash
git clone git@bitbucket.org_2:talkohavy/email-builder.git
```

Press Enter and... Cross fingers!

**Enjoy! :-)**
