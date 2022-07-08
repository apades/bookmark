import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import bookmarks, { BookmarksAction, BookmarksState } from './bookmarks'
import select, { SelectAction, SelectState } from './select'
import setting, { SettingAction, SettingState } from './setting'

let rootReducer = combineReducers({
  bookmarks,
  select,
  setting,
})

let store = (function configureStore() {
  const middlewares = [thunkMiddleware]
  const middlewaresEnhancer = applyMiddleware(...middlewares)
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  const store = createStore(
    rootReducer,
    /* preloadedState, */ composeEnhancers(middlewaresEnhancer)
  )

  return store
})()

export default store
export type StateBase = {
  bookmarks: BookmarksState
  select: SelectState
  setting: SettingState
}

export type RootActions = BookmarksAction | SelectAction | SettingAction

export type AppDispatch = typeof store.dispatch
