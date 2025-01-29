# ElasticSearch

## Coming Soon:

- inverted index
- dynamic mapping
- data types (of numbers)
- creating a runtime field
- precision
- recall

---

## 1. Install ElasticSearch

### - Step 1: Install ElasticSearch

Run **elasticsearch** server and expose it to the host:

For a single-node server:

```bash
docker run --name es01 -p 9200:9200 -e ELASTIC_PASSWORD="your_password_here" -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.16.1
```

For a multi-node server, or a server with kibana, you'll need a network:

```bash
docker network create elastic
```

```bash
docker run --name es01 --net elastic -p 9200:9200 -d -e ELASTIC_PASSWORD="your_password_here" -it -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.16.1
```

A little bit about the flags:

- We're giving our container the name "es01".
- The -m flag is here to set a limit for the memory of the container.
- Notice that the version of the elasticsearch image is 8.16.1, which could be out-of-date at the time you're watching this (it is currently the latest).

### - Step 2: store password in an environment variable called `ELASTIC_PASSWORD`

In **MacOS**, put the following line:

```bash
export ELASTIC_PASSWORD="your_password_here"
```

in either one of `.bashrc` or `.zshrc`.

In **Windows**, create an environment variable named `ELASTIC_PASSWORD` and give it the password as value.

### - Step 3: Test Connectivity

Before trying out the tool, let's test the connectivity with raw `curl`:

```bash
curl --insecure -u elastic:$ELASTIC_PASSWORD https://localhost:9200
```

The important parts to note here are:

- I'm using version `8.16.1` of elasticsearch. Different image versions would require different flags & protocols.
- It is required to use the `--insecure` flag.
- It is required to use the `https` protocol.
- It is required to use basic authentication. I had the password stored in an ENV variable called `ELASTIC_PASSWORD`, though you can put it directly in the command, it's just not recommended.

A good response would look like:

```json
{
  "name" : "d37acd14f568",
  "cluster_name" : "docker-cluster",
  "cluster_uuid" : "ORl7COC4TxadsLCODBuA3A",
  "version" : {
    "number" : "8.16.1",
    "build_flavor" : "default",
    "build_type" : "docker",
    "build_hash" : "ffe992aa682c1968b5df375b5095b3a21f122bf3",
    "build_date" : "2024-11-19T16:00:31.793213192Z",
    "build_snapshot" : false,
    "lucene_version" : "9.12.0",
    "minimum_wire_compatibility_version" : "7.17.0",
    "minimum_index_compatibility_version" : "7.0.0"
  },
  "tagline" : "You Know, for Search"
}
```

---

## 2. How to Query in ElasticSearch

There are 2 main ways to search in elasticsearch: `queries` & `aggregations`. Queries are used to retrieve documents that meet certain criteria.

There are 2 types of queries under the "query" command:

- **Leaf Query Clauses**: These clauses search for a specific value in a specific field.
- **Compound Query Clauses**: These clauses combine multiple leaf or compound query clauses to build complex queries.

Some examples of **leaf query** nodes are:

- `match`
- `term`
- `exists`
- `range`
- `multi_match`
- `query_string`
- `match_all`

After all those queries there cannot be any nested queries within.

And then there are the **compound queries**.

Compound is in the sense that it helps combine a bunch of leaf queries together. And this is something we do often, we want several conditions to be met, so we need to combine a number of leaf query nodes.

Some examples of **compound query** arrays:

- `bool`
- `dis_max`
- `function_score`
- `boosting`
- `constant_score`

### A. Leaf Queries

#### - Command 1: `match`

**The form:**

```json
{
  "query": {
    "match": {
      "fieldName": {
        "query": "this is a test",
        "operator": "OR", // <--- optional! defaults to "OR". Options: "AND" | "OR" (default)
        "minimum_should_match": 3, // <--- optional! valid values: 3, -2, 75%
        "boost": 1.0, // <--- optional!
        "fuzziness": 1, // <--- optional! 0, 1, 2...
      }
    }
  }
}
```

The shortest `match` form is:

```json
{
  "query": {
    "match": {
      "firstName": "Sianna"
    }
  }
}
```

**Description**

Returns documents that match a provided text, number, date or boolean value.  
**The provided text is analyzed before matching.**  
The match query is the standard query for performing a full-text search, including options for fuzzy matching.

The match query analyzes any provided text before performing a search. This means the match query can search text fields for analyzed tokens rather than an exact term.

:::info
**Using `minimum_should_match`**

You can use the `minimum_should_match` parameter to specify the number or percentage of `should` clauses returned documents _must_ match.

If the `bool` query includes at least one `should` clause and no `must` or `filter` clauses, the default value is `1`. Otherwise, the default value is 0.
:::

##### Option 1: query

(Required) `text`, `number`, `boolean` or `date` you wish to find in the provided _fieldName_.

##### Option 2: operator

(Optional, string) Boolean logic used to interpret text in the query value. Valid values are:

- **OR (Default)**
  For example, a `query` value of `capital of Hungary` is interpreted as `capital OR of OR Hungary`.
- **AND**
  For example, a `query` value of `capital of Hungary` is interpreted as `capital AND of AND Hungary`.

##### Option 3: auto_generate_synonyms_phrase_query

(Optional, Boolean) If true, match phrase queries are automatically created for multi-term synonyms. Defaults to true.

##### Option 4: boost

(Optional, float) Floating point number used to decrease or increase the relevance scores of the query. Defaults to 1.0.

Boost values are relative to the default value of 1.0. A boost value between 0 and 1.0 decreases the relevance score. A value greater than 1.0 increases the relevance score.

##### Option 5: fuzziness

(Optional, string) Maximum edit distance allowed for matching. See Fuzziness for valid values and more information. See Fuzziness in the match query for an example.

<br/>

---

#### - Command 2: `term`

**The form:**

```json
GET /_search
{
  "query": {
    "term": {
      "fieldName": {
        "value": "kimchy",
        "case_insensitive": true // <--- defaults to false
      }
    }
  }
}
```

The shortest `term` form is:

```json
{
  "query": {
    "term": {
      "fieldName": "kimchy"
    }
  }
}
```

Using `term` + ".keyword" form:  
(Notice that the ".keyword" in `query.term` appears on the fieldName)

```json
{
  "query": {
    "term": {
      "fieldName.keyword": "kimchy"
    }
  }
}
```

**Description**

`term` behaves differently on different data-types.

**When the `fieldName` is a `boolean` type:**

1. Providing a value that isn't `boolean` (i.e. 1 or 0) throws an error.
2. Providing a value of `false` does not mean that a document without the field would match, it won't.

**When the `fieldName` is a `number` type:**

1. Providing a value as a number (34) or as a string ("34") behaves the same.
2. Providing a that isn't a number (i.e. "asd") throws an error.

**When the `fieldName` is a `date` type:**

1. Providing a unix timestamp value that is equal to an ISO string value would be considered as a match (i.e. 585111111111 would match "1988-07-17T02:51:51.110Z". "585111111111" works too). And vice-versa.
2. Providing a value that can't be interpreted as `date` throws an error.

**When the `fieldName` is a `keyword` type:**

1. `term` query with `keyword` field **IS AN EXACT MATCH** query! The provided value must match the field value EXACTLY! Spaces, punctuation, and capitalization. Everything.
2. Providing a value that's only one word out of the field's entire value doesn't count as a match!

**When the `fieldName` is a `text` type:**

1. Avoid using `term` on type `text` fields. Use `match` instead (elasticsearch themselves say that).
1. Providing a value as a number (i.e. 1111) is allowed, and will match a document with value of "1111".
1. Providing a value that has at least 1 capital letter WILL NEVER MATCH! This is because during the search, every fieldName's value is lowercased, whereas the provided value isn't, so zero-match is guaranteed.
1. Providing a lowercased word would match if the document's fieldName value has that word inside of that value. For example. "love" would match "I LOVE YOU", and also "i-love-you", but it won't match "i loveee you".

**When the `fieldName` is a `textAndKeyword` type:**

By default, it behaves just like a `text` type.  
To make it behave like a `keyword` type, you need to add ".keyword" to the end pf fieldName. Like so:

```json
{
  "query": {
    "term": {
      "fieldName.keyword": "kimchy"
    }
  }
}
```

**From elasticsearch docs:**

The `term` query **DOES NOT analyze** the search term. The `term` query only searches for the exact term you provide. To return a document, the term must exactly match the field value, including whitespace and capitalization.

When `case_insensitive` is set to `true`, it will allow **case-insensitive** matching of the value with the indexed field values. Defaults to `false`.

:::warning
Avoid using the term query for `text` fields.

By default, Elasticsearch changes the values of text fields as part of `analysis`. This can make finding exact matches for text field values difficult.

To search `text` field values, use the `match` query instead.
:::

---

#### - Command 3: `exists`

**The form:**

```json
{
  "query": {
    "exists": {
      "field": "user"
    }
  }
}
```

**Description**

Returns documents that contain an indexed value for a field.

In elasticsearch non-existent can mean the following:

- The field in the source JSON is `null` or `[]`
- The field has `"index": false` and `"doc_values": false` set in the mapping
- The length of the field value exceeded an `ignore_above` setting in the mapping
- The field value was malformed and ignore_malformed was defined in the mapping

<br/>

---

#### - Command 4: `range`

**The form:**

```json
{
  "query": {
    "range": {
      "age": {
        "gte": 10,
        "lte": 20,
        "format": "yyyy-MM-dd"
      }
    }
  }
}
```

**Description**

Returns documents that contain terms within a provided range.

The `format` is an optional, string value, Date format, which is used to convert date values in the query.

<br/>

---

Worth mentioning but rarely used:

- `multi_match`
- `query_string`
- `simple_query_string`

---

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

Running the above command as-is would essentially match all documents and fetch all of them.

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

## 3. Aggregation Queries

**The aggregation form:**

```json
{
  "size": 0,
  "aggs": {
    "name-your-agg-here": {
      "specify agg type here": {
        "field": "name of the field you want to aggregate upon",
        "size": "state how many buckets you want returned",
      }
    }
  }
}
```

:::info
Notice the `size: 0` mentioned above?

When querying using the aggregation, our results would appear under a key called `aggregations`. However, there would still be a `hits` key, containing results of actual rows. Generally speaking, we could omit the `size: 0`, and the query would run just fine. It's just that by default, elastic search returns the top 10 results inside the `hits` array field. But when doing an `aggregation`, we're not interested in the `hits`, we're interested in the `aggregations` result. To hide those 10 results, prefer settings `size` to 0. This tells elasticsearch to forget about the top 10 results, because we're just not interested in them.
:::

### Aggregation Type 1: `terms`

**The form:**

```json
{
  "size": 0,
  "aggs": {
    "nameTheAgg": {
      "terms": {
        "field": "firstName.keyword",
        "size": "100", // <--- optional! defaults to 10
        "order": { "_count": "asc" } // <--- optional! default to `"order": { "_count": "desc" }`
      }
    }
  }
}
```

**Description**

The `terms` aggregation creates a new `bucket` _for every unique term_ it encounters for the specified field.

It is often used to find the most frequently found terms in a document.

By default, it returns top 10 terms that are most frequently mentioned in a given dataset, which means it creates up to 10 buckets.

We can override that default behavior and set a custom max bucket size, using the `size` field.

A `terms` aggregation **already counts** for us how many documents fell under each bucket, and is naming the count field for each bucket as `doc_count`, giving it its count value.

By default, the `terms` aggregation will sort the buckets by the doc*count values, \_in a descending order*. You could specify an ascending order if you'd like.

:::info
Note the `.keyword` addition on the _firstName_ above?

When the field is of type `text`, if you don't add the `.keyword`, you'll get back an error!

_"Text fields are not optimiszed for operations that require per-document field data like aggregations and sorting, so these operations are disabled by default. Please use a keyword field instead. Alternatively, set fielddata=true on [firstName] in order to load field data by uninverting the inverted index. Note that this can use significant memory."_
:::

<br/>
<br/>

### Aggregation Type 2: metric aggs `sum`, `avg`, `min`, `max`

**The form:**

```json
{
  "size": 0,
  "aggs": {
    "sum_unit_price_agg": {
      "sum": {
        "field": "unitPrice"
      }
    },
    "max_unit_price_agg": {
      "max": {
        "field": "unitPrice"
      }
    },
    "min_unit_price_agg": {
      "min": {
        "field": "unitPrice"
      }
    },
    "avg_unit_price_agg": {
      "avg": {
        "field": "unitPrice"
      }
    }
  }
}
```

**Description**

Notice how under each custom name there must be only 1 metric aggregation (either sum, max, min or avg). Having more then 1 would result in an error.

**A Result Example**

```json
{
  "took" : 39,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1002,
      "relation" : "eq"
    },
    "max_score" : null,
    "hits" : [ ]
  },
  "aggregations" : {
    "sum_unit_price_agg" : {
      "value" : 1.89859304075E12
    },
    "max_unit_price_agg" : {
      "value" : 6.413472E11
    },
    "min_unit_price_agg" : {
      "value" : 3.091809E7
    },
    "avg_unit_price_agg" : {
      "value" : 1.8948034338822355E9
    }
  }
}
```

<br/>
<br/>

### Aggregation Type 3: `stats`

**The form:**

```json
{
  "size": 0,
  "aggs": {
    "unit_price_agg": {
      "stats": {
        "field": "unitPrice"
      }
    }
  }
}
```

**Description**

Running all these metrics, `min`, `max`, `avg`, and `sum` can be quite tedious. That's why elasticsearch developed the action called `stats`, that calculates all these aggregation metrics in one go for us.

**A Result Example**

```json
{
  "aggregations": {
    "all_stats_unit_price": {
      "count": 426,
      "min": 1.01,
      "max": 498,
      "avg": 4.39,
      "sum": 1876200,
    }
  }
}
```

Notice that the response form is a bit different than if you were to use each one separately.

<br/>
<br/>

### Aggregation Type 4: `cardinality`

**The form:**

```json
{
  "size": 0,
  "aggs": {
    "some_agg_name": {
      "cardinality": {
        "field": "fieldName",
        "precision_threshold": 100 // <--- optional! defaults to 3000
      }
    }
  }
}
```

**Description**

A single-value metrics aggregation that calculates an approximate count of distinct values.

This is best explained with an example. Consider you have a shopping table, and a certain column is the name of the product that was purchased. So you might see: `orange`, `orange`, `banana`, `orange`, `apple`, `apple`, `apple`. Using the `cardinality` agg, you'll get back the value 3.

Note about the word **approximate**. For high numbers this `cardinality` agg isn't accurate. Use it when the distinct count is low.

The default `threshold` value is 3000.  
The maximum supported value is 40000, thresholds above this number will have the same effect as a threshold of 40000

<br/>
<br/>

### Aggregation Type 5: bucket aggs `histogram` & `date_histogram`

**The form:**

```json
{
  "size": 0,
  "aggs": {
    "some_agg_name": {
      "date_histogram": {
        "field": "fieldName",
        "fixed_interval": "specify the interval here, for example: 8h ", // <--- optional! defaults to...
        "calendar_interval": "specify the interval here, for example: 1M " // <--- optional! defaults to...
      }
    }
  }
}
```

:::info
NOTE!

You can use either `fixed_interval`, or `calendar_interval`, but **NOT BOTH**!
:::

---

## 4. Misc.

### - A. `track_total_hits`

**The form:**

```json
{
  "track_total_hits": true,
  "query": {
    "match_all": { }
  }
}
```

**Description**

Generally the total hit count can't be computed accurately without visiting all matches, which is costly for queries that match lots of documents. The `track_total_hits` parameter allows you to control how the total number of hits should be tracked.

The default value `track_total_hits` is set to 10,000.

This means that requests will count the total hit accurately up to 10,000 hits. It is a good trade off to speed up searches if you don’t need the accurate number of hits after a certain threshold.

When `track_total_hits` is set to `true` the search response will always track the accurate number of hits that match the query.

### -B. `from` & `size` (Pagination)

**The form:**

```json
{
  "size": 10,
  "from": 0,
  "query": {
    "match_all": { }
  }
}
```

**Description**

The `size` parameter is the maximum number of hits to return. Defaults to 10.
The `from` parameter defines the number of hits to skip. Defaults to 0.

Combine these two together, these parameters define a page of results.

### -C. `_source`

**The form:**

```json
{
  "_source": [ "firstName", "age" ],
  "from": 0,
  "query": {
    "match_all": { }
  }
}
```

**Description**

Use the `_source: []` to specify what fields would be retrieved and returned back to the user.

By default, `_source` includes all the fields within a document.

When you query the database, under `hits` is where you see the results. Each `hit` includes a `_source` key. `_source` contains the content of the retrieved document itself.

---

## 5. General Examples

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

---

## 6. Practical Session

### A. Setup Data

Mock data we're gonna use:

```json
{"index": {}}
{"name": "Apple", "colors": ["Red", "Green", "Yellow"], "isVegetable": false, "isFruit": true, "size": "Medium", "weight": 150, "description": "A crisp, sweet fruit with a variety of flavors and colors, often enjoyed fresh or in desserts", "lastUpdated": "1988-07-17T02:51:51.111Z"}
{"index": {}}
{"name": "Banana","colors": ["Yellow"],"isVegetable": false,"isFruit": true,"size": "Medium","weight": 120,"description": "","lastUpdated": "1988-07-17T02:51:51.111Z"}
{"index": {}}
{ "name": "Carrot", "colors": ["Orange"], "isVegetable": true, "isFruit": false, "size": "Medium", "weight": 80, "description": "A crunchy, orange root vegetable packed with nutrients, often eaten raw or cooked", "lastUpdated": "1988-07-18T02:51:51.111Z"}
{"index": {}}
{ "name": "Grapes", "colors": ["Green", "Purple", "Red"], "isVegetable": false, "isFruit": true, "size": "Small", "weight": 200, "description": "Small, juicy fruits that come in clusters, available in red, green, or purple varieties", "lastUpdated": "1988-07-18T02:51:51.111Z"}
{"index": {}}
{ "name": "Potato", "colors": ["Brown", "Yellow"], "isVegetable": true, "isFruit": false, "size": "Medium", "weight": 300, "description": "A versatile starchy vegetable, commonly used in dishes like fries, mashed potatoes, and soups", "lastUpdated": "1988-07-19T02:51:51.111Z"}
{"index": {}}
{ "name": "Strawberry", "colors": ["Red"], "isVegetable": false, "isFruit": true, "size": "Small", "weight": 15, "description": "A vibrant red berry with a sweet, slightly tangy flavor, loved for desserts and snacks", "lastUpdated": "1988-07-19T02:51:51.111Z"}
{"index": {}}
{ "name": "Tomato", "colors": ["Red", "Yellow", "Green"], "isVegetable": false, "isFruit": true, "size": "Medium", "weight": 180, "description": "A juicy, red fruit often treated as a vegetable, used in salads, sauces, and cooking", "lastUpdated": "1988-07-19T02:51:51.111Z"}
{"index": {}}
{ "name": "Broccoli", "colors": ["Green"], "isVegetable": true, "isFruit": false, "size": "Medium", "weight": 250, "description": "A green vegetable with a tree-like structure, valued for its rich nutrients and versatility", "lastUpdated": "1988-07-20T02:51:51.111Z"}
{"index": {}}
{ "name": "Orange", "colors": ["Orange"], "isVegetable": false, "isFruit": true, "size": "Medium", "weight": 220, "description": "A citrus fruit with a bright peel and juicy segments, known for its refreshing, tangy flavor", "lastUpdated": "1988-07-20T02:51:51.111Z"}
{"index": {}}
{ "name": "Cucumber", "colors": ["Green"], "isVegetable": true, "isFruit": false, "size": "Medium", "weight": 400, "description": "A cool, crisp vegetable with a mild flavor, often used in salads and as a refreshing snack", "lastUpdated": "1988-07-21T02:51:51.111Z", "textOnly": "hello king george"}

```

The `vegetables` mapping:

```json
{
  "properties": {
    "isFruit": {
      "type": "boolean"
    },
    "isVegetable": {
      "type": "boolean"
    },
    "size": {
      "type": "keyword"
    },
    "weight": {
      "type": "long"
    },
    "lastUpdated": {
      "type": "date"
    },
    "description": {
      "type": "text",
      "fields": {
        "keyword": {
          "type": "keyword",
          "ignore_above": 256
        }
      }
    },
    "textOnly": {
      "type": "text"
    },
  }
}
```

#### - Step 1: Create the first index

Create the index:

```bash
sq create-index
```

And provide the name `vegetables`.

#### - Step 2: Update the index's mapping

Set the index's mapping:

```bash
sq update-mapping --index vegetables
```

#### - Step 3: Insert the data

```bash
sq import --file data.json --index vegetables
```

### B. Example Queries

#### - Query 1: Get all rows

```bash
sq get --index vegetables
```

```json
{
  "query": {
    "match_all": {}
  }
}
```

:::info
This is exactly what `sq get all --index vegetables` command is doing behind the scenes.
:::

#### - Query 2: Get index's mapping

```bash
sq get-mapping --index vegetables
```

#### - Query 3: Get index's mapping

```bash
sq get-mapping --index vegetables
```

#### - Query 4: Get all the vegetables only

```bash
sq get --index vegetables
```

Using a leaf query:

```json
{
  "query": {
    "term": {
      "isVegetable": true
    }
  }
}
```

Using a compound query:

```json
{
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "isVegetable": true
          }
        }
      ]
    }
  }
}
```

#### - Query 5: Get all vegetables/fruits that include the color green

```bash
sq get --index vegetables
```

Using a leaf query:

```json
{
  "query": {
    "term": {
      "colors.keyword": "Green"
    }
  }
}
```

Using a compound query:

```json
{
  "query": {
    "bool": {
      "filter": [{ "term": { "colors.keyword": "Green" } }]
    }
  }
}
```

#### - Query 6: Get documents where the field `textOnly` exists

Using a leaf query:

```json
{
  "query": {
    "exists": {
      "field": "textOnly"
    }
  }
}
```

Using a compound query:

```json
{
  "query": {
    "bool": {
      "filter":[
        {
          "exists": {
            "field": "textOnly"
          }
        }
      ]
    }
  }
}
```

---

## 7. Learn about the Operations

### - Setting Size to 0

Setting "size": 0 in an Elasticsearch query tells Elasticsearch not to return any document results—only the aggregation data. This is useful when you're only interested in summary information or metrics, not in individual documents.

For example, in a query where you're aggregating sales data by category, if you set "size": 0, Elasticsearch skips loading individual documents, which can speed up the query, reduce resource usage, and simplify the response.

If you need both the documents and the aggregation results, you can adjust the size to get a limited number of documents. But for aggregations-only requests, setting "size": 0 is a common best practice.

If you don't specify "size" in an Elasticsearch query, the default is 10. This means Elasticsearch will return up to 10 matching documents along with the aggregation results (if any aggregations are included).
