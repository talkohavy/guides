# MongoDB

## 1. How to Query in MongoDB

### - A: Using MQL

#### - Command 1: return the document with the MAX/MIN HIGHEST SCORE

```bash
db.users.find({},{ _id: 0, userID: 1}).sort({"userID": -1}).limit(1);
```

#### - Command 2: return only the records which FIELD DOES/DOESN'T EXISTS

```bash
db.users.find({ myField: { $exists : true } });
```

#### - Command 3: Does a field exist, is of type array, and ARRAY CONTAINS AT LEAST ONE ELEMENT?

```bash
{ myArray : { $elemMatch : { $exists : true } } }
```

#### - Command 4: COUNT HOW MANY records are there that answer QUERY

```bash
db.users.find({ QUERY }).count();
```

#### - Command 5: return documents which FIELD_NAME IS NOT EQUAL TO some value

```bash
db.users.find({ userID: { $ne: 1 }});
```

#### - Command 6: return documents and PROJECT ONLY SOME FIELDS

```bash
db.users.find({} , { _id: 0, userID: 1, nickname: 1, email: 1 });
```

### - B: Using Aggregation Pipelines

When you **NEED** to use other fields values as reference, you can use an aggregation pipeline MQL update operations. Though their names are the same (like $set and $unset), they work differently when inside a regular update or an aggregation pipeline update.

#### - Command 1: ???

```bash
___
```

---

## 2. How to Update in MongoDB

### - A: Using MQL

When you don't want to use other fields values as reference, you can use this simple MQL operations, that don't include an aggregation pipeline.

#### - Command 1: ADD NEW FIELD to 1 |some | all documents

```bash
db.users.updateMany( { } ,{ $set: { newField: "defaultValue" } } )
```

:::info
Side note: if the field already exists? It overrides its contents.
:::

#### - Command 2: DELETE AN EXISTING FIELD from all (similar to MySql's DROP COLUMN)

```bash
db.grades.updateMany( { studentID: 1 , classID: 460 } , { $unset: { arr1: "" , arr2: "" } } )
```

:::info
Side note: if the field doesn't exist? updateMany does nothing.
:::

#### - Command 3: ADD SUB-DOCUMENT TO ARRAY field

```bash
db.users.updateMany( { userID: 1 } , { $addToSet: { iWatched: { userID:306, …values } } } )
```

:::info
Side note: the $addToSet doesn't really apply to an array containing sub-documents, in the sense that it will allow inserting a new sub-document with the same values.
:::

#### - Command 4: DELETE SUB-DOCUMENT FROM ARRAY field

```bash
db.users.updateMany( { userID: 1 } , { $pull: { iWatched: { userID: 306 } } } )
```

### - B: Using Aggregation Pipelines

#### - Command 1: Set field equal to another field

\$set works exactly the same as it is in normal MQL update, only now you can use other fields values as references.

```bash
db.users.updateMany(
{
  userID: 354,
},
[
  {
    $set: {
      'myPrefs.turnsMeOn': '$myDetails.turnsMeOn',
      'myPrefs.inPurposeOf': '$myDetails.inPurposeOf',
  },
},
])
```

#### - Command 2: Unset a field

\$unset works differently in aggregation than in normal MQL update. If you try to apply \$unset as its form in the normal MQL update within an aggregation update, you would get an error saying:\*\*\* \$unset specification must be a string or an array
The proper way of applying \$unset in an aggregation pipeline update is either by giving it a string with the field's name to unset, or an array of names in case there's more than 1 field you'd like to unset:

```bash
db.users.updateMany(
{
  userID: 354,
},
[
  {
    $unset: ['myDetails.turnsMeOn', 'myDetails.inPurposeOf']
  }
]);
```

#### - Command 3: Update a specific object inside an array field

The full form:

```bash
db.users.updateMany(
{
  userID: 354,
},
{
  $set: {
    'messages.$[i].msgReadOnUnix': 1652348270,
  },
{
  arrayFilters: [
    {
      $and: [
        { 'i.senderID': 306 },
        { 'i.msgReadOnUnix': -1 },
      ]
    }
  ]
});
```

Explanation on how to use:

- Part 1: \$[identifier]
  To achieve this, we use a normal MQL update, along with the familiar \$set operation, only with a little twist. To reference an array cell, we need to use a special syntax of \$[identifier].
  Like so: `$set: { 'ARRAY.$[IDENTIFIER].FIELD_NAME': some-value }`
- Part 2: arrayFilters
  In the third object parameter of the update operator, we provide an arrayFilters.
  arrayFilters is a special operator, that contains the conditions that would help determine which object inside the array are going to be updated. arrayFilters has a complex behavior, so in order to learn how to use it we need to discuss its rules, and how it behaves.

**-- ARRAY FILTER RULES**

- **Rule Number 1:** must be an array
  arrayFilters is followed by an array structure --> arrayFilters: []

- **Rule Number 2:** a single filter - an object inside the array
  The array of arrayFilters contains objects which are filters.
  Now you must be thinking "Oh! Each object inside the array must be a filter in the sense that a filter means a single condition, that together have a relation of AND".
  Well... then no. Each object inside the array is a reference to exactly one array.
  What does it mean?
  Consider a case where you have an array of objects, and an object in that array contains another array within. MongoDB gives you a way to filter within that inner array! And that can be done by providing a first filter object that would filter by the first array, and a second filter object that would filter by the second array.
  In 99% percent of cases, you would have an arrayFilters that contains only 1 object in its top level.
  So now we know that the array of arrayFilters contains filter objects, that each object is a reference to an array in accordance to the level, and that in most cases we would only really need one filter for one top level array.

- **Rule Number 3:** AND relation between different fields
  To get an AND relation effect between different inner fields, we simply add them one after another, line by line, like so:

  ```bash
  arrayFilters: [{
    'i.userID': 306,
    'i.lastUpdated': { $lt: 555 }
  }]
  ```

  **WARNING!** _This implicit way of writing the AND relation can cause issues if you're using the **same** field name twice!_
  In the example above, it is implied that we wish for an AND relation. We ask for userID 306 AND lastUpdated before 555.
  Even though the AND form has a default mode, you can always mention it explicitly:

  ```bash
  arrayFilters: [{
    $and: [
      { 'i.userID': 306 },
      { 'i. lastUpdated':{ $lt: 555 }}
  }]
  ```

  Notice how many more notes need to be added to get the same result!

- **Rule Number 4:** AND relation for the same key - duplicate key appearance
  We saw that the filter in its default mode obscures an AND operation behind it, and that the filter has an object-like structure.
  Since the filter object is an object, a key CANNOT appear twice! It's not an error if it does, it's just that the last appearance of a key would override its predecessors.
  Let's see an example:

  ```bash
  arrayFilters: [{
    'i.userID': 306,
    'i.userID': 304,
    'i.userID':{ $lt: 2 }
  }]
  ```

  In the example above, only the third one would be taken into account.

- **Rule Number 5:** OR relation between all fields
  To get the effect of an OR relation, you must use the explicit way, like so:
  ```bash
  arrayFilters: [{
    $or: [
      { 'i.userID': 306 },
      { 'i. lastUpdated':{ $lt: 555 }}
  }]
  ```

---

## 3. Connect to Remote Server

```bash
mongosh "mongodb+srv://talkohavy:PASSWORD@sandbox.2pb0l.mongodb.net/LuckyLove"
```

with 9 and no `!`.

---

## 4. Connect to a local server

In the past, if you were working against a local server, you needed to have the terminal open twice, once for running the mongodb server, and once for the ability to run mongodb commands.

However, when using `mongosh`, you'll only need one terminal. mongosh will take care of running a daemon service in the background

The command:

```bash
mongosh
```

That's it! You've just raised a local mongodb server, that's ready to accept & run commands.

---

## 5. Useful shell commands

Here are some of the most used commands when using mongo shell.

### - command 1: show all existing databases

**• The Command:**

```bash
show dbs
```

**• Description**

Shows the list of databases that are in the cluster.

Note! Do not touch the "admin" and the "local" databases.

<br/>

### - command 2: use

**• The Command:**

```bash
use dbName
```

**• Description**

Selects a specific database.

Note: If you do use dbName but dbName doesn't exist? You'll still get a "switched to db dbName" message! But if you do "show dbs", you won't see it on the list. What this means is that mongoDB wanted to be so flexible as to say "Yeah, we're ready to create that db for you if you desire, but technically? right now? It doesn't exist".

<br/>

### - command 3: show collections

**• The Command:**

```bash
show collections
```

**• Description**

Shows all the collections in that specific database.

<br/>

### - command 4: find()

**• The Command:**

```bash
db.collectionName.find(query)
```

**• Description**

This is your way of showing documents that answer to your query's
specifications. How to query? The find function you saw above requires a query.
The query is actually a json object like so:

```json
{
    "country": "israel",
    "city": "ramat gan"
}
```

Important Note: If there are more than 20 document in the collection that match the query, know that only the first 20 will be shown as the result. To view the next 20 results type "it", which is short for iterate, and press Enter.

<br/>

### - command 5: findOne(query)

**• The Command:**

```bash
db.collectionName.findOne(<query>)
```

**• Description**

This is your way to find just one document that matches the query.

Note: If no query would be inserted (empty), a random document would get pulled.

<br/>

### - command 6: count()

**• The Command:**

```bash
db.collectionName.find(<query>).count()
```

**• Description**

Explain: This is your way to answer the question "How many are there?".

<br/>

### - command 7: pretty()

**• The Command:**

```bash
db.collectionName.find(<query>).pretty()
```

**• Description**

This is your way to present results in a more human-readable way.

<br/>

### - command 8: insert one or more documents

**• The Command:**

```bash
db.collectionName.insert(d1)
db.collectionName.insert([d1,d2,d3])
```

**• Description**

This is your way to insert a document.

Note 1: To insert many documents, simply type in an array of documents like so:

```bash
[{"name":"test1"}, {"name":"test2"}, {"name":"test3"}]
```

But wait, there's more...  
Question: What if the array insert fails?  
Answer: Well, if we do db.XXX.insert([d1,d2,d3]), if d1 would fail to insert because let's say it has a duplicate \_id error, then the entire insert operation halts! And even if d2 and d3 were supposed to be fine, they would not be inserted. Because the logic is like this: I'm going by the order they appear in the array, and if the n'th document fails? The n'th+1 and above would not be inserted.
Luckily, we can change that!
There's an option we can add to the insert command like so:

```bash
db.X.insert([d1,d2,d3],{"ordered":false});
```

This means: "every document that CAN be inserted will be inserted, and those who fail fail".  
Note 1: What if I did this?

```bash
db.collectionNameThatDoesntExist.insert(<document/s>)
```

Amazingly, this would work! And not only that those documents would get inserted, but a collection would be created with that name you just provided.  
Again, this is mongoDB coming to tell us "I want to be flexible!".  
Same goes for databases (as you saw earlier in the "use" command).

<br/>

### - command 9: update one or more documents

**• The Command:**

```bash
db.collectionName.updateOne(<who>,<what is the change>)
db.collectionName.updateMany(<who>,<what is the change>)
```

**• Description**

This is your way to update a single document / multiple documents.

Example: Update / Increase Ramat Gan's population by 10:

```bash
db.cities.updateOne({"name":"ramat gan"},{"$inc": {"population": 10}})
```

<br/>

### - command 10: delete one or more field-value pair

**• The Command:**

Unprettified:

```bash
db.grades.updateMany({"studentID":1,"classID":460},{"$unset":{"arr1":"", "arr2":""}})
```

Prettified:

```bash
db.grades.updateMany(
    {
        "studentID":1,
        "classID":460
    },
    {
        "$unset":
            {
                "arr1":"",
                "arr2":""
            }
    }
)
```

**• Description**

This is your way to delete a single document / multiple documents.

Example: Delete city of Ramat Gan:

```bash
db.cities.deleteMany({"name":"ramat gan"})
```

<br/>

### - command 11: delete one or more documents

**• The Command:**

```bash
db.collectionName.deleteOne(<who>)
db.collectionName.deleteMany(<who>) or ({})
```

**• Description**

This is your way to delete a single document / multiple documents.

Example: Delete city of Ramat Gan:

```bash
db.cities.deleteMany({"name":"ramat gan"});
```

<br/>

### - command 12: delete one collection

**• The Command:**

```bash
db.collectionName.drop()
```

**• Description**

This is your way to delete a single collection.

Example: Delete sales collection:

```bash
db.sales.drop()
```

:::info
Note: Removing all collection inside a database also removes the database!
:::

---

## 6. Importing & Exporting Backups

### - TLDR;

○ Import a json to a collection in a database:

Number 1: (the uri is `localhost` WITHOUT a password)

```bash
mongoimport --db DB_NAME --collection COLLECTION_NAME --file DATA_FILE.json
```

Number 2: (the uri is a `remote` one WITH a password)

```bash
mongoimport --db DB_NAME --collection COLLECTION_NAME --config ./config.yml --file data.json
```

○ To export from a collection in a database to a json file use this:

Number 1:

```bash
___
```

### - Full Explanation

We will now discuss 4 commands for importing & exporting that will allow us to do quick backups, and restoring databases from those backups. They are the 4 commands: `mongoimport`, `mongoexport`, `mongorestore`, and `mongodump`.

:::tip
Starting from MongoDB 4.4, `mongodump`, `mongoimport`, `mongoexport`, and `mongorestore` are released separately from MongoDB Server and uses their own versioning, with an initial version of **100.0.0**. Previously, all four were released alongside the MongoDB Server and used matching versioning.
:::

Let's say you want to save your work on another machine. There are 4 commands that allow you to do that easily.  
There are used for importing and exporting your db so that, for example, you would be able to work on them locally.  
But before that, we need to discuss 2 important format types: `JSON` & `BSON`.

**-- JSON format**

JSON format is a human-readable format, but unfortunately it is text-based, and parsing of text-based is pretty damn slow. Other than the fact that parsing it is really slow, it is pretty expensive memory-wise.

**-- BSON format**

That's why the `BSON` format was invented!
`BSON` is highly un-readable for human, however for computers? Very readable!
So, the parsing is much faster, but what about storage size?
So, also storage-wise, `BSON` is much lighter than JSON, and that makes it great as a formatting storage. Furthermore, `BSON` can support other data types that JSON can't tell the difference between. Perhaps now it's clear to you why we need 4 commands, because 1 & 2 relate to JSON, and 3 & 4 relate to `BSON`.

#### - Action 1: mongodump

`mongodump` is a way to export **THE ENTIRE** data from a connection string.  
The entire data meaning all the databases that exist there.  
`mongodump` saves that data in the format of BSON.  
It creates a folder named "dump", if doesn't already exist, then another folder named as the project's title, and then dumps all the files there (BSON files).  
`mongodump` does not require an `--out` flag, since it copies all the bson files it finds over at the remote. `mongodump` can export data from either from standalone, replica set, or sharded clusters.
The mongodump command has the following form:

```bash
mongodump <options> <connection-string>
```

:::danger
**IMPORTANT NOTE!!!**

For security reason, you should omit the password from the connection string to have mongodump prompt for the password.
:::

mongodump usage examples:

dumping from localhost:

```
mongodump
```

Exporting from luckylove remote:

```bash
mongodump --uri mongodb+srv://talkohavy@sandbox.2pb0l.mongodb.net/LuckyLove?retryWrites=true
```

The password is: `a9*********f`

#### -- Action 2: mongoexport

`mongoexport` is a way to export A **SINGLE COLLECTION** from A **SINGLE DATABASE** out of a connection string, or a yaml config file.

`mongoexport` saves that data in the format of JSON (or CSV).  
The `mongoexport` command has the following form:

```bash
mongoexport --db=DB_NAME --collection=CONNECTION_STRING --out=OUT MORE_OPTIONS --uri=CONNECTION_STRING
```

**_ options _**

- **Option 1: db**
  Specify the name of the database from which you want to export from.

- **Option 2: collection**
  Specify the name of the db from db you want to export from.
  The documentation states that this is the only required field. But that's stupid right?? because… what would to database be then??? What's the default??? Nothing!!!

- **Option 3: out**
  Also an important flag in my taste.
  Specify a file name to which to want to output the export to.
  If you don't specify an out flag, the export content would simply console log itself and that's it. No file would actually be created without mentioning the out flag.

- **Option 4: uri**
  Here you can specify the connection string.
  Not specifying a uri flag would default to this:
  `--uri "mongodb://localhost:27017"`
  When using the `--uri` connection string, the database can be specified as part of the string, so you can skip the `--db` flag by doing so. Using the uri flag is nice, but for security reasons, mongoDB suggests you use a config file.

  - **Option 5: config**
    Specifies the full path to a YAML configuration file containing sensitive values for the following options to `mongoexport`:
    `--password`
    `--uri`
    `--sslPEMKeyPassword`

    This is the recommended way to specify a password to mongoexport, aside from specifying it through a password prompt.
    The configuration file takes the following form:

    ```
    password: PASSWORD
    uri: mongodb://mongodb0.example.com:27017
    sslPEMKeyPassword: PASSWORD
    ```

    Specifying a password to the `password:` field and providing a connection string in the uri: field which contains a conflicting password will result in an error.  
    The `sslPEMKeyPassword` specifies the password to **decrypt** the `certificate-key` file. This is relevant only if you are using the flag of `--sslPEMKeyFile`. If you do, use the flag of `--sslPEMKeyPassword` option only if the certificate-key file is encrypted. In all cases, the `mongoexport` will redact the password from all logging and reporting output. If the private key in the PEM file is encrypted and you do not specify the --sslPEMKeyPassword option, the `mongoexport` will prompt for a passphrase. See TLS/SSL Certificate Passphrase. Alternatively, you can also specify the password directly in the URI connection string. Providing a connection string while also using `--sslPEMKeyPassword` and specifying conflicting information will result in an error.
    Be sure to secure this file with appropriate filesystem permissions.

- **Option 6: sslPEMKeyFile**
  Specifies the .pem file that contains both the TLS/SSL certificate and key. Specify the file name of the .pem file using relative or absolute paths. This option is required when using the --ssl option to connect to a mongod or mongos that has CAFile enabled without allowConnectionsWithoutCertificates.
  Alternatively, you can also specify the .pem file directly in the URI connection string. Providing a connection string while also using `--sslPEMKeyFile` and specifying conflicting information will result in an error.

- **Option 7: jsonFormat**
  If you need to preserve all rich BSON data types when using mongoexport to perform full instance backups, be sure to specify Extended JSON v2.0 (Canonical mode) to the `--jsonFormat` option to `mongoexport`, in the following fashion:
  ```bash
  mongoexport --jsonFormat=canonical --collection=CONNECTION_STRING CONNECTION_STRING
  ```
  If `--jsonFormat` is unspecified, mongoexport defaults to `--jsonFormat=relaxed`.
  `mongoimport` will automatically use the JSON format found in the specified target data file when restoring. For example, it will use Extended JSON v2.0 (Canonical mode) if the target data export file was created by mongoexport with `--jsonFormat=canonical` specified.

mongoexport usage examples:

Exporting from localhost:

```bash
mongoexport --db LuckyLove --collection users --jsonFormat=canonical --out export/localhost/users.json
```

Exporting from luckylove remote:

```bash
mongoexport --db LuckyLove --collection users --jsonFormat=canonical --config ./luckylove.config.yml --out export/luckylove/users.json
```

#### -- Action 3: mongorestore

The `mongorestore` program loads data from either a binary database dump created by `mongodump` or the standard input into a mongod or mongos instance.

```bash
mongorestore MORE_OPTIONS CONNECTION_STRING DIR_FILE_TO_RESTORE
```

Omit the user's password from the `--uri` string to have `mongorestore` prompt for the password.

- **Option 1: collection**
  Specifies the name of the target collection for mongorestore to restore data into when restoring from a BSON file.
  If you do not specify the --collection flag, the name of the target collection would be as that name of the input file. If the input file has an extension, MongoDB omits the extension of the file from the collection name.

mongorestore usage examples:

Restoring from a dump directory to a localhost:

```bash
// DID NOT TEST YET!
mongorestore dump/
```

Restoring from luckylove remote to localhost:

```bash
// DID NOT TEST YET!
mongorestore --uri mongodb+srv://talkohavy@sandbox.2pb0l.mongodb.net/LuckyLove?retryWrites=true dump/
```

Password is: `a9******f`

#### -- Action 4: mongoimport

`mongoimport` tool imports content from an Extended JSON, CSV, or TSV export created by `mongoexport`, or potentially, another third-party export tool.

The `mongoimport` command has the following form:

```bash
mongoimport MORE_OPTIONS CONNECTION_STRING --file DATA_FILE
```

Most of the flags available for `mongoexport` are also available to `mongoimport`.

Some of the important flags are:

- **Option 1: file**
  Specify the path to the file containing the data in a json format.

- **Option 2: drop**
  Let's say you're importing from a file a database named local_expoint, but in your target there's already a database named exactly like that. In this case, by NOT specifying the `--drop`, **the import would fail**. But if you do mention the `--drop` flag, then before the import, a drop will occur and delete the existing database.

- **Option 3: collection**
  Specifies the collection to import. If you do not specify `--collection`, `mongoimport` takes the collection name from the input filename, omitting the file's extension if it has one.

- **Option 4: mode**
  _Default: insert_
  Specifies how the import process should handle existing documents in the database that match documents in the import file. By default, mongoimport uses the `_id` field to match documents in the collection with documents in the import file. To specify the fields against which to match existing documents for the upsert, merge, and delete modes, use the
  --upsertFields flag.
  Regarding the different modes available:
  insert:
  Insert the documents in the import file. mongoimport will log an error if you attempt to import a document that contains a duplicate value for a field with a unique index, such as \_id.
  upsert:
  Replace existing documents in the database with matching documents from the import file. mongoimport will insert all other documents. Replace Matching Documents during Import describes how to use --mode upsert.
  merge:
  Merge existing documents that match a document in the import file with the new document. mongoimport will insert all other documents. Merge Matching Documents during Import describes how to use --mode merge.
  delete:
  Delete existing documents in the database that match a document in the import file. mongoimport takes no action on non-matching documents. Delete Matching Documents describes how to use --mode delete.

- **Option 5: upsertFields**
  Specifies a list of fields for the query portion of the import process. `--upsertFields` can be used with modes: upsert, merge, and delete.
  Use this option if the `_id` fields in the existing documents don't match the field in the document, but another field or field combination can uniquely identify documents as a basis for performing upsert operations.
  If you do not specify a field, `--upsertFields` will upsert on the basis of the `_id` field.
  To ensure adequate performance, indexes should exist for the field or fields you specify with `--upsertFields`.

- **Option 6: maintainInsertionOrder**
  _Default: false_
  If specified, `mongoimport` inserts the documents in the order of their appearance in the input source. That is, both the bulk write batch order and document order within the batches are maintained. Specifying `--maintainInsertionOrder` also enables `--stopOnError` and sets numInsertionWorkers to 1. If unspecified, `mongoimport` may perform the insertions in an arbitrary order.

- **Option 7: numInsertionWorkers**
  _Default: 1_
  Specifies the number of insertion workers to run concurrently. For large imports, increasing the number of insertion workers may increase the speed of the import.

**mongoimport usage examples:**

importing from a file to localhost / luckylove:

```bash
mongoimport --db local_expoint --collection wtf --config ./localhost.config.yml --file export/expoint/test.json
```

importing from a file to localhost / luckylove:

```bash
mongoimport --db shopping_ms_products --collection products --config ./localhost.config.yml --file data.json
```
