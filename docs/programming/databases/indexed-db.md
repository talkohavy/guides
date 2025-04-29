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
}
```

Add 1 record:

```js
function addRecord(dbName, tableName, data) {
  return new Promise((resolve) => {
    if (!dbName || !tableName || !data) throw new Error('dbName & tableName & data are required params');

    const request = indexedDB.open(dbName, 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(tableName, 'readwrite');
      const store = transaction.objectStore(tableName);
      const addRequest = store.add(data);

      addRequest.onsuccess = () => {
        resolve(addRequest.result);
      };
    };
  });
}
```

Get all records:

```js
function getAll(dbName, tableName) {
  return new Promise((resolve) => {
    if (!dbName || !tableName) throw new Error('dbName & tableName are required params');

    const request = indexedDB.open(dbName, 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(tableName, 'readonly');
      const store = transaction.objectStore(tableName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
    };
  });
}
```

Get 1 records by id:

```js
function getRecordById(dbName, tableName, id) {
  return new Promise((resolve) => {
    if (!dbName || !tableName || !id) throw new Error('dbName & tableName & id are required params');

    const request = indexedDB.open(dbName, 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(tableName, 'readonly');
      const store = transaction.objectStore(tableName);
      const getAllRequest = store.get(id);

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
    };
  });
}
```
