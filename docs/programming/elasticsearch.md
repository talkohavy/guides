# ElasticSearch

## Coming Soon:

- inverted index
- dynamic mapping
- data types (of numbers)
- creating a runtime field
- precision
- recall

---

## **1. Create a new Index**

```bash
PUT NAME_OF_INDEX
```

An example response is:

```
{
    acknowledged: true,
    shards_acknowledged: true,
    index: 'users',
}
```

---

## **2. Delete an index**

```bash
DELETE NAME_OF_INDEX
```

To check that the index was in fact deleted, simply run `GET NAME_OF_INDEX/_search` and get the error which says `index_not_found_exception`.

---

## **3. Insert a new document**

There are 4 ways for us to add a new document.  
But first, let's discuss the verb words to be used:  
When indexing a new document both the words PUT or POST can be used.

- You use **POST** when you want elasticsearch to _auto-generate an id_ for your document.
- You use **PUT** when you want to _assign a specific id_ to your document.

### - Way Number 1: POST + \_doc

```bash
POST NAME_OF_INDEX/_doc
{
  "field1": "value1",
  "field2": "value2"
}
```

As you can see, the syntax is using a JSON object, and as such, all the annoying rules that apply to a JSON object apply. For example, everything must be quoted, the last key cannot have a comma after it, etc, etc.

An example of a good POST response is:

```json
{
    "_index": "NAME_OF_INDEX",
    "type": "_doc",
    "_id": "kKjg26F",
    "_version": "1",
    "result": "created",
    "shards": {
        "total": 2,
        "successful": 1,
        "failed": "0,
    }
}
```

Notice the `version` field? Version tells you how many time your document has been created, updated, or deleted.

### - Way Number 2: PUT + \_doc + id:

```bash
PUT NAME_OF_INDEX/_doc/id-you-want-to-assign
{
    "field1": "value1",
    "field2": "value2"
}
```

Notice the additional id at the end of the path.  
Usage Example:

```bash
PUT users/_doc/1
{
  "nickname": "YourLoverBoy",
  "city": "Ramat-Gan"
}
```

### - Way Number 3: PUT + \_create + id:

The problem with the PUT & \_doc combination is that it allows you overwrite existing documents. Now, sometimes that's good, but sometimes it's really bad. Sometimes we don't actually want to overwrite existing documents. To prevent that from happening, we could use the \_create endpoint.  
The syntax is very much similar:

```bash
PUT NAME_OF_INDEX/_create/id-you-want-to-assign
{
  "field1": "value1",
  "field2": "value2"
}
```

So now, in case of an \_id duplication it doesn't do anything, it would just throw an error. The error code is 409 - conflict, telling us that the document already exists.

### - Way Number 4: BULK

**The command:**

```json
POST _bulk
{ "create": { "_index": "users", "_id": 1 } }
{ "name": "jake", "salary": 5000, "job_desc": "Vice President" }
{ "create": { "_index": "users", "_id": 2 } }
{ "name": "tal", "salary": 12000, "job_desc": "Full Stack Developer" }
```

## **4. Update an existing document by id**

**The command:**

```json
POST NAME_OF_INDEX/_update/id_of_doc
{
    "doc": {
        "field1": "value1",
        "field2": "value2"
    }
}
```

IMPORTANT!!! Inside the json object, make sure that you have this "doc" as a context.
What this is telling you is "I want to update this document, but only the fields with the values that I specify".

---

## **5. Delete a document by id**

**The command:**

```bash
DELETE NAME_OF_INDEX/_doc/id-of-doc
```

---

## **6. How to Query in ElasticSearch**

To query data in elasticsearch we have a special keyword known as `_search`.
`_search` comes with a TON of options, and we'll only cover the ones most relevant to us in this lesson. With `_search`, there are 2 main ways to search in elasticsearch: `queries` & `aggregations`. Now we will only be focusing on `query`.  
Queries are used to retrieve documents that meet certain criteria.

### - Action 1: Get a Document by id

**The command:**

```bash
GET NAME_OF_INDEX/_doc/id_of_document
```

Tip: Reading it from right to left would make sense. We're requesting the id, of a \_document, inside of an index called "NAME_OF_INDEX".

An example for a good response would like:

```json
{
  "_index": "NAME_OF_INDEX",
  "_type": "_doc ",
  "_id": "1",
  "_version": 1,
  "_seq_no": 1,
  "found": true,
  "_source": {
    "first_name": "John",
    "candy": "kinder bueno"
  }
}
```

Notice that the `_source` part is containing the information inside the document.

### - Action 2: Get all Documents

**The command:**

```json
GET NAME_OF_INDEX/_search
{
  "query": {
    "match_all": {}
  }
}
```

### - Action 3: Get Documents where FIELD is an exact match to value

**The command:**

```json
GET /NAME_OF_INDEX/_search
{
  "query": {
    "term": {
      "custom_field_name": 2
    }
  }
}
```

### - Action 4: Get Documents where Field value ranges between x & Y

**The command:**

```json
GET /NAME_OF_INDEX/_search
{
  "query": {
    "range": {
      "YYY": {
        "gte": "2024-01-01", // or: "2024-09-30T00:00:00"
        "lte": "2024-12-31", // or: "2024-09-30T23:59:59",
        "format": "yyyy-MM-dd" // or: "yyyy-MM-dd'T'HH:mm:ss"
      }
    }
  }
}
```

If the `format` parameter is omitted, Elasticsearch will use the default format defined in the mapping of the `YYY` field. The default format for date fields in Elasticsearch is typically `strict_date_optional_time || epoch_millis`, which means:

1. `strict_date_optional_time`: Accepts dates in various common formats, such as `yyyy-MM-dd` (e.g., `2024-01-01`), `yyyy-MM-dd'T'HH:mm:ssZ` (e.g., `2024-01-01T00:00:00Z`), and more.

2. `epoch_millis`: Accepts dates as timestamps in milliseconds since the Unix epoch (e.g., `1704067200000` for `2024-01-01T00:00:00Z`).

**Behavior Without format**

- If your date values match the default format (e.g., `yyyy-MM-dd` or ISO 8601), the query works without specifying `format`.

- If your dates use a non-standard format (e.g., `dd-MM-yyyy`), Elasticsearch might fail to parse them correctly unless `format` is explicitly specified to match the custom format.

### - Action 5: Get avg value of field

**The command:**

```json
GET /NAME_OF_INDEX/_search
{
  "size": 0,
  "aggs": {
    "my_average_price": {
      "avg": {
        "field": "FIELD_NAME"
      }
    }
  }
}
```

### - Action 6: Count how many instances of a certain value are there

**The command:**

```json
GET /NAME_OF_INDEX/_search
{
  "size": 0,
  "aggs": {
    "products_by_category": {
      "terms": {
        "field": "FIELD_NAME.keyword"
      }
    }
  }
}

```

### - Action 7: Get the sum value of FIELD_NAME

**The command:**

```json
GET /products/_search
{
  "size": 0,
  "aggs": {
    "total_value": {
      "sum": {
        "field": "price"
      }
    }
  }
}
```

`sum` Adds up values of a numeric field.

### - Action 8: Get the avg value of FIELD_NAME

**The command:**

```json
GET /products/_search
{
  "size": 0,
  "aggs": {
    "average_price": {
      "avg": {
        "field": "price"
      }
    }
  }
}
```

### - Action 9: Get the min/max value of FIELD_NAME

**The command:**

```json
GET /products/_search
{
  "size": 0,
  "aggs": {
    "lowest_price": {
      "min": {
        "field": "price"
      }
    }
  }
}
```

`min` / `max` finds the minimum or maximum value. Works on date fields as well.

Here's an example with a date:

```json
GET /your_index/_search
{
  "size": 0,
  "aggs": {
    "earliest_date": {
      "min": {
        "field": "your_date_field"
      }
    },
    "latest_date": {
      "max": {
        "field": "your_date_field"
      }
    }
  }
}
```

The results will be in epoch milliseconds by default, but you can format them to human-readable dates by adding the "format" parameter. For example:

```json
"earliest_date": {
  "min": {
    "field": "your_date_field",
    "format": "yyyy-MM-dd"
  }
}
```

### - Action 10: Group by some field name

**The command:**

```json
GET /products/_search
{
  "size": 0,
  "aggs": {
    "products_by_category": {
      "terms": {
        "field": "category.keyword"
      }
    }
  }
}
```

Here, terms aggregation creates a bucket for each unique category and counts the products in each.

### - Action 11: Group documents by time intervals (day, week, month).

**The command:**

```json
GET /logs/_search
{
  "size": 0,
  "aggs": {
    "logs_per_day": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "day"
      }
    }
  }
}
```

## 7. Learn about the Operations

### - Setting Size to 0

Setting "size": 0 in an Elasticsearch query tells Elasticsearch not to return any document results—only the aggregation data. This is useful when you're only interested in summary information or metrics, not in individual documents.

For example, in a query where you're aggregating sales data by category, if you set "size": 0, Elasticsearch skips loading individual documents, which can speed up the query, reduce resource usage, and simplify the response.

If you need both the documents and the aggregation results, you can adjust the size to get a limited number of documents. But for aggregations-only requests, setting "size": 0 is a common best practice.

If you don't specify "size" in an Elasticsearch query, the default is 10. This means Elasticsearch will return up to 10 matching documents along with the aggregation results (if any aggregations are included).
