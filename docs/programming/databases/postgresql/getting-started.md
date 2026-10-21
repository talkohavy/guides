# Getting Started

## 1. Install postgresql

Installing postgresql on macOS (using Homebrew):

```bash
brew install postgresql
```

## 2. Start the server

Then start the service:

```bash
brew services start postgresql
```

## 3. First time connecting

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

## 4. Full Connection String

You can login like this:

```bash
psql "postgresql://username:passsword@localhost:5432/db_name"
```

for example: `psql "postgresql://postgres:1234@localhost:5432/postgres"`

or like this:

```bash
psql -U postgres -d db_users -h localhost -p 5432
```
