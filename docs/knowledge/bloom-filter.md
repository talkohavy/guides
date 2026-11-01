# Bloom Filter

What is a bloom filter? and how does it work?

Let's say you're building the sign up page for an application that has 500M users.

As John types a username, the sign up page tells him if the username is already taken.

<img src={require('@site/static/img/bloom-filter/sign-up-username-check.png').default} alt="bloom filter - sign up username check" width="400" />

Now, one way to check if a username is already taken is to query the database, and see if the username already exists.

<img src={require('@site/static/img/bloom-filter/username-check-database-query.png').default} alt="bloom filter - username check database query" width="400" />

We can quickly check from the database, but... John is not alone. Thousands of people are trying usernames at the same time. And every check is one more database query.

<img src={require('@site/static/img/bloom-filter/many-users-database-queries.png').default} alt="bloom filter - many users database queries" width="400" />

So, how can you instantly answer if the username is free?

This is exactly where bloom filter comes in.

A bloom filter is just a long row of bits, and all the values are 0 at the beginning.

<img src={require('@site/static/img/bloom-filter/empty-bloom-filter.png').default} alt="bloom filter - empty bloom filter" width="400" />

Plus, we have 3 hash functions. A hash function turns any text into a number.

<img src={require('@site/static/img/bloom-filter/hash-functions-to-bits.png').default} alt="bloom filter - hash functions to bits" width="400" />

Now, when John signed up with the username "john", the server ran username "john" through 3 hash functions, and these 3 hash functions gave us 3 numbers: 4, 19 and 42. Now, we go to position 4, and change it from 0 to 1. Similarly, we go to positions 19 and 42, and change them to 1.

<img src={require('@site/static/img/bloom-filter/adding-john.png').default} alt="bloom filter - adding john" width="400" />

If you notice, we never store the word "john" anywhere. We just use 3 bits, and change them to 1. Similarly, all 500M users went through the same step, and changed many bits from 0 to 1.

Now let's say Alan tries to get the username "alan". The server hashes using the same 3 hash functions, and gets positions 8, 19, and 42. Bits 19 and 42 are already filled because of "john", but position 8 is still 0. Now think about this, if username "alan" was already registered, then all 3 positions would have been set to 1 when this username was added to the filter. But position 8 is still 0, which means the username "alan" cannot exist in the database. So we know for sure that the username is available. We haven't even queried the database to check! and that's a big win for us.

<img src={require('@site/static/img/bloom-filter/checking-alan-not-taken.png').default} alt="bloom filter - checking alan not taken" width="400" />

But this bloom filter has a down-side. Let's say Mike checks the username "mike", and the 3 hash functions give positions 4, 27, and 61. bit 4 was activated from "john", bit 27 from "ross", and bit 61 from "sarah". Now, you should pay attention that nobody registered the username "mike", but because every bit from mike is 1, the filter tells us that username "mike" **might be taken**. That's called a false positive. Therefore, we need to ask the database, and the database will confirm if mike is free, and mike sees that the username is available.

<img src={require('@site/static/img/bloom-filter/checking-mike-false-positive.png').default} alt="bloom filter - checking mike false positive" width="400" />

The mental model for you is that bloom filter **can definitely tell you if a username is not taken**, and by such you can avoid the database query. But **it cannot tell you if the username is taken for sure**. So **if any of the bits is 0, we directly say username is not taken**, and we can avoid the database query.

<img src={require('@site/static/img/bloom-filter/definitely-not-taken-vs-maybe-taken.png').default} alt="bloom filter - definitely not taken vs maybe taken" width="400" />

And if you notice, **bloom filter is so space efficient**. If we make a filter with about 5 billion bits, it would only take around 600MB of space, while storing the usernames themselves for 500M users, would take tens of GB.
