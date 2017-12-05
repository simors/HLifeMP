/**
 * Created by lilu on 2017/12/5.
 */
import {store} from '../store/persistStore'
import {appStateAction} from './appstate'

export function updateProvincesAndCities(payload) {
  store.dispatch(appStateAction.updateProvinceAndCities(payload))
}