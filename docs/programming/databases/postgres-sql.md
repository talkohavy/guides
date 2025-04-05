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

### - Command 1: Connect to database

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

### - Command 2: List all databases

**The command:**

```bash
psql --list
```

**Description:**

List available databases, then exit.

---

## 4. Interactive Shell Commands

### - Command 0: Show help menu

**The Command:**

```bash
\?
```

**Description:**

Shows help information.

<br/>

### - Command 1: Show connection info

**The Command:**

```bash
\conninfo
```

**Description:**

Outputs information about the current connection. Details like:

- current database name
- current port number
- current user name
- connection type

<br/>

### - Command 2: Lists server configuration

**The Command:**

```bash
\dconfig[+] *
```

**Description:**

Lists server configuration parameters and their values.

Common use is: `\dconfig *`

If `pattern` is specified, only parameters whose names match the `pattern` are listed. Without a `pattern`, only parameters that are set to non-default values are listed. (Use `\dconfig *` to see all parameters.) If `+` is appended to the command name, each parameter is listed with its data type, context in which the parameter can be set, and access privileges (if non-default access privileges have been granted).

<br/>

### - Command 3: Change user password

```bash
\password USERNAME
```

Set a password for user USERNAME.

You'll be prompted to enter a new password and confirm it.

<br/>

### - Command 4: Close Connection/Terminal

```bash
\q
```

Or...

```
ctrl+D
```

Quit the `postgresql` terminal.

<br/>

### - Command 5: List of roles

**The Command:**

```bash
\dg[+]
```

Or...

```bash
\du
```

**Description:**

List out all roles (users) and their associated attributes, such as whether they have superuser privileges, can create databases, or can create new roles.

Since the concepts of "users" and "groups" have been unified into "roles", this command is now equivalent to `\du`.

By default, **only user-created roles are shown**; Use the `S` option to **include system roles**.

If the form `\dg+` is used, additional information is shown about each role; currently this adds the comment for each role.

<br/>

### - Command 6: List all databases

**The Command:**

```bash
\l[+]
```

Or...

```bash
\list[+]
```

**Description:**

List the databases in the server.

Lists the databases and show their:

- names
- owners
- character set encodings
- access privileges

If `+` option is used, it also displays:

- database sizes
- default tablespaces
- descriptions

<br/>

### - Command 7: List all tables

**The Command:**

```bash
\dt[S+]
```

**Description:**

List all user-defined tables.

Add the `S` option to have **system objects** be shown as well.

<br/>

### - Command 8: Show details on a table

**The Command:**

```bash
\d table_name
```

**Description:**

This will show you information about a table's columns:

- a column's name
- a column's type
- is it nullable
- a column's default value (if a default even exists)
- the table's primary key
- all indexes defined on the table

You can add a `+` sign, an `S` char right after `\d` (no space), to get some extra information.

:::info
If `\d` is used without a pattern argument, it is equivalent to `\dtvmsE` which will show a list of all visible tables, views, materialized views, sequences and foreign tables. This is purely a convenience measure.
:::

<br/>

### - Command 9: List all functions

**The Command:**

```bash
\df
```

**Description:**

Lists functions

Also display their:

- result data types
- argument data types
- function types, which are classified as "agg" (aggregate), "normal", "procedure", "trigger", or "window".

To display only functions of specific type(s), add the corresponding letters `a`, `n`, `p`, `t`, or `w` to the command.

If `pattern` is specified, only functions whose names match the pattern are shown.

Add the `S` option to also show **system objects**, and not only user-created objects.

If the form `\df+` is used, additional information about each function is shown, including volatility, parallel safety, owner, security classification, access privileges, language, and description.

Source code for a specific function can be seen using `\sf`.

<br/>

### - Command 10: Switch to a different database

**The Command:**

```bash
\c DATABASE_NAME
```

**Description:**

Switch to a different database on your server.

The `\c` used by itself establishes a new connection to a PostgreSQL server. It uses the same params as the current connection, and terminates the existing connection.

<br/>

### - Command 11: Get/Set Output Variables

**The Command:**

```bash
\pset
```

And:

```bash
\pset option
```

And:

```bash
\pset option value
```

**Description:**

This command can **get or set options affecting the output** of query result tables.

- Calling `\pset` without any arguments **displays the current status of all printing options**.
- Calling `\pset option` on:
  - boolean options, causes the option to be toggled or unset.
  - non-boolean options, get the value currently set fot that option.
- Calling `\pset option value`, assigned _value_ to _option_. The semantics of _value_ vary depending on the selected _option_.

#### - Option 1: border

**Default:** 1

Should be a number. Mostly 0 or 1 is what affects more formats, but in html the higher the number the bolder the border.

#### - Option 2: format

**Default:** `aligned`.

Options are: `aligned`, `asciidoc`, `csv`, `html`, `latex`, `latex-longtable`, `troff-ms`, `unaligned`, or `wrapped`.

#### - Option 3: linestyle

**Default:** `ascii`.

Options are: `ascii` | `unicode`.

The `unicode` value can receive border values of: `0`, `1`, `2`.

#### - Option 4: unicode_border_linestyle

**Default:** `single`.

Option are: `single` | `double`.

Sets the border drawing style for the unicode line style.

#### - Option 5: unicode_header_linestyle

**Default:** `single`.

Option are: `single` | `double`.

Sets the header drawing style for the unicode line style.

#### - Option 6: null

**Default:** `ascii`.

Sets the string to be printed in place of a null value. The default is to print nothing, which can easily be mistaken for an empty string. For example, one might prefer `\pset null '(null)'`.

#### - Option 7: title

**Default:** `empty string`.

Give a table a Title.  
For example: `\pset title 'Score Overview'`

Note: there's a difference between `'Score Overview'` and `"Score Overview"`.

In the latter, the `"` would be shown, whereas in the former, it would not.

<br/>

### - Command: 12: Execute query from a `file`

**The Command:**

```bash
`\i` or `\include filename`
```

**Description:**

Reads input from the file `filename` and executes it.

:::tip
If you want to see the lines on the screen as they are read you must set the variable `ECHO` to `all`.
:::

<br/>

### - Command: 13: Show/Edit code of Function or Stored-Procedure

**The Command:**

```bash
\sf function_name
```

Or...

```bash
\ef function_name
```

**Description:**

Shows code of a named function/procedure.

If `+` is used, output lines are numbered.

Regarding an **edit**:

- If you quit the editor without saving, the statement is discarded.
- If you save and exit the editor:
  - if you added a semicolon to it, the updated command is executed immediately.
  - if not, it is redisplayed; type `;` or `\g` to send it, or `\r` to cancel.

<br/>

### - Command: 14: Bind values to placeholders

**The Command:**

```bash
\bind [ parameter ]
```

**Description:**

Sets query parameters for the next query execution, with the specified parameters passed for any parameter placeholders ($1 etc.).

**Example Usage:**

```bash
INSERT INTO tbl1 VALUES ($1, $2) \bind 'first value' 'second value' \g
```

<br/>

### - Other notable commands

Other notable meta-commands:

- `\! pwd`: Prints your **current working directory**.
- `\di+`: Shows a list of all defined **indexes** defined on tables.
- `\dT`: Lists **data types**.
- `\ev`: Edit a named view.
