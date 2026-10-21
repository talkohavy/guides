# Adding a role and a password to your connection

## 0. Introduction

Noticed how you weren't asked for a password when trying to connect? That's because Homebrew creates a superuser named after your machine username (`talkohavy`), and configures local connections with the `trust` method, which lets anyone on your machine connect without one.

---

## 1. Create a Database

Since we are talking about adding a password to the connection, this probably means that we're taking things to the next level security-wise. And if we're already avoiding the default no-password policy, might as well avoid the default of database is named **postgres**, which was created when we installed `postgresql`.

Let's create a database with a unique name:

```sql
CREATE DATABASE nameofservice;
```

Check that it was created properly:

```sql
\list
```

or just:

```sql
\l
```

---

## 2. Check out the roles

Run this:

```sql
\du
```

You might see this as the output:

```
                              List of roles
 Role name  |                         Attributes
------------+------------------------------------------------------------
 tal.kohavy | Superuser, Create role, Create DB, Replication, Bypass RLS
```

Notice how `postgres` role is missing? When installing **postgresql** using an installer, a role named `postgres` is created for you by default. However, this isn't the case with a `brew` installation.

---

## 3. Create a Role

To create a role run this command:

```sql
CREATE ROLE master WITH LOGIN SUPERUSER PASSWORD '1234';
```

```sql
CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD '1234';
```

The password is defined within the role.

## 4. Update a Role

If you already have a role, and just want to update it so that it would now use a password, you can simply update it.

Run this:

```sql
ALTER USER some_role_name WITH PASSWORD '1234';
```

You can also use the special key called `CURRENT_USER`:

```sql
ALTER USER CURRENT_USER WITH PASSWORD '1234';
```

`CURRENT_USER` refers to the role you're logged in as, so you don't need to know its exact name. If you want to see it, run:

```sql
SELECT current_user;
```

:::info
Hide password from history

To avoid having the password show up in your `psql` history, use the interactive `\password` command (with no arguments it applies to the current user) and type `1234` when asked:

```sql
\password
```

:::

## 5. Update trust of authentication method

Setting a password alone **isn't enough**. Postgres still trusts local connections, so it will never ask for it. You need to change the authentication method in the `pg_hba.conf` file. Find where it lives:

```sql
SHOW hba_file;
```

On Homebrew it's usually something like `/opt/homebrew/var/postgresql@14/pg_hba.conf`. Open it and change the method from `trust` to `scram-sha-256` on the `local` and `host` lines:

`# TYPE  DATABASE        USER            ADDRESS                 METHOD`

```bash
local   all             all                                     scram-sha-256
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
```

---

## 6. Reload configuration

Reload the configuration so the change takes effect:

```sql
SELECT pg_reload_conf();
```

Now exit (`\q`) and connect again:

```bash
psql postgres
```

This time you'll be asked for a password:

```
Password for user talkohavy:
```

Type `1234` and you're in.

You can also pass the password without being asked, which is useful in scripts. Either set the `PGPASSWORD` environment variable:

```bash
PGPASSWORD=1234 psql postgres -U postgres
```

or use a connection string:

```bash
psql "postgresql://talkohavy:1234@localhost:5432/postgres"
```
