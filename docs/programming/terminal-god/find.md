# Find

## - Example 1: All in 1 command

```bash
find . -name "*.js" -not -path "*/node_modules/*" -type f -delete
```

## - Example 2: Find file by exact name

```bash
find . -name file.ext
```

## - Example 3: Find file but exclude folder from search

```bash
find . -name file.ext -not -path "*/node_modules/*"
```

## - Example 4: Find all files that end in ".js"

```bash
find . -name "*.js"
```

## - Example 5: Delete all files that end in ".js"

```bash
find . -name "*.js" -delete
```
