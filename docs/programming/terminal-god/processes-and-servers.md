# Processes & Servers

If you're in a container, you'll probably need to run this first:

```bash
apt-get update
```

To have access to `lsof` run:

```bash
apt-get install -y lsof
```

To have access to `netstat` run:

```bash
apt-get install -y net-tools
```

```bash
lsof -i -P -n | grep LISTEN
```

```bash
ps
```

```bash
echo '{ "a": true, "name": "tal kohavy", "age": 28, "hobbies": ["computers", "sports"], "agent": null }' | jq
```
