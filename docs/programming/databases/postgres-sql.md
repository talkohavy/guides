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

> _psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL: database "talkohavy" does not exist_

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

#### Step 1: Read Environment Variables

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

#### Step 2: Parse Command-Line Arguments

If you specify options, `psql` parses them:

```sh
psql -U myuser -d mydatabase -h myhost -p 5432
```

This is equivalent to setting environment variables manually.

#### Step 3: Reads Configuration Files

Before launching the interactive shell, `psql` checks for a user-specific configuration file (if exists) at:

```sh
cat ~/.psqlrc
```

Or...

```sh
cat /opt/homebrew/var/postgresql@14/postgresql.conf
```

#### Step 4: Connects to PostgreSQL

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

#### Step 5: Launches the Interactive CLI

If the connection is successful, you enter the `psql` interactive shell, which:

- Displays a welcome message with connection details.
- Waits for SQL commands or `\` meta-commands (like `\dt` for tables).
- Reads commands, sends them to the PostgreSQL server, and displays results.

#### Step 6: Session Management & History

Every valid command is logged in:

```bash
cat ~/.psql_history
```

#### Step 7: Closing the Session

Typing `\q` or pressing `Ctrl+D` exits `psql`.
The session history is saved for the next time you use `psql`.

---

## 3. Client Authentication Configuration

### A. Introduction

When a client connects to the database, it specifies a **PostgreSQL user name**, much like a user logging into a Unix system. This user name defines **access privileges**, so it’s important to control who can connect.

**Authentication** is the process by which the database server establishes the identity of the client, and determines whether the client application (or the user who runs the client application) is permitted to connect with the database user name that was requested.

PostgreSQL database user names are logically separate from user names of the operating system in which the server runs. If all the users of a particular server also have accounts on the server's machine, it makes sense to assign database user names that match their operating system user names. However, a server that accepts remote connections might have many database users who have no local operating system account, and in such cases there need be no connection between database user names and OS user names.

### B. The `pg_hba.conf` File

HBA stands for **host-based authentication**.

Client authentication is controlled by a configuration file named `pg_hba.conf` and is stored in the database cluster's data directory.

```bash
code /opt/homebrew/var/postgresql@14/pg_hba.conf
```

A default `pg_hba.conf` file is installed when the data directory is initialized by `initdb`. It is possible to place the authentication configuration file elsewhere, however; see the `hba_file` configuration parameter.

The `pg_hba.conf` file is read on start-up and when the main server process receives a **SIGHUP** signal.

If you edit the file on an active system, you will need to signal the postmaster (using `pg_ctl reload`, calling the SQL function `pg_reload_conf()`) to make it re-read the file.

:::info
The preceding statement is not true on Microsoft Windows: there, any changes in the pg_hba.conf file are immediately applied by subsequent new connections.
:::

### C. Authentication Records

Postgres uses two concepts which they call **authentication records** and **directive records**. Rows within the `pg_hba.conf` are considered as **records**.

An **authentication record** specifies:

- a connection type
- a client IP address range (if relevant for the connection type)
- a database name
- a user name
- the authentication method to be used for connections matching these parameters.

### D. How authentication in postgres works

The rules for an authentication process are:

1. The first record with a **matching all 4 of the first above** is used to perform the authentication.
2. There is no "fall-through" or "backup"!! If one auth record is chosen, and the authentication fails, subsequent records are not considered!
3. If no record matches, access is denied.

### E. Include Directive Record

Each record can be an **include directive record** or an **authentication record**. Include directives specify files that can be included, that contain additional records. The records will be inserted in place of the include directives. Include directives only contain two fields: include, include_if_exists or include_dir directive and the file or directory to be included. The file or directory can be a relative or absolute path, and can be double-quoted. For the include_dir form, all files not starting with a . and ending with .conf will be included. Multiple files within an include directory are processed in file name order (according to C locale rules, i.e., numbers before letters, and uppercase letters before lowercase ones).

### F. A Record's Shape and Form

A record can have several formats:

```
local               database  user  auth-method [auth-options]
host                database  user  address     auth-method  [auth-options]
hostssl             database  user  address     auth-method  [auth-options]
hostnossl           database  user  address     auth-method  [auth-options]
hostgssenc          database  user  address     auth-method  [auth-options]
hostnogssenc        database  user  address     auth-method  [auth-options]
host                database  user  IP-address  IP-mask      auth-method  [auth-options]
hostssl             database  user  IP-address  IP-mask      auth-method  [auth-options]
hostnossl           database  user  IP-address  IP-mask      auth-method  [auth-options]
hostgssenc          database  user  IP-address  IP-mask      auth-method  [auth-options]
hostnogssenc        database  user  IP-address  IP-mask      auth-method  [auth-options]
include             file
include_if_exists   file
include_dir         directory
```

The meaning of the fields is as follows:

#### - `local`

This record matches connection attempts using Unix-domain sockets. Without a record of this type, Unix-domain socket connections are disallowed, and you'll see the following error:

> _psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: FATAL: no pg_hba.conf entry for host "[local]", user "talkohavy", database "talkohavy", no encryption_

You can re-create this error by commenting out all **authentication records** starting with `local`, and then run `brew services restart postgresql`.

#### - `host`

This record matches connection attempts made using TCP/IP. host records match SSL or non-SSL connection attempts as well as GSSAPI encrypted or non-GSSAPI encrypted connection attempts.

:::info
Remote TCP/IP connections will not be possible unless the server is started with an appropriate value for the `listen_addresses` configuration parameter, since the default behavior is to listen for TCP/IP connections only on the local loopback address `localhost`.

You can view the setting under:

```bash
code /opt/homebrew/var/postgresql@14/postgresql.conf
```

Or by running the meta-command:

```bash
SHOW listen_addresses;
```

For example, try commenting out the host record:

```bash
local   all             all                                     trust
# host    all             all             127.0.0.1/32            trust
```

Restart the server, and run:

```bash
psql
```

An you'll be logged in successfully!  
However, try running:

```bash
export PGHOST=127.0.0.1 && psql
```

And you'll get an error:

> _psql: error: connection to server at "127.0.0.1", port 5432 failed: FATAL: no pg_hba.conf entry for host "127.0.0.1", user "talkohavy", database "talkohavy", no encryption_

:::

#### - `hostssl`

This record matches connection attempts made using TCP/IP, but only when the connection is made with SSL encryption.

To make use of this option the server must be built with SSL support. Furthermore, SSL must be enabled by setting the `ssl` configuration parameter. Otherwise, the `hostssl` record is ignored except for logging a warning that it cannot match any connections.

#### - `hostnossl`

This record type has the opposite behavior of `hostssl`; it only matches connection attempts made over TCP/IP that do not use SSL.

#### - `database`

Options are: `all` | `sameuser` | `samerole` | `replication`

Specifies which database name(s) this record matches.

- The value `all` specifies that it matches all databases.
- The value `sameuser` specifies that the record matches if the requested database has the same name as the requested user.
- The value `samerole` specifies that the requested user must be a member of the role with the same name as the requested database. (`samegroup` is an obsolete but still accepted spelling of `samerole`). `Superusers` are not considered to be members of a role for the purposes of `samerole` unless they are explicitly members of the role, directly or indirectly, and not just by virtue of being a `superuser`.
- The value `replication` is rarely used, and hence not described here.

A separate file containing database names and/or regular expressions can be specified by preceding the file name with @.

#### - `user`

Specifies which database user name(s) this record matches.

- The value `all` specifies that it matches all users. Otherwise, this is either the name of a specific database user, a regular expression (when starting with a slash (`/`), or a group name preceded by `+`. (Recall that there is no real distinction between users and groups in PostgreSQL; a `+` mark really means “match any of the roles that are directly or indirectly members of this role”, while a name without a + mark matches only that specific role.) For this purpose, a superuser is only considered to be a member of a role if they are explicitly a member of the role, directly or indirectly, and not just by virtue of being a superuser. Multiple user names and/or regular expressions can be supplied by separating them with commas.

#### - `address`

Specifies the client machine address(es) that this record matches. This field can contain either a host name, an IP address range, or one of the special key words mentioned below.

Typical examples of an IPv4 address range specified this way are `172.20.143.89/32` for a single host, or `172.20.143.0/24` for a small network, or `10.6.0.0/16` for a larger one. An IPv6 address range might look like `::1/128` for a single host (in this case the IPv6 loopback address) or `fe80::7a31:c1ff:0000:0000/96` for a small network. `0.0.0.0/0` represents all IPv4 addresses, and ::0/0 represents all IPv6 addresses. To specify a single host, use a mask length of 32 for IPv4 or 128 for IPv6. In a network address, do not omit trailing zeroes.

An entry given in IPv4 format will match only IPv4 connections, and an entry given in IPv6 format will match only IPv6 connections, even if the represented address is in the IPv4-in-IPv6 range.

You can also write `all` to match any IP address, `samehost` to match any of the server's own IP addresses, or `samenet` to match any address in any subnet that the server is directly connected to.

#### - `auth-method`

Options are: `trust` | `reject` | `md5` | `scram-sha-256` | `ldap` | `cert`

#### - `auth-options`

After the `auth-method` field, there can be field(s) of the form `name=value` that specify options for the authentication method. Details about which options are available for which authentication methods appear below.

In addition to the method-specific options listed below, there is a method-independent authentication option `clientcert`, which can be specified in any `hostssl` record. This option can be set to `verify-ca` or `verify-full`. Both options require the client to present a valid (trusted) SSL certificate, while `verify-full` additionally enforces that the `cn` (Common Name) in the certificate matches the username or an applicable mapping. This behavior is similar to the `cert` authentication method (see Section 20.12) but enables pairing the verification of client certificates with any authentication method that supports `hostssl` entries.

:::tip
To connect to a particular database, a user must not only pass the pg_hba.conf checks, but must have the **CONNECT** privilege for the database. If you wish to restrict which users can connect to which databases, it's usually easier to control this by granting/revoking **CONNECT** privilege than to put the rules in `pg_hba.conf` entries.
:::

### Example `pg_hba.conf` file & entries

```
# Allow any user on the local system to connect to any database with
# any database user name using Unix-domain sockets (the default for local
# connections).
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust

# The same using local loopback TCP/IP connections.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             127.0.0.1/32            trust

# The same as the previous line, but using a separate netmask column
#
# TYPE  DATABASE        USER            IP-ADDRESS      IP-MASK             METHOD
host    all             all             127.0.0.1       255.255.255.255     trust

# The same over IPv6.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             ::1/128                 trust

# The same using a host name (would typically cover both IPv4 and IPv6).
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             localhost               trust

# The same using a regular expression for DATABASE, that allows connection
# to any databases with a name beginning with "db" and finishing with a
# number using two to four digits (like "db1234" or "db12").
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    "/^db\d{2,4}$"  all             localhost               trust

# Allow any user from any host with IP address 192.168.93.x to connect
# to database "postgres" as the same user name that ident reports for
# the connection (typically the operating system user name).
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    postgres        all             192.168.93.0/24         ident

# Allow any user from host 192.168.12.10 to connect to database
# "postgres" if the user's password is correctly supplied.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    postgres        all             192.168.12.10/32        scram-sha-256

# Allow any user from hosts in the example.com domain to connect to
# any database if the user's password is correctly supplied.
#
# Require SCRAM authentication for most users, but make an exception
# for user 'mike', who uses an older client that doesn't support SCRAM
# authentication.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             mike            .example.com            md5
host    all             all             .example.com            scram-sha-256

# In the absence of preceding "host" lines, these three lines will
# reject all connections from 192.168.54.1 (since that entry will be
# matched first), but allow GSSAPI-encrypted connections from anywhere else
# on the Internet.  The zero mask causes no bits of the host IP address to
# be considered, so it matches any host.  Unencrypted GSSAPI connections
# (which "fall through" to the third line since "hostgssenc" only matches
# encrypted GSSAPI connections) are allowed, but only from 192.168.12.10.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             192.168.54.1/32         reject
hostgssenc all          all             0.0.0.0/0               gss
host    all             all             192.168.12.10/32        gss

# Allow users from 192.168.x.x hosts to connect to any database, if
# they pass the ident check.  If, for example, ident says the user is
# "bryanh" and he requests to connect as PostgreSQL user "guest1", the
# connection is allowed if there is an entry in pg_ident.conf for map
# "omicron" that says "bryanh" is allowed to connect as "guest1".
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
host    all             all             192.168.0.0/16          ident map=omicron

# If these are the only four lines for local connections, they will
# allow local users to connect only to their own databases (databases
# with the same name as their database user name) except for users whose
# name end with "helpdesk", administrators and members of role "support",
# who can connect to all databases.  The file $PGDATA/admins contains a
# list of names of administrators.  Passwords are required in all cases.
#
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   sameuser        all                                     md5
local   all             /^.*helpdesk$                           md5
local   all             @admins                                 md5
local   all             +support                                md5

# The last two lines above can be combined into a single line:
local   all             @admins,+support                        md5

# The database column can also use lists and file names:
local   db1,db2,@demodbs  all
```

---

## 4. CLI Commands

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

## 5. Interactive Shell Commands

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

### - Command 5: List all roles/users

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

**Using SELECT:**

```sql
SELECT * FROM pg_roles WHERE rolname = 'talkohavy';
```

You can directly query the `pg_roles` table, that stores all users.

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
