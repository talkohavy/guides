# React Testing Library

## 1. Introduction

### A. What is React-Testing Library?

`React-Testing Library` is a light-weight solution for **testing web pages by querying and interacting with DOM nodes**. It is great for **Component** testing.

What it gives you:

1. a `render` function to render a component.
2. many ways to **query** the generated DOM
3. fire events
4. Integration with multiple frameworks (`React` is one of them)

(whether simulated with JSDOM/Jest or in the browser). The main utilities it provides involve querying the DOM for nodes in a way that's similar to how the user finds elements on the page. In this way, the library helps ensure your tests give you confidence that your application will work when a real user uses it.

### B. What it is not

1. A test runner or framework.
2. Specific to a testing framework.
3. Does NOT provide DOM APIs. For that you'll need either `Jest` (i.e. `@testing-library/jest-dom`), `Mocha` + `JSDOM`, or a real browser.

---

## 2. Installation

Install these:

```bash
pnpm add -D @testing-library/dom @testing-library/jest-dom @testing-library/react jest jest-environment-jsdom ts-jest
```

And check out [how to configure `jest` in your project](/docs/programming/tests/jest#1-installation)

Then, create a `setup.tsx` file with the contents:

```ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-test-id' });
```

And you're ready to write **Component tests**! ✅

---

## 999. Tips & Tricks

### - Tip 1: Wrapping things in `act` unnecessarily

```ts
// ❌
act(() => {
	render(<Example />)
})

const input = screen.getByRole('textbox', { name: /choose a fruit/i })
act(() => {
	fireEvent.keyDown(input, { key: 'ArrowDown' })
})

// ✅
render(<Example />)
const input = screen.getByRole('textbox', { name: /choose a fruit/i })
fireEvent.keyDown(input, { key: 'ArrowDown' })
```

Do NOT wrap `render` & `fireEvent` in `act()`!!!  
`render` and `fireEvent` are **already wrapped in `act`!**.

### - Tip 2: Do not use `cleanup`

```ts
// ❌
import { render, screen, cleanup } from '@testing-library/react'

afterEach(cleanup)

// ✅
import { render, screen } from '@testing-library/react'
```

For a long time now `cleanup` happens automatically, and you no longer need to worry about it. Learn more.

### - Tip 3: Not using @testing-library/user-event

```ts
// ❌
fireEvent.change(input, { target: { value: 'hello world' } })

// ✅
userEvent.type(input, 'hello world')
```

### - Tip 4: Using queryByRole (and friends) NOT for non-existence

The best thing `.toBeInTheDocument` can do is say: "null isn't in the document" which is not very helpful.

The only reason that `queryByRole` and friends exist is for you to have a function to call which **does not throw an error if no element is found!**. It returns `null` if no element is found.
The only reason this is useful is to verify that an element is not rendered to the page.

### - Tip 5: Using waitFor to wait for elements that can be queried with find\*

```ts
// ❌
const submitButton = await waitFor(() =>
	screen.getByRole('button', { name: /submit/i }),
)

// ✅
const submitButton = await screen.findByRole('button', { name: /submit/i })
```

Those two bits of code are basically equivalent (find\* queries use waitFor under the hood), but the second is simpler and the error message you get will be better.  
Tip: use find\* anytime you want to **query for something that may not be available right away**.

### - Tip 999: Use `eslint`
