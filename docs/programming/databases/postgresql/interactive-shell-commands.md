# Interactive Shell Commands

## - Command 0: Show help menu

**The Command:**

```bash
\?
```

**Description:**

Shows help information.

<br/>

## - Command 1: Show connection info

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

## - Command 2: Lists server configuration

**The Command:**

```bash
\dconfig[+] *
```

**Description:**

Lists server configuration parameters and their values.

Common use is: `\dconfig *`

If `pattern` is specified, only parameters whose names match the `pattern` are listed. Without a `pattern`, only parameters that are set to non-default values are listed. (Use `\dconfig *` to see all parameters.) If `+` is appended to the command name, each parameter is listed with its data type, context in which the parameter can be set, and access privileges (if non-default access privileges have been granted).

<br/>

## - Command 3: Change user password

```bash
\password USERNAME
```

Set a password for user USERNAME.

You'll be prompted to enter a new password and confirm it.

<br/>

## - Command 4: Close Connection/Terminal

```bash
\q
```

Or...

```
ctrl+D
```

Quit the `postgresql` terminal.

<br/>

## - Command 5: List all roles/users

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

## - Command 6: List all databases

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

## - Command 7: List all tables

**The Command:**

```bash
\dt[S+]
```

**Description:**

List all user-defined tables.

Add the `S` option to have **system objects** be shown as well.

<br/>

## - Command 8: Show details on a table

**The Command:**

```bash
\d table_name
```

Or...

```bash
\d "Table_Name"
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

:::tip
Notice the double quotes?

The problem: **PostgreSQL translates unquoted identifiers to lowercase by default**. So if you created a table names "Actions", typing `\d Actions` would translate to `\d actions`. Therefore, in such cases you need to type `\d "Actions"`. **With double quotes PostgreSQL treats "Actions" as a case-sensitive identifier**.
:::

<br/>

## - Command 9: List all functions

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

## - Command 10: Switch to a different database

**The Command:**

```bash
\c DATABASE_NAME
```

**Description:**

Switch to a different database on your server.

The `\c` used by itself establishes a new connection to a PostgreSQL server. It uses the same params as the current connection, and terminates the existing connection.

<br/>

## - Command 11: Get/Set Output Variables

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

- Calling `\pset` without any arguments **displays the current status of all printing options**.
- Calling `\pset option` on:
  - boolean options, causes the option to be toggled or unset.
  - non-boolean options, get the value currently set fot that option.
- Calling `\pset option value`, assigned _value_ to _option_. The semantics of _value_ vary depending on the selected _option_.

:::info
This command can **get or set options affecting the output** of query result tables.

When you run `\pset option value` inside a `psql` session, the setting is stored **only in memory for that interactive session** — once you exit `psql`, it's gone!

**You can persist settings** by adding them to your `~/.psqlrc` file.

Add your desired `\pset` options, for example:

```bash
\pset border 2
\pset linestyle unicode
```

:::

List of interesting options you can get/set:

### - Option 1: border

**Default:** 1

Should be a number. Mostly 0 or 1 is what affects more formats, but in html the higher the number the bolder the border.

### - Option 2: format

**Default:** `aligned`.

Options are: `aligned`, `asciidoc`, `csv`, `html`, `latex`, `latex-longtable`, `troff-ms`, `unaligned`, or `wrapped`.

### - Option 3: linestyle

**Default:** `ascii`.

Options are: `ascii` | `unicode`.

The `unicode` value can receive border values of: `0`, `1`, `2`.

### - Option 4: unicode_border_linestyle

**Default:** `single`.

Option are: `single` | `double`.

Sets the border drawing style for the unicode line style.

### - Option 5: unicode_header_linestyle

**Default:** `single`.

Option are: `single` | `double`.

Sets the header drawing style for the unicode line style.

### - Option 6: null

**Default:** `ascii`.

Sets the string to be printed in place of a null value. The default is to print nothing, which can easily be mistaken for an empty string. For example, one might prefer `\pset null '(null)'`.

### - Option 7: title

**Default:** `empty string`.

Give a table a Title.  
For example: `\pset title 'Score Overview'`

Note: there's a difference between `'Score Overview'` and `"Score Overview"`.

In the latter, the `"` would be shown, whereas in the former, it would not.

<br/>

## - Command: 12: Execute query from a `file`

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

## - Command: 13: Show/Edit code of Function or Stored-Procedure

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

## - Command: 14: Bind values to placeholders

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

## - Other notable commands

Other notable meta-commands:

- `\! pwd`: Prints your **current working directory**.
- `\di+`: Shows a list of all defined **indexes** defined on tables.
- `\dT`: Lists **data types**.
- `\ev`: Edit a named view.
