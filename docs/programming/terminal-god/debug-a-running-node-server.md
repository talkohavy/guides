# Debugging a running node server

## - Step 1: Make sure it's running

```bash
ps aux | grep node
```

or:

```bash
ss -tupln | grep 9080
```

Options:

- t → TCP
- u → UDP
- l → listening
- p → show process
- n → don’t resolve names

## - Step 2: curl to the service

```bash
curl -v http://localhost:9080
```

### Step 3: sniff on requests coming to the device

```bash
sudo tcpdump -i any port 9080 -n
```

With filtering:

```bash
sudo tcpdump -i any port 9080 and src host 192.168.1.25
```

Or destination host (your VM IP):

```bash
sudo tcpdump -i any port 9080 and dst host 192.168.1.100
```
