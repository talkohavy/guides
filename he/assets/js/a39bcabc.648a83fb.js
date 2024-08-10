"use strict";(self.webpackChunkdocusaurus_guides=self.webpackChunkdocusaurus_guides||[]).push([[6063],{1805:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>h,contentTitle:()=>r,default:()=>l,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var s=t(6070),i=t(5710);const o={},r="Guide for SSH",a={id:"programming/ssh",title:"Guide for SSH",description:"1. Private/Public Key Cryptography",source:"@site/docs/programming/ssh.md",sourceDirName:"programming",slug:"/programming/ssh",permalink:"/guides/he/docs/programming/ssh",draft:!1,unlisted:!1,editUrl:"https://github.com/talkohavy/guides/docs/programming/ssh.md",tags:[],version:"current",frontMatter:{},sidebar:"mySidebar",previous:{title:"- Software Architecture",permalink:"/guides/he/docs/programming/software-architecture"},next:{title:"- Storybook",permalink:"/guides/he/docs/programming/storybook"}},h={},c=[{value:"1. Private/Public Key Cryptography",id:"1-privatepublic-key-cryptography",level:2},{value:"- What we want to achieve",id:"--what-we-want-to-achieve",level:3},{value:"- Solution 1: Symmetric System (BAD)",id:"--solution-1-symmetric-system-bad",level:3},{value:"- Solution 2: Asymmetric System (Good !)",id:"--solution-2-asymmetric-system-good-",level:3},{value:"2. What is SSH?",id:"2-what-is-ssh",level:2},{value:"- About SSH",id:"--about-ssh",level:3},{value:"- How does SSH work?",id:"--how-does-ssh-work",level:3},{value:"3. Public Key Algorithms",id:"3-public-key-algorithms",level:2},{value:"- option 1: rsa",id:"--option-1-rsa",level:3},{value:"- option 2: dsa",id:"--option-2-dsa",level:3},{value:"- option 3: ecdsa",id:"--option-3-ecdsa",level:3},{value:"- option 4: ed25519",id:"--option-4-ed25519",level:3},{value:"4. Generate a key-pair (public &amp; private)",id:"4-generate-a-key-pair-public--private",level:2},{value:"5. Create a second key-pair of public/private keys",id:"5-create-a-second-key-pair-of-publicprivate-keys",level:2},{value:"- The background story",id:"--the-background-story",level:3},{value:"- Step 1: generate a second public key",id:"--step-1-generate-a-second-public-key",level:3},{value:"- Step 2: Creating a config file",id:"--step-2-creating-a-config-file",level:3},{value:"- Step 3: do a git clone",id:"--step-3-do-a-git-clone",level:3}];function d(e){const n={admonition:"admonition",br:"br",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"guide-for-ssh",children:"Guide for SSH"})}),"\n",(0,s.jsx)(n.h2,{id:"1-privatepublic-key-cryptography",children:"1. Private/Public Key Cryptography"}),"\n",(0,s.jsx)(n.p,{children:"The basic idea of how it works is such a clever, and dare I say cool, idea."}),"\n",(0,s.jsx)(n.h3,{id:"--what-we-want-to-achieve",children:"- What we want to achieve"}),"\n",(0,s.jsxs)(n.p,{children:["You have a ",(0,s.jsx)(n.code,{children:"secret key"}),". You use that to ",(0,s.jsx)(n.code,{children:"encode"})," some information, which converts it from a readable form to an un-readable form, effectively garbage, which looks like random noise. You then transfer that garbage to somebody else, and they are then able to ",(0,s.jsx)(n.code,{children:"decrypt"})," it and get the message out. And anyone who's listening on your communication is unable to find out anything about the information that you are communicating."]}),"\n",(0,s.jsx)(n.h3,{id:"--solution-1-symmetric-system-bad",children:"- Solution 1: Symmetric System (BAD)"}),"\n",(0,s.jsxs)(n.p,{children:["The simplest way of thinking about it is to say, well there's a ",(0,s.jsx)(n.code,{children:"message"}),", like ",(0,s.jsx)(n.em,{children:'"hello"'}),", which I want to ",(0,s.jsx)(n.code,{children:"encrypt"}),", and so I do some process on it, using a ",(0,s.jsx)(n.code,{children:"secret key"}),", which then converts the ",(0,s.jsx)(n.code,{children:"message"})," into nonsense (i.e. ",(0,s.jsx)(n.em,{children:"xyz123"}),"), and then you send it to the other person, and they ",(0,s.jsx)(n.code,{children:"decrypt"})," it, with a process which is kind of the same but in reverse, using... the same ",(0,s.jsx)(n.code,{children:"secret key"}),", and then I get ",(0,s.jsx)(n.em,{children:'"hello"'})," back on the other end.",(0,s.jsx)(n.br,{}),"\n","And that's nice and simple, and it works.",(0,s.jsx)(n.br,{}),"\n","But it has a problem which is you both need to know what this ",(0,s.jsx)(n.code,{children:"secret key"})," is.",(0,s.jsx)(n.br,{}),"\n","So, if it's two people, and they want to communicate with one another privately, they'd have to agree on a ",(0,s.jsx)(n.code,{children:"secret key"}),", and then somehow share it with one another.",(0,s.jsx)(n.br,{}),"\n","So they might meet in the park late at night in secret and exchange envelops, or whatever. And this is the kind of things spies used to do.",(0,s.jsx)(n.br,{}),"\n","And the problem with that is... first it's very inconvenient, and secondly & most importantly - sometimes you physically can't do it.",(0,s.jsx)(n.br,{}),"\n","Like the case of two gentleman that have never met, yet they want to do something over the internet.",(0,s.jsx)(n.br,{}),"\n","So the problem becomes, how do I send this ",(0,s.jsx)(n.code,{children:"secret key"})," to you, without just sending it in plain-text, unencrypted.",(0,s.jsx)(n.br,{}),"\n","In order for us to share the key safely we need a secure encrypted connection, but we can't establish a secure encrypted connection without key!",(0,s.jsx)(n.br,{}),"\n","There's a way of solving this problem, which is with ",(0,s.jsx)(n.strong,{children:"Asymmetric Encryption"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"--solution-2-asymmetric-system-good-",children:"- Solution 2: Asymmetric System (Good !)"}),"\n",(0,s.jsxs)(n.p,{children:["What you do is you generate 2 keys. key*A & key_B.\nAnd basically? It's the same as before. You got your ",(0,s.jsx)(n.code,{children:"message"}),' that says *"Hello"_, you encrypt it with key_A, get garbage, send the garbage over to the other person, and then the other person uses key_B to decrypt it, and get out the ',(0,s.jsx)(n.code,{children:"message"}),".",(0,s.jsx)(n.br,{}),"\n","Now,\nyou can't guess one key from the other, but they are linked in such a way, that anything you encrypt with key_A, can only be decrypted with key_B.",(0,s.jsx)(n.br,{}),"\n","And anything that you encrypt with key_B, can only be decrypted with key_A.",(0,s.jsx)(n.br,{}),"\n",'And what you do is you generate a pair of these keys, which is also known as a key-pair, and you just pick one of them and you say "This is my ',(0,s.jsx)(n.code,{children:"public key"}),'", which makes the other one as your private. Now, the ',(0,s.jsx)(n.code,{children:"public key"})," is public. You publish it everywhere. You put it on email, you upload it to git provider server, to a GCP ubuntu machine, whatever. Basically the idea is it's everywhere out there in the world with your name on it.",(0,s.jsx)(n.br,{}),"\n","The private key, the other key of this pair, that one you keep absolutely secret.",(0,s.jsx)(n.br,{}),"\n","And you can do some really cool things with it once this system is set up.",(0,s.jsx)(n.br,{}),"\n","Consider a case where I generate a key-pair, and also you generate a key-pair.",(0,s.jsx)(n.br,{}),"\n","We both have one another's ",(0,s.jsx)(n.code,{children:"public keys"}),", so now... if you want to send me a message, I don't have to share anything with you. You just know my public key, encrypt something with my public key, send it to me, and you know that I can decrypt it, right? Because you know I have my private key.",(0,s.jsx)(n.br,{}),"\n","And then, there's another thing you can do with this, which is... if I encrypt something with my private key, and then publish it... now on the surface of it you think: well, what's the point of encrypting it with your ",(0,s.jsx)(n.code,{children:"private key"}),"? Because if your ",(0,s.jsx)(n.code,{children:"public key"})," is out there, then anyone can decrypt it, so why bother encrypting it?"]}),"\n",(0,s.jsxs)(n.p,{children:["But! The fact that it can be ",(0,s.jsx)(n.code,{children:"decrypted"})," with your ",(0,s.jsx)(n.code,{children:"public key"}),", means that it must have been ",(0,s.jsx)(n.code,{children:"encrypted"})," with your ",(0,s.jsx)(n.code,{children:"private key"}),". Which means that it must have been you who sent it, because only you have your ",(0,s.jsx)(n.code,{children:"private key"}),". Cryptographically, you can be certain that it's an authentic message really from that person."]}),"\n",(0,s.jsxs)(n.p,{children:["So the best thing happens when I do both!",(0,s.jsx)(n.br,{}),"\n","Where I ",(0,s.jsx)(n.code,{children:"encrypt"})," something with my ",(0,s.jsx)(n.code,{children:"private key"}),", and then with your ",(0,s.jsx)(n.code,{children:"public key"}),". And only then I send it to you.",(0,s.jsx)(n.br,{}),"\n","And if we communicate like this, I know nobody else can read the message. You know nobody else can read the message. You know that the message came from me, and not an imposter, and you also know that the message hasn't been modified, because any modification to the message also requires the keys.",(0,s.jsx)(n.br,{}),"\n","That's a great secure system, in which we didn't have to meet up in a park in shifty way and exchange envelopes. We in fact have never met."]}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"2-what-is-ssh",children:"2. What is SSH?"}),"\n",(0,s.jsx)(n.h3,{id:"--about-ssh",children:"- About SSH"}),"\n",(0,s.jsxs)(n.p,{children:["SSH, also known as ",(0,s.jsx)(n.code,{children:"Secure Shell"})," or ",(0,s.jsx)(n.code,{children:"Secure Socket Shell"}),", is a network protocol that gives users, particularly system administrators, a secure way to access a computer over an unsecured network."]}),"\n",(0,s.jsxs)(n.p,{children:["SSH also refers to the suite of utilities that implement the SSH protocol. ",(0,s.jsx)(n.code,{children:"Secure Shell"})," provides an ",(0,s.jsx)(n.strong,{children:"authentication mechanism"})," either by a strong password or by a ",(0,s.jsx)(n.code,{children:"public key"}),", as well as ",(0,s.jsx)(n.strong,{children:"an encrypted data communication system"})," between two computers connecting over an open network, such as the internet."]}),"\n",(0,s.jsx)(n.p,{children:"In addition to providing strong encryption, SSH is widely used by network administrators to manage systems and applications remotely, enabling them to log in to another computer over a network, execute commands and move files from one computer to another."}),"\n",(0,s.jsx)(n.p,{children:"SSH refers both to the cryptographic network protocol and to the suite of utilities that implement that protocol. SSH uses the client-server model. An SSH server, by default, listens on the standard Transmission Control Protocol (TCP) port 22."}),"\n",(0,s.jsx)(n.h3,{id:"--how-does-ssh-work",children:"- How does SSH work?"}),"\n",(0,s.jsx)(n.p,{children:"The most basic use of SSH is to connect to a remote host for a terminal session. The form of that command is the following:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"ssh UserName@SSHserver.example.com\n"})}),"\n",(0,s.jsx)(n.p,{children:"This command will cause the client to attempt to connect to the server named server.example.com, using the user ID UserName. If this is the first time negotiating a connection between the local host and the server, the user will be prompted with the remote host's public key fingerprint and prompted to connect, despite there having been no prior connection:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"The authenticity of host 'sample.ssh.com' cannot be established.\n DSA key fingerprint is 01:23:45:67:89:ab:cd:ef:ff:fe:dc:ba:98:76:54:32:10.\n Are you sure you want to continue connecting (yes/no)?\n"})}),"\n",(0,s.jsx)(n.p,{children:"Answering yes to the prompt will cause the session to continue, and the host key is stored in the local system's known_hosts file. This is a hidden file, stored by default in a hidden directory, called /.ssh/known_hosts, in the user's home directory. Once the host key has been stored in the known_hosts file, the client system can connect directly to that server again without need for any approvals; the host key authenticates the connection."}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"3-public-key-algorithms",children:"3. Public Key Algorithms"}),"\n",(0,s.jsxs)(n.p,{children:["SSH supports several public key algorithms for authentication keys. You need to choose an algorithm for how to generate your key, which would in turn affect its and security level.",(0,s.jsx)(n.br,{}),"\n","There are 4 available algorithms which you could choose to make that key."]}),"\n",(0,s.jsx)(n.h3,{id:"--option-1-rsa",children:"- option 1: rsa"}),"\n",(0,s.jsx)(n.p,{children:"An old algorithm based on the difficulty of factoring large numbers. A key size of at least 2048 bits is recommended for RSA; 4096 bits is better. RSA is getting old and significant advances are being made in factoring. Choosing a different algorithm may be advisable. It is quite possible the RSA algorithm will become practically breakable in the foreseeable future. All SSH clients support this algorithm."}),"\n",(0,s.jsx)(n.h3,{id:"--option-2-dsa",children:"- option 2: dsa"}),"\n",(0,s.jsx)(n.p,{children:"An old US government Digital Signature Algorithm. It is based on the difficulty of computing discrete logarithms. A key size of 1024 would normally be used with it."}),"\n",(0,s.jsx)(n.admonition,{type:"caution",children:(0,s.jsx)(n.p,{children:"DSA in its original form is no longer recommended."})}),"\n",(0,s.jsx)(n.h3,{id:"--option-3-ecdsa",children:"- option 3: ecdsa"}),"\n",(0,s.jsx)(n.p,{children:"A new Digital Signature Algorithm standardized by the US government, using elliptic curves. This is probably a good algorithm for current applications. Only three key sizes are supported: 256, 384, and 521 (sick!) bits. We would recommend always using it with 521 bits, since the keys are still small and probably more secure than the smaller keys (even though they should be safe as well). Most SSH clients now support this algorithm."}),"\n",(0,s.jsx)(n.h3,{id:"--option-4-ed25519",children:"- option 4: ed25519"}),"\n",(0,s.jsx)(n.p,{children:"This is a new algorithm added in OpenSSH. Support for it in clients is not yet universal. Thus, its use in general purpose applications may not yet be advisable."}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"4-generate-a-key-pair-public--private",children:"4. Generate a key-pair (public & private)"}),"\n",(0,s.jsx)(n.p,{children:"Run either one of these commands:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"option 1: rsa"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"ssh-keygen -t rsa -b 4096 -C talkohavy\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"option 2: dsa"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"ssh-keygen -t dsa\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["option 3: ecdsa ( ",(0,s.jsx)(n.strong,{children:"recommended!!!"})," )"]}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"ssh-keygen -t ecdsa -b 521 -f ${HOME}/.ssh/id_ecdsa -C my-main-key\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"option 4: ed25519"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"ssh-keygen -t ed25519\n"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"option 5: the default one (find out what this means!!!)"}),"\n"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"ssh-keygen\n"})}),"\n",(0,s.jsxs)(n.p,{children:["I recommend using option 3, with ",(0,s.jsx)(n.code,{children:"ecdsa"}),".",(0,s.jsx)(n.br,{}),"\n","Why? Well, for the reason mentioned above."]}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"rsa"})," is getting old, so even though all SSH clients support this algorithm, choosing a different algorithm is advised."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"dsa"})," is out of the question."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"ecdsa"})," is a new Digital Signature Algorithm standardized by the US government, is considered a good algorithm for current applications. It is recommended you always use it with a key size of 521 bits. Also, most SSH clients now support this algorithm."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["By running this command, you've created a key-pair (private & public) in a directory called ",(0,s.jsx)(n.code,{children:".ssh"}),", probably located here:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"cd ~/.ssh\n"})}),"\n",(0,s.jsx)(n.p,{children:"Print the public key:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"cat ~/.ssh/id_rsa.pub\n"})}),"\n",(0,s.jsx)(n.hr,{}),"\n",(0,s.jsx)(n.h2,{id:"5-create-a-second-key-pair-of-publicprivate-keys",children:"5. Create a second key-pair of public/private keys"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:(0,s.jsx)("font",{size:"6",children:"TLDR;"})}),(0,s.jsx)(n.br,{}),"\n",(0,s.jsxs)(n.strong,{children:["Two different ",(0,s.jsx)(n.code,{children:"accounts"}),", on the same git provider, CANNOT share the same ",(0,s.jsx)(n.code,{children:"public key"}),"!!!"]})]}),"\n",(0,s.jsx)(n.h3,{id:"--the-background-story",children:"- The background story"}),"\n",(0,s.jsxs)(n.p,{children:["You have an ",(0,s.jsx)(n.code,{children:"account"})," on a git provider (Bitbucket / Github / etc. ).",(0,s.jsx)(n.br,{}),"\n","You want to clone a project from that ",(0,s.jsx)(n.code,{children:"account"}),", to your ",(0,s.jsx)(n.code,{children:"computer"}),".",(0,s.jsx)(n.br,{}),"\n","The clone operation asks that you verify yourself (authenticate), and nowadays the only way to do that is with an SSH call, in which your computer both sends a ",(0,s.jsx)(n.code,{children:"public key"}),", and receives a ",(0,s.jsx)(n.code,{children:"public key"})," from the other person (in which case - the git provider).",(0,s.jsx)(n.br,{}),"\n","Today, all git providers ask that on your ",(0,s.jsx)(n.code,{children:"account"})," you set/provide a ",(0,s.jsx)(n.strong,{children:"unique"})," ",(0,s.jsx)(n.code,{children:"public key"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["When you clone a project, you essentially send an SSH request behind the scenes, which uses your ",(0,s.jsx)(n.code,{children:"default private key"}),". You did not tell it which key to pick from! it took picked the default one automatically! Your git provider will then use the ",(0,s.jsx)(n.code,{children:"public key"}),", which you uploaded to it before hand, to try and decipher the message."]}),"\n",(0,s.jsxs)(n.p,{children:["Now here's the kicker:",(0,s.jsx)(n.br,{}),"\n","A single ",(0,s.jsx)(n.code,{children:"account"})," may have ",(0,s.jsx)(n.em,{children:"many"})," ",(0,s.jsx)(n.code,{children:"projects"})," in it (i.e. ",(0,s.jsx)(n.code,{children:"repositories"}),"), and all those ",(0,s.jsx)(n.code,{children:"projects"})," may use the same ",(0,s.jsx)(n.code,{children:"account"})," level ",(0,s.jsx)(n.code,{children:"public key"}),". This is great! I can create as many ",(0,s.jsx)(n.code,{children:"projects"})," as I like, and use the same ",(0,s.jsx)(n.code,{children:"public key"}),"! I can share my ",(0,s.jsx)(n.code,{children:"public key"})," across different ",(0,s.jsx)(n.code,{children:"projects"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["So why do I need a second ",(0,s.jsx)(n.code,{children:"key-pair"})," of public/private keys?"]}),"\n",(0,s.jsxs)(n.p,{children:["There's a harsh rule that goes for all git providers, which says:",(0,s.jsx)(n.br,{}),"\n",(0,s.jsxs)(n.strong,{children:["Two different ",(0,s.jsx)(n.code,{children:"accounts"}),", on the same git provider, CANNOT share the same ",(0,s.jsx)(n.code,{children:"public key"}),"!!!"]})]}),"\n",(0,s.jsx)(n.p,{children:"Two questions which you can ask:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Why do you have two accounts?"}),"\n",(0,s.jsx)(n.li,{children:"Can't you just use another computer?"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Answer to 1: I have a two ",(0,s.jsx)(n.code,{children:"accounts"}),", because the first one is my own personal account, and the second one is a work account, provided to me on a company email."]}),"\n",(0,s.jsxs)(n.p,{children:["Answer to 2: Technically, yes, that would solve my problem, because the pairing between ",(0,s.jsx)(n.code,{children:"a computer"})," and a ",(0,s.jsx)(n.code,{children:"git provider account"})," is what causing the problem. How would a different computer solve the problem? Because that second computer would have a ",(0,s.jsx)(n.strong,{children:"different"})," ",(0,s.jsx)(n.code,{children:"key-pair"}),", which for that second computer it would be the ",(0,s.jsx)(n.code,{children:"default private key"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"--step-1-generate-a-second-public-key",children:"- Step 1: generate a second public key"}),"\n",(0,s.jsx)(n.p,{children:"Run this command:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"ssh-keygen -t rsa -b 4096 -C tal_home_2 -f id_rsa_2\n"})}),"\n",(0,s.jsxs)(n.p,{children:["What this command did was generate 2 more files (another key-pair) inside your ",(0,s.jsx)(n.code,{children:".ssh"})," folder, ",(0,s.jsx)(n.code,{children:"id_rsa_2"})," & ",(0,s.jsx)(n.code,{children:"id_rsa_2.pub"}),"."]}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["Note that I added a NEW flag -f to specify the name of the two generated files. If I hadn't, the default name would be ",(0,s.jsx)(n.code,{children:"id_rsa"}),", which is a file that I already have, and would therefore get overridden."]})}),"\n",(0,s.jsx)(n.h3,{id:"--step-2-creating-a-config-file",children:"- Step 2: Creating a config file"}),"\n",(0,s.jsx)(n.p,{children:"Creating the new key-pair isn't enough, because we need a way to tell our SSH API call to use it."}),"\n",(0,s.jsxs)(n.p,{children:["Earlier we said that the ",(0,s.jsx)(n.code,{children:"git pull"})," and ",(0,s.jsx)(n.code,{children:"git clone"})," commands issue an SSH API call behind the scenes. And when it does, when an SSH API call is being issued, it actually goes behind the scenes and looks for a ",(0,s.jsx)(n.code,{children:"config file"})," named ",(0,s.jsx)(n.code,{children:"config"}),", and operates according to what it says.",(0,s.jsx)(n.br,{}),"\n","In the absence of a config file, it ",(0,s.jsx)(n.strong,{children:"by default"})," reaches for the ",(0,s.jsx)(n.code,{children:"default private key"})," named as ",(0,s.jsx)(n.code,{children:"id_rsa"}),".",(0,s.jsx)(n.br,{}),"\n","Now that we have 2 id_rsa's, we don't want this behavior to continue, so we need to create a ",(0,s.jsx)(n.code,{children:"config"})," file to override the default behavior."]}),"\n",(0,s.jsxs)(n.p,{children:["Inside the ",(0,s.jsx)(n.code,{children:".ssh"})," directory, create a config file named ",(0,s.jsx)(n.code,{children:"config"}),", without an extension:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"code $HOME/.ssh/config\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Fill the ",(0,s.jsx)(n.code,{children:"config"})," file with this:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"# Account 1\nHost bitbucket.org\n Hostname bitbucket.org\n IdentityFile ~/.ssh/id_rsa\n\n# Account 2\nHost bitbucket.org_2\n Hostname bitbucket.org\n IdentityFile ~/.ssh/id_rsa_2\n"})}),"\n",(0,s.jsxs)(n.p,{children:["You see here 2 blocks.",(0,s.jsx)(n.br,{}),"\n","Blocks are divided by the ",(0,s.jsx)(n.code,{children:"Host"}),". Each host must be unique.",(0,s.jsx)(n.br,{}),"\n","You can tell that I've created 2 directives, one for each account.",(0,s.jsx)(n.br,{}),"\n","Account 1 will be the default case. It represents what usually happens in cases which we do not have a config file.",(0,s.jsx)(n.br,{}),"\n","It states the:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"host"}),": The URL provided by us."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"hostname"}),": The ACTUAL URL of the remote server (in our case it's the git provider \u2013 bitbucket)."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.strong,{children:"IdentityFile"}),": A ",(0,s.jsx)(n.code,{children:"relative path"})," to the ",(0,s.jsx)(n.code,{children:"private-key"})," file to be used for the encryption of the message that would be sent over using the SSH API call."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Account 2 will be the ",(0,s.jsx)(n.strong,{children:"UNIQUE"})," case.",(0,s.jsx)(n.br,{}),"\n","This is where it gets interesting.",(0,s.jsx)(n.br,{}),"\n",'In the host part, the URL which we provide, we\'re adding a "_2" (could be anything we want), and in the ',(0,s.jsx)(n.code,{children:"IdentityFile"})," we mention the path to the second ",(0,s.jsx)(n.code,{children:"private-key"})," file."]}),"\n",(0,s.jsx)(n.h3,{id:"--step-3-do-a-git-clone",children:"- Step 3: do a git clone"}),"\n",(0,s.jsxs)(n.p,{children:["Let's do a git clone as you normally would, only now add the '_2' to the host.",(0,s.jsx)(n.br,{}),"\n","So instead of doing this:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"git clone git@bitbucket.org:talkohavy/email-builder.git\n"})}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-bash",children:"git clone git@bitbucket.org_2:talkohavy/email-builder.git\n"})}),"\n",(0,s.jsx)(n.p,{children:"Press Enter and... Cross fingers!"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Enjoy! :-)"})})]})}function l(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},5710:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>a});var s=t(758);const i={},o=s.createContext(i);function r(e){const n=s.useContext(o);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),s.createElement(o.Provider,{value:n},e.children)}}}]);