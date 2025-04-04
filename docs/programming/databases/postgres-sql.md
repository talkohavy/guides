# Guide For Postgres SQL

## 1. Getting Started

Installing postgresql on macOS (using Homebrew):

```bash
brew install postgresql
```

Then start the service:

```bash
brew services start postgresql
```

The next command should **fail** for you:

```bash
psql
```

by saying something like:

```
psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL:  database "talkohavy" does not exist
```

That's because installing `postgresql` using brew creates a database named `postgres`.
Now, try running:

```bash
psql postgres
```

and you'll be logged in! 🙂  
You'll see something like:

```
psql (14.13 (Homebrew))
Type "help" for help.

postgres=#
```

Let's list all the available databases to prove postgres is one of them:

```sql
\list
```

or:

```sql
\l
```

for short.

You should see something like:

```
                              List of databases
   Name    |   Owner   | Encoding | Collate | Ctype |    Access privileges
-----------+-----------+----------+---------+-------+-------------------------
 postgres  | talkohavy | UTF8     | C       | C     |
 template0 | talkohavy | UTF8     | C       | C     | =c/talkohavy           +
           |           |          |         |       | talkohavy=CTc/talkohavy
 template1 | talkohavy | UTF8     | C       | C     | =c/talkohavy           +
           |           |          |         |       | talkohavy=CTc/talkohavy
(3 rows)
```

Let's create a database for your machine name:

```sql
CREATE DATABASE talkohavy;
```

List out your databases again to see that it was actually created:

```sql
\list
```

Now, you should be able to connect to your newly created aaa database with:

```bash
psql talkohavy
```

:::tip
if the **name of your new database** is similar to **your machine username**, then you can simply type `psql` for short:
:::

```bash
psql
```

Let's create our first table now:

```sql
CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    spelling VARCHAR(255),  -- or use TEXT for longer strings
    score INT CHECK (score >= 0 AND score <= 100)
);
```

Let's add a few records to the new "words" table:

```sql
INSERT INTO words (word, score) VALUES
('Hello world', 10),
('PostgreSQL is great', 20),
('Database management', 30),
('Learning SQL', 40);
```

---

## 2. A Full Connection Flow

Here is what's happening behind the scenes when you run the command of `psql`:

#### **Step 1: Read Environment Variables**

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

#### **Step 2: Parse Command-Line Arguments**

If you specify options, `psql` parses them:

```sh
psql -U myuser -d mydatabase -h myhost -p 5432
```

This is equivalent to setting environment variables manually.

#### **Step 3: Reads Configuration Files**

Before launching the interactive shell, `psql` checks for a user-specific configuration file (if exists) at:

```sh
cat ~/.psqlrc
```

Or...

```sh
cat /opt/homebrew/var/postgresql@14/postgresql.conf
```

#### **Step 4: Connects to PostgreSQL**

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

#### **Step 5: Launches the Interactive CLI**

If the connection is successful, you enter the `psql` interactive shell, which:

- Displays a welcome message with connection details.
- Waits for SQL commands or `\` meta-commands (like `\dt` for tables).
- Reads commands, sends them to the PostgreSQL server, and displays results.

#### **Step 6: Session Management & History**

Every valid command is logged in:

```bash
cat ~/.psql_history
```

#### **Step 7: Closing the Session**

Typing `\q` or pressing `Ctrl+D` exits `psql`.
The session history is saved for the next time you use `psql`.

---

## 3. CLI Commands

### - Command 1: `psql` - connect to database

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

<br/>

### - Command 2: `psql --list` - list all databases

**The command:**

```bash
psql --list
```

**Description:**

List available databases, then exit.

---

## 4. Interactive Shell Commands

Log into your sql server.

### - 2. \list

```sql
\list
```

or:

```sql
\l
```

for short

Lists out all your databases.

### - 3. \q

```sql
\q
```

Quit the postgresql terminal.

### - 4. \du

```sql
\du
```

List out all roles (users) and their associated attributes, such as whether they have superuser privileges, can create databases, or can create new roles.

Example output:

```
                                   List of roles
 Role name |                         Attributes                         | Member of
-----------+------------------------------------------------------------+-----------
 talkohavy | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
```

### - 5. \password

```sql
\password USERNAME
```

Set a password for user USERNAME.

You'll be prompted to enter a new password and confirm it.

### - 6. \dt

```sql
\dt
```

or:

```sql
\dt+
```

List out all your tables.

### - 7 \c

```sql
\c DATABASE_NAME
```

Switch to a different database on your server.
