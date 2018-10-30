# REDЯUM
A naive implementation of Redux with less than 50 lines of code

## How to use
Here, we create a simple reducer and its actions
```javascript
const increment = () => ({ type: 'counter/INCREMENT' })

const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
  case 'counter/INCREMENT': return { ...state, count: state.count + 1 }
  default: return state
  }
}
```

We create a store by giving a key value pair of reducers to the REDЯUM constructor and keep a reference to it
```javascript
import redrum from '@sbizeul/redrum'

const store = redrum({ counter: counterReducer })
```

We can now dispatch actions to update the state
```javascript
store.dispatch(increment())
assert(store.getState() === { counter: { count: 1 } })
```

To be notified about state changes, you just have to subscribe to the store.
To unsubscribe, you can call the function which was previously returned by the subscription
```javascript
const unsubscribe = store.subscribe(state => {
  assert(state === { counter: { count: 2 } })
})
store.dispatch(increment())
unsubscribe()
```

You can also initialize REDЯUM with some persistent state.
Suppose we have an arbitrary function called `isValidToken` which checks the token stored in the local storage
```javascript
const rootReducer = {
  counter: counterReducer,
  auth: authReducer
}

const initialState = {
  auth: { isAuthenticated: isValidToken() }
}

const store = redrum(rootReducer, initialState)
assert(store.getState().auth === { isAuthenticated: isValidToken() })
```