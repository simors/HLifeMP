import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'
import {reducer as sysUserReducer} from '../route/sysuser/redux'
import {configReducer} from '../util/config'
import {authReducer} from '../util/auth'
import {appStateReducer} from '../util/appstate'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    APPSTATE: appStateReducer,
    AUTH: authReducer,
    CONFIG: configReducer,
    router: routerReducer,
    sysuser: sysUserReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
