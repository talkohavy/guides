# MongoDB

## 1. Useful Commands

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

#### - Command 4: **COUNT HOW MANY** records are there that answer <query>

```bash
db.users.find({<query>}).count()
```

#### - Command 5: return documents which <field> IS NOT EQUAL TO some value

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
