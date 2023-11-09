---
sidebar_label: 'Redux'
sidebar_position: 4
---

# Guide for Redux

## 1. Redux Toolkit (RTK)

Redux Toolkit starts with two key APIs that simplify the most common things you do in every Redux app:

* `configureStore` sets up a well-configured Redux store with a single function call, including combining reducers, adding the thunk middleware, and setting up the Redux DevTools integration. It also is easier to configure than `createStore`, because it takes named options parameters.
* `createSlice` lets you write reducers that use [the Immer library](https://immerjs.github.io/immer/) to enable writing immutable updates using "mutating" JS syntax like `state.value = 123`, with no spreads needed. It also automatically generates action creator functions for each reducer, and generates action type strings internally based on your reducer's names. Finally, it works great with TypeScript.

That means that the code you write can be drastically simpler. For example, that same todos reducer could just be:


```jsx [title="features/todos/todosSlice.js"]
import { createSlice } from '@reduxjs/toolkit'

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded(state, action) {
      state.push({
        id: action.payload.id,
        text: action.payload.text,
        completed: false
      })
    },
    todoToggled(state, action) {
      const todo = state.find(todo => todo.id === action.payload)
      todo.completed = !todo.completed
    }
  }
})

export const { todoAdded, todoToggled } = todosSlice.actions
export default todosSlice.reducer
```

<br/>
<br/>
<hr style={{ borderTop: "dashed 1px", backgroundColor: "transparent" }} />
