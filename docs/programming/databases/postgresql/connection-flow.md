# A Full Connection Flow

Here is what's happening behind the scenes when you run the command of `psql`:

## Step 1: Read Environment Variables

Before connecting, `psql` checks **environment variables** that define connection details. The most common ones are:

- `PGHOST` – The database server’s hostname (default: localhost)
- `PGPORT` – The port number (default: 5432)
- `PGUSER` – The username to connect with
- `PGDATABASE` – The database name to connect to
- `PGPASSWORD` – The password (not recommended for security reasons)

You can check these values using:

```sh
env | grep PG
```

## Step 2: Parse Command-Line Arguments

If you specify options, `psql` parses them:

```sh
psql -U myuser -d mydatabase -h myhost -p 5432
```

This is equivalent to setting environment variables manually.

## Step 3: Reads Configuration Files

Before launching the interactive shell, `psql` checks for a user-specific configuration file (if exists) at:

```sh
cat ~/.psqlrc
```

Or...

```sh
cat /opt/homebrew/var/postgresql@14/postgresql.conf
```

## Step 4: Connects to PostgreSQL

Once all parameters are set, `psql` attempts to establish a connection to the PostgreSQL server:

- If `PGHOST=localhost`, it tries a **Unix domain socket** at:

  ```bash
  /tmp/.s.PGSQL.5432
  ```

- If a remote host is specified, it connects via **TCP/IP**.

If authentication is required, `psql`:

1. Checks for stored passwords in `~/.pgpass` (if it exists).
2. Prompts the user for a password if needed.
3. Follows authentication rules in `pg_hba.conf` on the server.

## Step 5: Launches the Interactive CLI

If the connection is successful, you enter the `psql` interactive shell, which:

- Displays a welcome message with connection details.
- Waits for SQL commands or `\` meta-commands (like `\dt` for tables).
- Reads commands, sends them to the PostgreSQL server, and displays results.

## Step 6: Session Management & History

Every valid command is logged in:

```bash
cat ~/.psql_history
```

## Step 7: Closing the Session

Typing `\q` or pressing `Ctrl+D` exits `psql`.
The session history is saved for the next time you use `psql`.
