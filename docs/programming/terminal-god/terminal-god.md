# Processes & Servers

## - Tip Number 1: lsof

If you're in a container, you'll probably need to run this first:

```bash
apt-get update
```

To have access to `lsof` run:

```bash
apt-get install -y lsof
```

Use it like so:

```bash
lsof -i -P -n | grep LISTEN
```

## - Tip Number 2: netstat

To have access to `netstat` run:

```bash
apt-get install -y net-tools
```

Use it like so:

```bash
netstat -nav
```

## - Tip Number 3: ps

```bash
ps
```

## - Tip Number 4: jq

```bash
echo '{ "a": true, "name": "tal kohavy", "age": 28, "hobbies": ["computers", "sports"], "agent": null }' | jq
```

## - Tip Number 5: find

```bash
find . -name file.ext
```
