import test from 'tape'

import { createStore, combineReducers } from '../src/index'

const counter = {
  initialState: { count: 0 },
  actions: {
    INCREMENT:  'counter/INCREMENT',
    DECREMENT:  'counter/DECREMENT',
    increment: () => ({ type: counter.actions.INCREMENT }),
    decrement: () => ({ type: counter.actions.DECREMENT })
  },
  reducer: (state = counter.initialState, action) => {
    switch (action.type) {
      case counter.actions.INCREMENT:   return { ...state, count: state.count + 1 }
      case counter.actions.DECREMENT:   return { ...state, count: state.count - 1 }
      default: return state
    }
  }
}

const user = {
  initialState: {
    username: 'user',
    password: 's3cr3t'
  },
  actions: {
    SET_PASSWORD: 'user/SET_PASSWORD',
    setPassword: (password) => ({ type: user.actions.SET_PASSWORD, payload: password })
  },
  reducer: (state = user.initialState, action) => {
    switch (action.type) {
      case user.actions.SET_PASSWORD: return { ...state, password: action.payload }
      default: return state
    }
  }
}

test('combineReducers creates a Map of reducers', t => {
  const rootReducer = combineReducers({
    counter: counter.reducer,
    user: user.reducer
  })
  const reducers = new Map()
  reducers.set('counter', counter.reducer)
  reducers.set('user', user.reducer)
  t.deepEqual(rootReducer, reducers)
  t.end()
})

test('createStore uses combineReducers if the root reducer is not an instance of Map', t => {
  const rootReducer = {
    counter: counter.reducer,
    user: user.reducer
  }
  const store = createStore(rootReducer)
  const expected = {
    counter: counter.initialState,
    user: user.initialState,
  }
  t.deepEqual(store.getState(), expected)
  t.end()
})

test('initialState is merged with the first computed state', t => {
  const rootReducer = {
    counter: counter.reducer,
    user: user.reducer
  }
  const initialState = {
    counter: { count: 10 }
  }
  const store = createStore(rootReducer, initialState)
  const expected = {
    counter: initialState.counter,
    user: user.initialState,
  }
  t.deepEqual(store.getState(), expected)
  t.end()
})

test('getState returns store state', t => {
  const rootReducer = combineReducers({ counter: counter.reducer })
  const store = createStore(rootReducer)
  t.deepEqual(store.getState(), { counter: counter.initialState })
  t.end()
})

test('action are dispatched into the store', t => {
  const rootReducer = combineReducers({ counter: counter.reducer })
  const store = createStore(rootReducer)
  store.dispatch(counter.actions.increment())
  t.deepEqual(store.getState(), { counter: { count: 1 } })
  t.end()
})

test('store subscribe', t => {
  const rootReducer = combineReducers({ counter: counter.reducer })
  const store = createStore(rootReducer)
  store.subscribe(state => {
    t.deepEqual(state, { counter: { count: 1 } })
    t.end()
  })
  store.dispatch(counter.actions.increment())
})
