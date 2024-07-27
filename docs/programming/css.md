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

---

## **2. Grid**

### - A. Grid Terminology

Grid container

Grid items

Grid gaps

Grid tracks

### - B. Grid Behavior

```css
.gridContainer {
  display: grid;
}
```

Applying `display: grid` by itself doesn't do anything. By default, any with no further input, its children would act as normal div's inside of a container. `display: grid` in itself doesn't define any rows or columns for us to work with.

To make a grid display as an actual grid, we need to define specific rows or columns manually.

### - C. Grid template columns

There's a property called `grid-template-columns`, with which we can define our columns. In it we need to provide a value, which is a list of all the different columns sizes we want. You can use percentage, pixels, em, rem, whatever you want.

```css
.gridContainer {
  display: grid;
  grid-template-columns: 200px 100px;
}
```

The example above shows a grid defined with 2 columns, where the first one has a width of 200px, and the second column has 100px.

### - D. Flexible columns - The Fraction Unit

What if we wanted our columns to flexibly size themselves based on the items inside of them?

That's when we use the `fraction` unit.

```css
.gridContainer {
  display: grid;
  grid-template-columns: 2fr 1fr;
}
```

In the above example, I've used 2fr and 1fr as my units. The container's full width is then assumed to be 3frs (fraction units) in total, and the first columns would take 2/3 of its total, and the second column would take 1/3 of its total.

### - E. Gap & Padding

When giving the container a gutter gap or padding, you should be aware that it takes up from the space that would be left for the grid items. So, grid items will shrink in order to fit their container. The grid container will first deduct the size of the gaps and its padding, and then divide the remaining space amongst the grid items.

### - F. Repeat

Consider a case where you wanted a large number of columns, lets say 12, and you wanted them all the same size (the "same size" part is important!). In this case, what you would normally do is:

```css
.gridContainer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
```

Looks awful, right? You can really understand how many columns are there with how it's written above. A better way is to use the `repeat` value. `repeat` is basically a css function (like `calc`), that accepts 2 arguments: the columns count, and the unit to repeat over those columns.

```css
.gridContainer {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}
```

### - G. Grid template rows

Same as with `grid-template-columns`, you can define rows with `grid-template-columns`.

```css
.gridContainer {
  display: grid;
  grid-template-rows: 200px 150px;
}
```

The above example will have the first row as 200px height, and the second row with 150px height. But what if I have more than 2 rows? Will it activate as a pattern? Odd rows and even rows? Well, the answer is **no**...

Only the rows you defined (one & two) will follow the given height you provided. The rest of them will take the container's leftover space and divide it equally between them. In case of no space left, they will shrink down to their minimum height, and overflow the container if they can't all fit inside.

So how can we solve this for a case we don't know how many rows there gonna be?Meet `grid-auto-rows`.

### - H. Grid auto rows

If you don't know how many rows a container is going to have, you can use the property known as `grid-auto-rows`. The property `grid-auto-rows` plays well together with `grid-template-rows` property in the sense that rows defined by `grid-template-rows` get defined and follow the rule it dictates, and each row that comes **after** the rows defined in `grid-template-rows`, follow the rule which the `grid-auto-rows` property dictates.

So, for example:

```css
.gridContainer {
  display: grid;
  grid-template-rows: 200px 150px;
  grid-auto-rows: 100px;
}
```

In the above example, the first row is going to have a height of 200px, the second row is going to have a height of 150px, and the remaining rows (which either will or will not get created) are going to have a height of 100px.

In case a `grid-template-rows` property isn't defined, then all rows will be affected by the `grid-auto-rows` property, starting from the first row.

### - I. minmax css function

Let's say you defined a row height using either `grid-template-rows` or `grid-auto-rows`, but the cell's content needs much more space.

What will happen then?

Let's give an example:

```css
.gridContainer {
  display: grid;
  grid-auto-rows: 100px;
}
```

```javascript
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(2,1fr)',
  gridAutoRows: '120px',
  gap: 10,
}}>
  <div>lorem ipsum(100)</div>
  <div>lorem ipsum(25)</div>
  <div>hello</div>
  <div>world</div>
</div>
```

In the above example, the first row is going to have a fixed height of 120px, but the contents of the first cell is going to be huge, it's going to overflow the cell and be display on the cell below. Usually, grid items stretch according to their content, and a row's height is determined by the highest cell within that row, but when we force a row to a certain height, the contents has no choice but to either fit in case it fits, or to overflow in case it needs more space.

A useful trick to solve for this case is to say "well, be at least 150px, instead of hardcoded 150px".

To do that, we can use the css function called `minmax` as a value for the property `grid-auto-rows`.

```css
.gridContainer {
  display: grid;
  grid-auto-rows: minmax(100px, auto);
}
```

In the above scenario, I gave a minimum height of 100px, and set the maximum height to `auto`, which means our grid items can now grow and stretch to fill that minimum content requirement.

### - J. gap (new) and grid-row-gap & grid-column-gap (old)

We usually use `gap` since even gaps make the most sense at 95% of cases, but in those rare cases you need gaps only between rows or only between columns, or just have an uneven gap for rows and cols, you can use `grid-row-gap` & `grid-column-gap`.

```css
.gridContainer {
  display: grid;
  grid-auto-rows: 100px;
  grid-row-gap: 10px;
  grid-column-gap: 5px;
}
```

You should know that `grid-row-gap` & `grid-column-gap` (as well as `grid-gap` which can be used to set both) got **_DEPRECATED_**, and got replaced with `gap`. You should use `gap` instead in the following manner:

```css
.gridContainer {
  display: grid;
  grid-auto-rows: 100px;
  gap: 10px 5px;
}
```

### - K. grid-template-areas

I can't see the usefulness of this, and it seems super hard to maintain in the long run, but oh well... here's the jest of it:

`grid-template-area` allows you to define template areas using nicknames, and then grid items can later then grab these nicknames using the `grid-area` property to layout themselves within the grid.

Here's an example:

```css
.gridContainer {
  display: grid;
  gap: 10px;
  grid-templates-areas:
    "header" "header" "header"
    "sidebar" "content" "content"
    "sidebar" "content" "content"
}

.gridItem1 {
  grid-area: header;
  background-color: red;
}

.gridItem2 {
  grid-area: sidebar;
  background-color: blue;
}

.gridItem2 {
  grid-area: content;
  background-color: green;
}
```

Again, you'l rarely be using this, since there's a better way to achieve the same result in a more maintainable way. And that is with a property called `grid-column-start`.

### - L. grid-column-start & grid-column-end

These two are properties given to the _grid item_ element.  
Using `grid-column-start`, you can tell a grid item from which column it should start spanning from, counting starts from 1, and using `grid-column-end` you can tell it to which column to span.

You might be thinking that start 1 and end 2 will span for 2 columns, but it actually counts as 1 column. The counting is actually that of lines on the grid. In a grid layout of 2 columns, there are 3 separating lines. 2 being that in the middle. In a grid layout of 5 columns, there are 6 separating lines. 3 being that which is in the middle.

There's a special value of negative 1 (-1), which tells the grid item to span all the way across the end of the row.

```css
.gridContainer {
  display: grid;
  grid-auto-rows: 100px;
  grid: repeat(4,1fr);
  gap: 10px;
}

.gridItem1 {
  grid-column-start: 1;
  grid-column-end: -1;
}

.gridItem2 {
  grid-column-start: 1;
  grid-column-end: 3;
}

.gridItem3 {
  grid-column-start: 3;
  grid-column-end: 4;
}
```

There's even a shorthand writing for both the start & end properties, and that's called `grid-column`, which accept 2 arguments. The first one is the start, and the second one is the end:

```css
.gridItem1 {
  grid-column: 1 / -1;
}
```

NOTE! By not mentioning a `grid-column-start`, but do mention a `grid-column-end`, the value for `grid-column-start` is being automatically set to the value you set under `grid-column-end`, minus 1.

```css
.gridItem1 {
  grid-column-end: 4; /* `grid-column-start` will implicitly be set to 3! */
}
```

**• The `span \d` value:**

Instead of giving numbers as values, you can say `span 2` as the value for `grid-column`:

```css
.gridItem1 {
  grid-column: span 2;
}
```

As you can imagine, `span 1` is the default value.

### - L. grid-row-start & grid-row-end

Just as we have `grid-column-start` & `grid-column-end`, we also have `grid-row-start` & `grid-row-end`.

The counting is the same. The total row lines are the amount of rows + 1.

### - M. justify-content & align-content & justify-items & align-items

This can be confusing, since you're used to `justify-content` from flexbox.

What does `justify-content` do in the grid layout sense?

Just like in flexbox, `justify-content` is used on the container. Consider the following case: You have a container, and for some reason, you gave fixed values for the width and height for the grid items. What would happen if the sum of those was smaller then the actual width & height of the container? How would the grid be aligned within that container?

There are a few options for `justify-content`:

- start
- center
- end
- space-around
- space-evenly

Notice how it's `start` and not `flex-start`, and `end` not `flex-end`. Because we're not talking about flex here.

As you can just about now imagine, start would have them (the grid items) stick to the left, end would have them stick to the right, and center would center them.

`align-content` is much like flexbox's `align-items`, in the sense that it controls the **vertical alignment** of the items.

The options for `align-content` are:

- stretch
- center
- ...

`justify-items` allows you control over how to align each item within its column.

The options for `justify-items` are:

- center
- start
- end
- stretch

start being to align to the left of the column, and end being to align to the right of the column. By default, the value is `stretch`.

`align-items` allows you control over how to align each item within its row.

The options for `align-items` are:

- center
- start
- end
- stretch

start being the top of the row, and end being the bottom of the row. By default, the value is set to stretch.

### - N. align-self & justify-self

Just like flexbox, grid has a property called `align-self`, where each grid item can choose to use in order to break from the setting which was set on the grid parent container, and align itself differently.

Since `grid` is 2-dimensional, it has two of those, whereas `flexbox`, which is only 1-dimensional, only has one.

The options for `align-self` are:

- start
- end
- center
- stretch

where `start` means to align to the **top** of the column, and `end` means to align to the **bottom** of the column.

The options for `justify-self` are:

- start
- end
- center
- stretch

where `start` means to align to the **left** of the column, and `end` means to align to the **right** of the column.
