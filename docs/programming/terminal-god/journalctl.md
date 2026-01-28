# Journalctl

## List by service name `-u`:

```bash
journalctl -u SERVICE_NAME
```

## You can use `--since` flag:

```bash
journalctl -u SERVICE_NAME --since "1 hour ago"
journalctl -u SERVICE_NAME --since yesterday
journalctl -u SERVICE_NAME --since today
journalctl -u SERVICE_NAME --since "2026-01-23 14:00"  --until "2026-01-27 15:30:00"
```

## You can mention number of rows to view:

```bash
journalctl -u SERVICE_NAME -f -n 100
```

## Show errors only:

```bash
journalctl -u SERVICE_NAME -p err
```

## List all services:

```bash
systemctl list-units --type=service | grep foo
```
