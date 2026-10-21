# Create Table

Let's create our first table now:

```sql
CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    spelling VARCHAR(255),  -- or use TEXT for longer strings
    score INT CHECK (score >= 0 AND score <= 100)
);
```

Let's add a few records to the new "words" table:

```sql
INSERT INTO words (word, score) VALUES
('Hello world', 10),
('PostgreSQL is great', 20),
('Database management', 30),
('Learning SQL', 40);
```
