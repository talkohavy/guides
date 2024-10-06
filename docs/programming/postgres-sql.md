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

if the name of your new database is similar to your username, then you can simply type `psql` for short:

```bash
psql
```

Let's create out first table now:

```sql
CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255),  -- or use TEXT for longer strings
    score INT CHECK (score >= 0 AND score <= 100)
);
```

---

## 2. Commands

### - A. psql

```bash
psql [username]
```

Log into your sql server.

### - B. \list

```sql
\list
```

or:

```sql
\l
```

for short

Lists out all your databases.

### - C. \q

```sql
\q
```

Quit the postgresql terminal.

### - D. \du

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

### - E. \password

```sql
\password USERNAME
```

Set a password for user USERNAME.

You'll be prompted to enter a new password and confirm it.

### - F. \dt

```sql
\dt
```

or:

```sql
\dt+
```

List out all your tables.
