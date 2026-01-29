# tar

Bundle files and directories into a single archive file. Use with gzip for compression (`.tar.gz`).

## 1. Create an uncompressed archive

Bundle files or a directory into one `.tar` file:

```bash
tar -cvf archive.tar file1.txt file2.txt
tar -cvf archive.tar mydir/
```

## 2. Create a compressed archive (.tar.gz)

Same as above, but compress with gzip. Use `-z` (or `--gzip`):

```bash
tar -czvf archive.tar.gz file1.txt file2.txt
tar -czvf archive.tar.gz mydir/
```

## 3. Extract an archive

Extract in the current directory:

```bash
tar -xvf archive.tar
tar -xzvf archive.tar.gz
```

Extract to a specific directory:

```bash
tar -xvf archive.tar -C /path/to/dest/
tar -xzvf archive.tar.gz -C /path/to/dest/
```

## 4. List contents without extracting

```bash
tar -tvf archive.tar
tar -tzvf archive.tar.gz
```

## Known flags

### `-c`

Create a new archive.

The `-c` flag is **REQUIRED**. You must pass `-c` when you want to bundle files into a new `.tar` or `.tar.gz`. Without it, `tar` will complain.  
The `-c` **CAN** be omitted only when you use `-x` (extract) or `-t` (list) instead.

### `-x`

Extract from an archive.

### `-v`

Verbose: list files as they are processed.

### `-f`

Archive filename. Must come last before the filename (e.g. `-cvf archive.tar`).

### `-z`

Use gzip (for `.tar.gz` / `.tgz`). Use when creating with `-c` or extracting.

### `-C`

Extract (or create) in the given directory.

### `-t`

List contents of an archive (no extract).

## Quick reference

| Goal            | Command                             |
| --------------- | ----------------------------------- |
| Create .tar     | `tar -cvf out.tar files_or_dir`     |
| Create .tar.gz  | `tar -czvf out.tar.gz files_or_dir` |
| Extract .tar    | `tar -xvf archive.tar`              |
| Extract .tar.gz | `tar -xzvf archive.tar.gz`          |
| List contents   | `tar -tvf archive.tar`              |
