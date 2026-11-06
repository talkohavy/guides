# Create a Database

## 1. Create it

When we installed `postgresql`, a default database named **postgres** was created for us. Rather than putting everything in it, it's better to create a database with a unique name for each service:

```sql
CREATE DATABASE nameofservice;
```

## 2. Check that it was created

List all databases:

```sql
\list
```

or just:

```sql
\l
```

## 3. Connect to it

From inside `psql`, switch to the new database:

```sql
\c nameofservice
```

Or connect to it directly from your terminal:

```bash
psql nameofservice
```
