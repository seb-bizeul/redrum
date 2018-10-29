import uuid from 'uuid/v4'

const INIT = '@@redrum/__INIT__'

const _notify = (subscribers, state) => subscribers.forEach(f => f(state))

const _dispatch = store => action => {
  store.reducers.forEach((reducer, name) => {
    store.state[name] = reducer(store.state[name], action)
  })
  if (action.type === INIT && action.payload != null) {
    store.state = { ...store.state, ...action.payload }
  }
  _notify(store.subscribers, store.state)
}

const _subscribe = subscribers => f => {
  const id = uuid()
  subscribers.set(id, f)
  return () => subscribers.delete(id)
}

const _init = initialState => ({ type: INIT, payload: initialState })

export const combineReducers = map => {
  return Object.entries(map).reduce((acc, [name, fn]) => {
    acc.set(name, fn)
    return acc
  }, new Map())
}

export const createStore = (rootReducer, initialState = {}) => {
  const store = {
    reducers: rootReducer,
    subscribers: new Map(),
    state: {}
  }

  _dispatch(store)(_init(initialState))

  return {
    dispatch: _dispatch(store),
    subscribe: _subscribe(store.subscribers),
    getState: () => store.state
  }
}
