# CLI Commands

## - Command 1: Connect to database

**The command:**

```bash
psql [option...] [dbname [username]]
```

**Description:**

Connects to a database.

When you run psql without specifying any flags, it attempts to connect using the following default values:

| Setting           | Default Value                              | How to Override                                 |
| ----------------- | ------------------------------------------ | ----------------------------------------------- |
| User (`-U`)       | Your system username (`$USER`)             | `PGUSER=username` or `psql -U username`         |
| Database (`-d`)   | Same as the username                       | `PGDATABASE=dbname` or `psql -d dbname`         |
| Host (`-h`)       | `localhost` (Unix socket)                  | `PGHOST=hostname` or `psql -h hostname`         |
| Port (`-p`)       | `5432` (default PostgreSQL port)           | `PGPORT=port` or `psql -p port`                 |
| Connection Method | Unix domain socket (`/tmp/.s.PGSQL.5432`)  | `PGHOST=127.0.0.1` forces TCP/IP                |
| Password          | No password prompt (if not required)       | If needed, prompted or stored in `~/.pgpass`    |
| SSL               | Depends on `sslmode` (`prefer` by default) | `PGSSLMODE=disable` or `psql "sslmode=require"` |

**Usage:**

```bash
psql -U talkohavy -d talkohavy -h localhost -p 5432 -E
```

Mentioned above are the defaults ☝🏼

**Using a Connection String:**

You can also connect using a PostgreSQL connection string (also known as a connection URI):

```bash
psql postgresql://username:password@host:port/database
```

**Example:**

```bash
psql postgresql://postgres:1234@localhost:5432/users
```

This is equivalent to:

```bash
psql -U postgres -d users -h localhost -p 5432
```

The connection string format is:

```
postgresql://[user[:password]@][host][:port][/dbname][?param1=value1&...]
```

Where:

- `user` - The database username
- `password` - The user's password (optional, you'll be prompted if omitted)
- `host` - The server hostname or IP address (default: localhost)
- `port` - The port number (default: 5432)
- `dbname` - The database name
- `param1=value1` - Additional connection parameters (optional)

:::warning
Including passwords in connection strings is **not recommended for security reasons**, especially in scripts or shared documentation. Consider using environment variables or the `~/.pgpass` file instead.
:::

<br/>

## - Command 2: List all databases

**The command:**

```bash
psql --list
```

**Description:**

List available databases, then exit.
