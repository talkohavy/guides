# ElasticSearch

## Coming Soon:

- inverted index
- dynamic mapping
- data types (of numbers)
- creating a runtime field
- precision
- recall

---

## **1. How to Query in ElasticSearch**

There are 2 main ways to search in elasticsearch: `queries` & `aggregations`. Queries are used to retrieve documents that meet certain criteria.

There are 2 types of queries under the "query" command:

- **Leaf Query Clauses**: These clauses search for a specific value in a specific field.
- **Compound Query Clauses**: These clauses combine multiple leaf or compound query clauses to build complex queries.

Some examples of **leaf query** nodes are:

- match
- multi_match
- query_string
- term
- range
- match_all

After all those queries there cannot be any nested queries within.

And then there are the **compound queries**.

Compound is in the sense that it helps combine a bunch of leaf queries together. And this is something we do often, we want several conditions to be met, so we need to combine a number of leaf query nodes.

Some examples of **compound query** arrays:

- bool
- dis_max
- function_score
- boosting
- constant_score

### A. Leaf Nodes

#### - match

...write here...

#### - multi_match

...write here...

#### - query_string

...write here...

#### - term

...write here...

### B. Compound Queries

#### - Command parent: `bool`

**The form:**

```json
{
  "query": {
    "bool": {
      "must": [],
      "filter": [],
      "should": [],
      "must_not": []
    }
  }
}
```

**Description:**

The bool compound is useful when you want to combine a number of leaf queries by using a boolean operation like an `AND` or `OR` or `NOT`.

Use `bool.must` when you need to implement an `AND`.  
Use `bool.should` when you need to implement an `OR` operator.  
Use `bool.must_not` when you need to implement a `NOT` operator.

All 3 are nothing but arrays of sub-documents, inside which we need to write all the leaf queries.

Like `bool.must`, the `bool.must_not` has an `AND` relation between all its leaf nodes.

**_<font size="4">`bool.filter` V.S. `bool.must`</font>_**

There's a fourth member called `bool.filter` we haven't talked about.

In a way, the `bool.filter` and the `bool.must` are very much alike. They only differ by some small things. When we write a leaf query inside a `bool.must`, that query will contribute to the **relevance score**, but if it written inside the `bool.filter`, it will not have any effect on the score. Use `bool.filter` for faster searches, because there is no score to compute and no ranking to be done.

<br/>
<br/>

#### - Command 1: `bool.must`

**The form:**

```json
{
  "query": {
    "bool": {
      "must": [],
    }
  }
}
```

**Description:**

`bool.must` is like an `AND` operation. The `must` is an array of checks, and **ALL** checks must be met in order for a document to go through and be considered a result. `must` goes really well together with the `match` leaf query.

**Usage Example:**

```json
{
  "query": {
    "bool": {
      "must": [
        { "match": { "fieldName": "Luna" } }
      ],
    }
  }
}
```

<br/>
<br/>

#### - Command 2: `bool.filter`

**The form:**

```json
{
  "query": {
    "bool": {
      "must": [],
    }
  }
}
```

**Description:**

Only documents that meet the criteria mentioned under `bool.filter` would pass through. The `bool.filter` field _DOES NOT affect the ranking_ score of each document. Using ONLY the `bool.filter` field in our query would result in all returned documents having a score of 0, because we haven't specified a "relevance" factor to be taken into consideration.

**Usage Example:**

```json
{
  "query": {
    "bool": {
      "filter": [
        { "match": { "fieldName": "Luna" } },
        { "exists": { "field": "fieldName" } },
        { "range": { "salary": { "gte": 5000, "lte": 20000 } } }
      ],
    }
  }
}
```

<br/>
<br/>

#### - Command 3: `bool.should`

**The form:**

```json
{
  "query": {
    "bool": {
      "should": [],
    }
  }
}
```

**Description:**

`bool.should` is like an `OR` operation. It is an array of checks, and **AT LEAST ONE** check must be met in order for a document to go through and be considered a result. Like `bool.must`, the `bool.should` goes really well with the `match` leaf node.

**Usage Example:**

```json
{
  "query": {
    "bool": {
      "should": [
        { "match": { "job_desc": "President" } },
        { "match": { "name": "Anna" } },
      ],
    }
  }
}
```

In the example above, the documents to be returned would:

- Either have a name of "Anna".
- Either have a job description of President
- Or both!

<br/>
<br/>

#### - Command 4: `bool.filter`

**The form:**

```json
{
  "query": {
    "bool": {
      "must": [],
    }
  }
}
```

**Description:**

We use the `bool.filter` to filter out results based on a "yes / no" questions. Only documents that meet the criteria mentioned under this field would pass through. The filter field _DOES NOT affect the ranking_ score of each document. Using ONLY the `bool.filter` field in our query would result in all returned documents having a score of 0, because we haven't specified a "relevance" factor to be taken into consideration.

**Usage Example:**

```json
{
  "query": {
    "bool": {
      "filter": [
        { "match": { "fieldName": "Luna" } },
        { "exists": { "field": "fieldName" } },
        { "range": { "salary": { "gte": 5000, "lte": 20000 } } }
      ],
    }
  }
}
```

---

## **2. Misc.**

### - A. `track_total_hits`

Generally the total hit count can't be computed accurately without visiting all matches, which is costly for queries that match lots of documents. The `track_total_hits` parameter allows you to control how the total number of hits should be tracked.

The default value `track_total_hits` is set to 10,000.

This means that requests will count the total hit accurately up to 10,000 hits. It is a good trade off to speed up searches if you don’t need the accurate number of hits after a certain threshold.

When `track_total_hits` is set to `true` the search response will always track the accurate number of hits that match the query.

### -B. `from` & `size` (Pagination)

The `size` parameter is the maximum number of hits to return. Defaults to 10.
The `from` parameter defines the number of hits to skip. Defaults to 0.

Combine these two together, these parameters define a page of results.

---

## **3. Practical Examples**

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
