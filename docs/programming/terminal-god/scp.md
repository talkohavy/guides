# scp

## 1. Copy from local → remote

Execute from local:

```bash
scp file.txt user@remoteHost:/remote/path/
```

Examples:

```bash
# Copy file `default.json` from local to remote without rename:
scp ./config/default.json qa@dex-c54b.example.com:/tmp/

# Copy folder `mappings` from local to remote without rename:
scp -r mappings qa@dex-c54b.example.com:/tmp/

# Copy file `default.json` from local to remote WITH rename:
scp ./config/default.json qa@dex-c54b.example.com:/tmp/main.json
```

## 2. Copy from remote → local

Execute from local:

```bash
# Copy `file.txt` from remote to local without rename:
scp user@remoteHost:/remote/path/file.txt /tmp/

# Copy `file.txt` WITH rename:
scp user@remoteHost:/remote/path/file.txt /tmp/data.txt
```

## Known flags

### `-r`

Copy a directory

```bash
scp -r /local/dir user@remoteHost:/remote/path/
```
