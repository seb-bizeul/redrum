# REDЯUM
A naive implementation of Redux with less than 50 lines of code

## How to use
Here, we create a simple reducer and its actions
```javascript
const INCREMENT = 'counter/INCREMENT'

const increment = () => ({ type: counter.actions.INCREMENT })

const counter = (state = { count: 0 }, action) => {
  switch (action.type) {
  case counter.actions.INCREMENT: return { ...state, count: state.count + 1 }
  default: return state
  }
}
```

We create a store by giving a key value pair of reducers to the REDЯUM constructor and keep a reference to it
```javascript
import redrum from '@sbizeul/redrum'

const store = redrum({ counter: counter.reducer })
```

We can now dispatch actions to update the state
```javascript
store.dispatch(counter.actions.increment())
assert(store.getState() === { counter: { count: 1 } })
```

To be notified about state changes, you just have to subscribe to the store 
```javascript
store.subscribe(state => {
  assert(state === { counter: { count: 2 } })
})
store.dispatch(counter.actions.increment())
```

You can also initialize REDЯUM with some persistent state.
Suppose we have an arbitrary function called `isValidToken` which checks the token stored in the local storage
```javascript
const rootReducer = {
  counter: counter.reducer,
  auth: auth.reducer
}

const initialState = {
  auth: { isAuthenticated: auth.isValidToken() }
}

const store = redrum(rootReducer, initialState)
assert(store.getState().auth === { isAuthenticated: auth.isValidToken() })
```