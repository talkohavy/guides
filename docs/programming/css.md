---
sidebar_label: '20. CSS'
sidebar_position: 19
---

# Guide For CSS

## **1. Flexbox**

### - A. Defaults of Flexbox

When giving an element a display of `flex` there are some defaults given to that element.

Here are the defaults of `display: flex`:

```css
.flexParent {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  flex-direction: row;
  gap: 0;
  flex-wrap: nowrap;
}

.flexItem {
  flex-shrink: 1;
  flex-grow: 0;
  flex-basis: auto;
}
```

### - B. Flex items Behavior

As soon as you give an element a display of flex, all the `display: block` stuff goes out the window. They are no longer display block/span, they are now what's called **flex items**, and they're behaving like flex items.

If you went to a flex item, and gave it a display block:

```css
.flexItem {
  display: block; /* or inline */
}
```

absolutely nothing will happen! Of course, there's the exception of display none which would make them disappear.

One of the things that a flex item wants to do is it wants to be as small as it can be while maintaining everything in one line. There's a value known as `max-content`, and what it does...

```css
.someElement {
  width: max-content;
}
```

is it tries to maintain text content in one line, and basically telling the element "hey, you're not allowed to wrap", and when all that text is in one line, then that's the element's width!

There's another value known as `min-content`, which allows for wrapping, and in this case the width of an element is determined by the longest single word.

Both `min-content` & `max-content` play a role in flexbox, and so it's important to talk about them.

When we do our display of `flex`, each flex item is going to that `max-content` size, and it's shrinking them down to the smallest size they can be, while maintaining `max-content` - which means no wrapping allowed, no line-breaks. All that is true **if** all the flex items can fit the parent's size. When the parent runs out of room, flex items are allowed to create line-breaks, **until**! until they can no longer shrink beyond their `min-content`, and that's when we get a _parent overflow_.

**• Why do different children get different widths?**

you might have come across it when you give a parent container element a display of `flex`, and it has 3 children, and 2 of them get width X while the third one get a width of Y, and you're not sure why.

To better understand this behavior try running a little experiment that mimics what flexbox is actually doing automatically behind the scenes. First, give all the flex items a `flex-shrink` of 0, basically turning off the default behavior of 1. This is the first step flexbox is doing behind the scenes in order to calculate how big each flex item would be without the shrink on it. By giving each flex item a `flex-shrink` of 0 you're essentially choosing by your own volition to overflow the parent element, providing each flex item a width of `max-content` that disallows shrinking.

The next step flexbox does is switch the value of `flex-shrink` to 1. In this step, flexbox is taking the joint width of all the flex items combined, and by and fits it in the parent container, while shrinking each flex item relative to its ratio when it had `flex-shrink` 1.

### - C. Flex Shrink

The default for `flex-shrink` is 1.  
If we didn't have `flex-shrink` enabled by default, and we were to turn it off:

```css
.flexItem {
  flex-shrink: 0;
}
```

and now we tried shrinking the screen down, we immediately get a _parent overflow_. Essentially, what this means is that flex item get their width set to `max-content` size, and that's the size they are, and they are not allowed to shrink from that point on.

`flex-shrink` being set to 1 is a pretty good default, and if it were set to 0, we would have basically almost always turn it on manually.

### - D. Flex Grow

The default for `flex-grow` is 0, which means "don't grow at all".  
The `flex-grow` value can be more than 1, and starts this thing where there's a ratio on things are growing, but it's good practice that if you turn it one then simply put it to 1.

So what does `flex-grow` do?

`flex-grow` takes all the leftover space that the parent has, and splits it evenly (if they're all set to 1) between the flex items.

Usually with navigation links bar we want that default behavior of grow being off.

One important thing to note, the grows rate of each row is independent! What this means in simpler terms is that if there are 2 rows, and in one there's 6 items, and in the other there's 4 items, one split will be amongst the 6 (divide by 6), and one split will be among the 4 (divide by 4).

But how can it be that we got more than 1 row in the first place? Meet `flex-wrap`.

### - E. Flex Wrap

`flex-wrap` is set to `nowrap` by default.  
There's another value called `wrap`, which allows flex items to wrap once they hit the parent's max width.

So basically, instead of having a _parent overflow_, you're getting a _parent wrap_.

### - F. What is flex: 1?

A common thing you'll see in other people's project is the use of the shorthand write of:

```css
.flexItem {
  flex: 1;
}
```

and you probably know that what this usually means is that the developer wanted every flexItem to be equally sized. But why is this happening?

The `flex` attribute actually accepts 3 things as its argument.  
The `flex` attribute is like the `border` attribute in the sense that they are a way to write many attributes in one line:

```css
.someItem {
  border: 1px solid black;
}
```

is exactly the same as:

```css
.someItem {
  border-width: 1px;
  border-style: solid;
  border-color: black;
}
```

What `flex: 1` really means is this:

```css
.flexItem {
  flex: 1;
}
```

is exactly the same as:

```css
.flexItem {
  flex-shrink: 1;
  flex-grow: 1;
  flex-basis: 0;
}
```

Let's analyze what we got here.  
`flex-shrink` is 1 by default, so `flex: 1` did not touch that. cool.  
`flex-grow` is 0 by default, so we see that `flex: 1` changed it to 1, and this is expected, since we want all flex items to be equally sized. Naturally this would mean that some of them would have to grow, and some of them would have to shrink.

But what is this `flex-basis` thingy?

Imagine th following settings:

```css
.flexItem {
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 300px;
}
```

What this says it this: "Hey, don't let flex items shrink, don't let them grow, but in fact - give each one a width of 300px".

Regardless of what the parent's width is, each child _would_ in fact get a width of a 300px. And if an overflow situation were to occur? Then so be it!  
You can think of `flex-basis` a lot like width. It _is_ different from width, but it's very very similar, and often thinking about them in the same way is the easiest way to really understand what's happening.

That being said, we normally don't use "px" on it as values, rather we use percents.

One of the differences between `width` and `flex-basis` is when you set `flex-basis` to 0, the flex items don't actually become of 0 width. `flex-basis` 0 actually means `min-content` value.

**Important thing to note!** You _shouldn't_ use `width` AND `flex-basis` together. `width` wins the battle in case both are mentioned. In any case, you should use one or the other, not both.

I usually like to give each flex-item a width of 100%, which is in the case the same as setting `flex-basis` to 100%.

```css
.flexItem {
  flex-shrink: 1;
  flex-grow: 1;
  flex-basis: auto;
}
```

**• Edge Case 1:**

Consider the following case:

```css
.flexItem {
  flex-shrink: 0;
  flex-grow: 1;
  flex-basis: 100%;
}
```

What would happen in the above scenario?

Because the shrink is off, and the basis is 100%, each child will have 100% of the parent's width, and an overflow is guaranteed to happen if there's more than 1 flex item.

### - G. align-self

Often time when working in a `flex-direction: column` situation, you find yourself doing this:

```css
.flexParent {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
```

and you've seen this a million times. You want a column, you want the flex items to space evenly between, and you want each flex item to be aligned to the left.

However! Amongst the flex items, there's one child item which you want aligned differently than its brothers. Either to the right, or to the center. It could be that this flex item is a title, or maybe a button at the bottom.  
This can be done by using `align-self`.

```css
.specialFlexItem {
  align-self: center;
}
``
```

### - H. Flex Flow

This is a shorthand for the flex-direction and flex-wrap properties, which together define the flex container’s main and cross axes. The default value is `row nowrap`.

```css
.container {
  flex-flow: column wrap;
}
```

### - I. How is it calculated with padding & margins?

When flexbox is doing its calculations, it's **NOT** taking into account each flex item's paddings & border widths.

Now what does that mean exactly? And why they decided it should behave like that?

So, we know that flex items can either shrink or grow to fill the parent element's width. Think about it this way: do you really want the _border width_ to grow or shrink? Now that wouldn't make much sense, does it? So, what flexbox does it it deducts all those border widths up front, and hen proceeds to fit the flex items in the space that's left. For instance, if a parent element has a width of 600, and 1 flex item has a border width of 2, then flexbox takes the 600 and deducts 4 from it (because there's a border of each side), and proceed to divide 596 by 3.
