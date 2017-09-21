/**
 * Created by yangyang on 2017/6/28.
 */
import {persistStore} from 'redux-persist'
import createFilter from 'redux-persist-transform-filter'
import immutableTransform from 'redux-persist-transform-immutable'
import createStore from './createStore'
import {appStateAction} from '../util/appstate'

const configFilter = createFilter('CONFIG', [])

export default function persist(store) {
  return persistStore(store, {
    whitelist: ['CONFIG', 'AUTH'],
    // transforms: [configFilter]
  }, () => {
    // TODO: add function after rehydration is finished
    store.dispatch(appStateAction.updateRehydrate({rehydrated: true}))
  })
}

export const store = createStore(window.__INITIAL_STATE__)
export const persistor = persist(store)