# scp

## 1. Copy from local → remote

```bash
scp file.txt user@remotehost:/remote/path/
```

Examples:

> `scp ./config/default.json qa@dex-c54b.example.com:/tmp/`
> `scp -r mappings qa@dex-c54b.example.com:/tmp/`

## 2. Copy from remote → local

```bash
scp user@remotehost:/remote/path/file.txt /local/path/
```

## Known flags

### `-r`

Copy a directory

```bash
scp -r /local/dir user@remotehost:/remote/path/
```
