# Inert

## Description

The `inert` attribute is a global HTML attribute that simplifies how to remove and restore user input events for an element, including focus events and events from assistive technologies.

## What is it for

Inert is a default behavior in dialog elements, such as when you use `showModal` to open a dialog for users to make a selection and then dismiss it from the screen. After opening a `<dialog>` the rest of the page becomes inert, for example you can no longer click or tab to links.

:::info
Inert means lacking the ability to move, so when you mark something inert, you remove movement or interaction from those DOM elements.
:::

```html
<div>
  <label for="button1">Button 1</label>
  <button id="button1">I am not inert</button>
</div>
<div inert>
  <label for="button2">Button 2</label>
  <button id="button2">I am inert</button>
</div>
```

Here, `inert` has been declared on the second `<div>` element containing `button2`, so all content contained within this `<div>`, including the button and label, cannot receive focus or be clicked.

The `inert` attribute is especially useful for accessibility, in particular to prevent focus trapping.

## Better accessibility

The Web Content Accessibility Guidelines require focus management and a sensible, usable focus order. This includes both discoverability and interactivity. Previously, discoverability could be suppressed with aria-hidden="true", but interactivity is more difficult.

inert gives developers the ability to remove an element from the tab order, and from the accessibility tree. This lets you control both discoverability and interactivity, and enables the ability to build more usable and accessible patterns.

There are two major use cases for applying inert to an element to enable better accessibility:

- When an element is a part of the DOM tree, but offscreen or hidden.
- When an element is a part of the DOM tree, but should be non-interactive.

## Offscreen or hidden DOM elements

One common accessibility concern is with elements like a drawer, which add elements to the DOM that are not always visible to the user. With inert you can ensure that while the drawer sub elements are offscreen, a keyboard user cannot accidentally interact with it.

## Non-interactive DOM elements

Another common accessibility concern is when a UI design is visible or partially visible, but clearly non-interactive. This could be during page load, while a form is submitting, or if a dialog overlay is open, for example.

To provide the best experience for users, indicate the state of the UI and "trap" the focus to the part of the page that is interactive.

### Focus trapping

_Focus trapping_ is a central concept of good UI accessibility. You should ensure that screen reader focus is on interactive UI elements and aware when an element is blocking interactivity. This also helps limit rogue screen readers from reaching behind a page overlay, or accidentally submitting a form while the first submission is still processing.

Using `inert`, you can ensure that the only discoverable content is reachable. This is helpful for:

- Blocking elements such as a modal dialog, focus-trapping menu, or side nav.
- A carousel with non-active items.
- Non-applicable form content (for example, fading out and disabling the "Shipping address" fields when the "Same as billing address" checkbox has been checked).
- Disabling the entire UI while in an inconsistent state.

## Visually indicate inert elements

By default, there is no visual indication of a subtree being inert. It is recommended that you clearly mark what parts of the DOM are active and which are inert.

```css
[inert], [inert] * {
  opacity: 0.5;
  pointer-events: none;
  cursor: default;
  user-select: none;
}
```

## What interactions and movement are blocked?

By default, `inert` blocks **focus** and **click events**. For assistive technologies, this also blocks tabbing and discoverability. The browser may also ignore page search and text selection in the element.
