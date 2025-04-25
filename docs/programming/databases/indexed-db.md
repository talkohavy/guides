# IndexedDB

## 1. Minimal code for console

Create a new ObjectStore (a table:)

```js
function createDB(dbName, tableName){
  if(!dbName || !tableName) throw new Error('dbName & tableName are required params')

  const request = indexedDB.open(dbName, 1);

  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore(tableName, { keyPath: 'id', autoIncrement: false });
  };

  request.onsuccess = () => console.log('Connected successfully.');
  request.onerror = (event) => console.log('Failed...', event.target.error);
}
```

Add 1 record:

```js
function addRecord(dbName, tableName, data){
  if(!dbName || !tableName || !data) throw new Error('dbName & tableName & data are required params')

  const request = indexedDB.open(dbName, 1);

  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(tableName, 'readwrite');
    const store = transaction.objectStore(tableName);
    store.add(data);
  };
}
```

Get all records:

```js
function getAll(dbName, tableName){
  if(!dbName || !tableName) throw new Error('dbName & tableName are required params')

  const request = indexedDB.open(dbName, 1);

  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(tableName, 'readonly');
    const store = transaction.objectStore(tableName);
    const getAllRequest = store.getAll();

    getAllRequest.onsuccess = function() {
      console.log(getAllRequest.result);
    };
  };
}
```

Get 1 records by id:

```js
function getRecordById(dbName, tableName, id){
  if(!dbName || !tableName || !id) throw new Error('dbName & tableName & id are required params')

  const request = indexedDB.open(dbName, 1);

  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(tableName, 'readonly');
    const store = transaction.objectStore(tableName);
    const getAllRequest = store.get(id);

    getAllRequest.onsuccess = function() {
      console.log(getAllRequest.result);
    };
  };
}
```
