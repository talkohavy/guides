# MongoDB

## 1. Run mongoDB server (docker)

Go to the Official Image of mongo:

[https://hub.docker.com/\_/mongo](https://hub.docker.com/_/mongo)

In the "How to use this image" section, you'll see the following command:

```bash
docker run --name mongo -d -p 27017:27017 mongo:6
```

Or with a password:

```bash
docker run --name mongo -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=mongoadmin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo
```

And, if you wanna add extra security, use a certificate:

```bash
docker run --name mongo -d \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=mongoadmin \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -v ~/Desktop/certificates:/certs:ro \
  mongo \
  --tlsMode requireTLS \
  --tlsCertificateKeyFile /certs/server.pem \
  --tlsCAFile /certs/rootCA.crt
```

:::info
See how to create a certificate over at the [certificates guide](/docs/programming/certificates#--step-1-create-2-private-keys---1-for-the-ca--1-for-the-server).
:::

You should now have a container running a **MongoDB server** listening on the standard MongoDB port **27017**.

**In the next section we'll be testing the connection** to our server, stay tunned.

---

## 2. Test Server Connectivity

### - A. Install mongosh

**- MacOS:**

Use `homebrew` to install (the official recommended way):

```bash
brew install mongosh
```

Test that `mongosh` was installed correctly:

```bash
mongosh --version
```

**- Windows:**

Go to: [https://www.mongodb.com/docs/mongocli/current/](https://www.mongodb.com/docs/mongocli/current/)

And hit **Install MongoDB CLI**, then hit the **Download** button.

### - B. Get the connection string

While `mongosh` supports many useful flags, like:

- host
- port
- username
- retryWrites
- authenticationDatabase
- password

and more, sometimes you just want them all combined as a **connection string** to store as a single _environment variable_ for a service to consume.

Shape:

```bash
mongosh mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
```

Example:

```bash
mongosh mongodb://myUser:myPassword@localhost:27017/myDatabase?ssl=true&sslValidate=true&sslCA=/path/to/ca.pem&sslCert=/path/to/client.pem&sslKey=/path/to/client-key.pem&retryWrites=true&retryReads=true&w=majority
```

The most basic one, which should work for a local mongodb server, looks like:

```bash
mongosh "mongodb://localhost:27017"
```

Or, if you have a username & password:

```bash
mongosh mongodb://myUser:myPassword@localhost:27017/myDatabase
```

And as mentioned, you _can_ use `mongosh` flags instead of a connection string if you want. So here is the same connection string with the username & password combo split into flags:

```bash
mongosh --host localhost:27017 --username myUser --password myPassword --authenticationDatabase myDatabase
```

And here is the certificate one split to `mongosh` flags:

```bash
mongosh --tls --tlsCAFile rootCA.crt --tlsCertificateKeyFile client.pem --host localhost:27017 --username mongoadmin --password secret --authenticationDatabase admin
```

All of the commands below work as well:

```bash
mongosh localhost:27017
mongosh mongodb://localhost:27017
mongosh --host localhost --port 27017
mongosh --host localhost:27017
mongosh --host 127.0.0.1 --port 27017
```

### - C Difference between "mongodb://" and "mongodb+srv://"

The difference between `mongodb://` and `mongodb+srv://` connection strings is about how MongoDB resolves the server addresses:

**`mongodb://` (Standard Connection String)**

- **Direct specification**: You must explicitly list all the hostnames and ports
- **Static**: The connection string contains the exact server addresses
- **Manual maintenance**: If servers change, you need to update the connection string
- **Example**:

```bash
mongodb://user:pass@server1.example.com:27017,server2.example.com:27017,server3.example.com:27017/mydb
```

**`mongodb+srv://` (SRV Connection String)**

- **DNS-based discovery**: Uses DNS SRV records to automatically discover server addresses
- **Dynamic**: MongoDB driver queries DNS to get the current list of servers
- **Automatic maintenance**: If servers are added/removed, DNS is updated and clients automatically discover the changes
- **Simplified syntax**: You only specify the cluster hostname, not individual servers
- **Example**:

```bash
mongodb+srv://user:pass@cluster0.example.com/mydb
```

**Key Advantages of `mongodb+srv://`:**

1. **Automatic Failover**: When replica set members change, the DNS records are updated automatically
2. **Cleaner URLs**: Much shorter and more readable connection strings
3. **Load Balancing**: DNS can distribute connections across available servers
4. **Maintenance-free**: No need to update application code when infrastructure changes

**When to Use Each:**

- **Use `mongodb+srv://`** for production deployments, especially with MongoDB Atlas or managed services
- **Use `mongodb://`** for development, local testing, or when you need explicit control over server addresses

:::info
**SRV** stands for **"Service Record"** - a type of DNS record that provides information about available services, including service location, port numbers, priority, and load balancing weights.
:::

---

## 3. Run Basic MongoDB commands

### - command 1: adminCommand

#### The command's form

```bash
db.adminCommand({ getCmdLineOpts: 1 })
```

#### Description

Check to see all running configuration.

### - command 2: show all existing databases

#### The command's form

```bash
show dbs
```

#### Description

Shows a list of all the databases that are in the cluster.  
Note! Do not touch the "admin" and the "local" databases.  
The `admin` database stores all the user/s with admin privileges, that are able to connect to the cluster.

### - command 3: use

#### The command's form

```bash
use dbName
```

#### Description

Selects a specific database.

Note: If you use some `dbName` that doesn't exist, You'll still get a message saying "switched to
db dbName". But if you do "show dbs", you won't see it on the list. What this means is that mongoDB wanted to be so flexible as to say "Yeah, we're ready to create that db for you if you desire, but technically? right now? It doesn't exist".

### - command 4: show collections

#### The command's form

```bash
show collections
```

#### Description

Shows all the collections in that specific database.

### -command 5: find

#### The command's form

```bash
db.collectionName.find(query);
```

#### Description

This is your way of showing documents that answer to your query's specifications. How to query? The `find` function you saw above requires a query.
The query is actually a json object like so:

```json
{
  "country": "israel",
  "city": "ramat gan"
}
```

:::info
If there are more than 20 documents in the collection that match the query, know that only the first 20 will be shown as the result. To view the next 20 results type `it`, which is short for _iterate_, and press `Enter`.
:::

### -command 6: findOne

#### The command's form

```bash
db.collectionName.findOne(query);
```

#### Description

This is your way to find just one document that matches the query.  
If no query is inserted (empty query), a random document would get pulled.

### -command 7: count

#### The command's form

```bash
db.collectionName.find(query).count();
```

#### Description

This is your way to answer the question "How many are there?".

### -command 8: pretty

#### The command's form

```bash
db.collectionName.find(query).pretty();
```

#### Description

This is your way to present results in a more human-readable way.

---

## 4. Most Used Commands

### - Way Number 1: Using MQL

**<font size="4">-- How to Query:</font>**

#### - Command 1: return the document with the **MAX/MIN HIGHEST SCORE**

```bash
db.users.find({},{ _id: 0, userID: 1}).sort({"userID": -1}).limit(1)
```

#### - Command 2: return only the records which **FIELD DOES/DOESN'T EXISTS**

```bash
db.users.find({ myField: { $exists : true } })
```

#### - Command 3: Does a field exist, is of type array, and **ARRAY CONTAINS AT LEAST ONE ELEMENT**?

```bash
db.users.find({ myArray : { $elemMatch : { $exists : true } } })
```

#### - Command 4: **COUNT HOW MANY** records are there that answer QUERY

```bash
db.users.find({<query>}).count()
```

#### - Command 5: return documents which FIELD IS NOT EQUAL TO some value

```bash
db.users.find({ userID: { $ne: 1 }})
```

#### - Command 6: return documents and PROJECT ONLY SOME FIELDS

```bash
db.users.find({} , { _id: 0, userID: 1, nickname: 1, email: 1 })
```

**<font size="4">-- How to Update:</font>**

When you don't want to use other fields values as reference, you can use this simple MQL operations, that don't include an aggregation pipeline.

#### - Command 1: **ADD NEW FIELD** to one/many/all documents

```bash
db.users.updateMany( { } ,{ $set: { newField: "defaultValue" } } )
```

:::note
NOTE! If the field already exists, it overrides its contents.
:::

#### - Command 2: **DELETE AN EXISTING FIELD** from all (similar to MySql's DROP COLUMN)

```bash
db.grades.updateMany( { studentID: 1 , classID: 460 } , { $unset: { arr1: "" , arr2: "" } } )
```

:::note
NOTE! If the field doesn't exist? updateMany does nothing.
:::

#### - Command 3: **ADD SUB-DOCUMENT TO ARRAY** field

```bash
db.users.updateMany( { userID: 1 } , { $addToSet: { iWatched: { userID:306, ...values } } } )
```

:::note
NOTE! The `$addToSet` doesn't really apply to an array containing sub-documents, in the sense that it will allow inserting a new sub-document with the same values.
:::

#### - Command 4: **DELETE SUB-DOCUMENT FROM ARRAY** field

```bash
db.users.updateMany( { userID: 1 } , { $pull: { iWatched: { userID: 306 } } } )
```

---

### - Way Number 2: Using Aggregation Pipelines

When you **NEED** to use other fields values as reference, you can use an aggregation pipeline MQL update operations. Though their names are the same (like $set and $unset), they work differently when inside a regular update or an aggregation pipeline update.

**<font size="4">-- How to Query:</font>**

#### - Command 1: ...

```bash
...
```

**<font size="4">-- How to Update:</font>**

#### - Command 1: Set field equal to another field

`$set` works exactly the same as it is in normal MQL update, only now you can use other fields values as references.

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

### - Command 2: Unset a field

`$unset` works differently in aggregation than in normal MQL update. If you try to apply `$unset` as its form in the normal MQL update within an aggregation update, you would get an error saying:

> `$unset` specification must be a string or an array

The proper way of applying $unset in an aggregation pipeline update is either by giving it a string with the field's name to unset, or an array of names in case there's more than 1 field you'd like to unset:

```bash
db.users.updateMany(
{
  userID: 354,
},
[
  {
    $unset: ['myDetails.turnsMeOn', 'myDetails.inPurposeOf']
  }
])
```

### - Command 3: Update a specific object inside an array field

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
  }
)
```

Explanation on how to use:

### - Part 1: `$[<identifier>]`

To achieve this, we use a normal MQL update, along with the familiar $set operation, only with a little twist. To reference an array cell, we need to use a special syntax of $\[IDENTIFIER\].

Like so:

```mongo
$set: { '<array>.$[<identifier>].fieldName': some-value }
```

### - Part 2: arrayFilters

In the third object parameter of the update operator, we provide an `arrayFilters`. `arrayFilters` is a special operator, that contains the conditions that would help determine which object inside the array are going to be updated. arrayFilters has a complex behavior, so in order to learn how to use it we need to discuss its rules, and how it behaves.

**-- ARRAY FILTER RULES**

1. Must be an array
   `arrayFilters` is followed by an array structure --> `arrayFilters: []`

2. A single filter - an object inside the array
   The array of arrayFilters contains objects which are filters. Now you must be thinking "Oh! Each object inside the array must be a filter in the sense that a filter means a single condition, that together have a relation of AND". Well... then no. Each object inside the array is a **reference to exactly one array**. What does it mean? Consider a case where you have an array of objects, and an object in that array contains another array within. MongoDB gives you a way to filter within that inner array! And that can be done by providing a **first** filter object that would filter by the first array, and a **second** filter object that would filter by the second array. In 99% percent of cases, you would have an arrayFilters that contains only 1 object in its top level. So now we know that the array of arrayFilters contains filter objects, that each object is a reference to an array in accordance to the level, and that in most cases we would only really need one filter for one top level array.

3. **AND** relation between **different** fields
   To get an **AND** relation effect between **different** inner fields, we simply add them one after another, line by line, like so:

```bash
arrayFilters: [{
  'i.userID': 306,
  'i.lastUpdated': { $lt: 555 }
}]
```

:::warning
**WARNING!**  
This implicit way of writing the AND relation can cause issues if you're using the **same** field name twice!
:::

In the example above, it is implied that we wish for an AND relation. We ask for userID 306 AND lastUpdated before 555. Even though the AND form has a default mode, you can always mention it explicitly:

```bash
arrayFilters: [{
  $and: [
    { 'i.userID': 306 },
    { 'i. lastUpdated':{ $lt: 555 }}
}]
```

Notice how many more notes need to be added to get the same result!

4. **AND** relation for the same key - duplicate key appearance

We saw that the filter in its default mode obscures an AND operation behind it, and that the filter has an object-like structure. Since the filter object is an object, a key **CANNOT** appear twice! It's not an error if it does, it's just that the last appearance of a key would override its predecessors.

Let's see an example:

```bash
arrayFilters: [{
  'i.userID': 306,
  'i.userID': 304,
  'i.userID':{ $lt: 2 }
}]
```

In the example above, only the third one would be taken into account.

5. **OR** relation between **_all_** fields

To get the effect of an OR relation, you must use the explicit way, like so:

```bash
To get the effect of an OR relation, you must use the explicit way, like so:
arrayFilters: [{
  $or: [
    { 'i.userID': 306 },
    { 'i. lastUpdated':{ $lt: 555 }}
}]
```
