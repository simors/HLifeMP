import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'
import {authReducer} from '../util/auth'
import {appStateReducer} from '../util/appstate'
import {promoterReducer} from '../route/Promoter'
import {shopReducer} from '../route/Shop'
import {mineReducer} from '../route/Mine'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    APPSTATE: appStateReducer,
    AUTH: authReducer,
    PROMOTER: promoterReducer,
    SHOP: shopReducer,
    MINE: mineReducer,
    router: routerReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
