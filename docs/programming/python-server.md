# Guide For Building a Server in Python

## 1. Sharing Files Between 2 machines

This is a nice way to have 2 machines share files with one another.  
This is useful only when 2 machines are found on the same local network.

Find out the IP of the hosting machine by running:

```bash
ifconfig
```

Let's say the IP was `192.168.0.100`.

Now, inside the hosting machine, navigate to the folder you wish to host, and there run the following command:

```bash
python3 -m http.server 3000 --bind 192.168.0.100
```

A server starts up running and serving the contents of that folder.

You'll get back an IP address, which you then need to type into the URL part of the browser inside machine 2.

Good Luck 🙂 Happy sharing!
