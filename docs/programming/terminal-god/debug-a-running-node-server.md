# Debugging a running node server

## - Case 1: What app is running on port :4800

```bash
lsof -i :4800
```

## - Case 2: List node apps are currently running?

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

## - Case 3: How to sniff on requests coming to the device?

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
