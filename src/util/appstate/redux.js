/**
 * Created by yangyang on 2017/9/21.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as appStateCloud from './cloud'

/****  Model  ****/

const LocationRecord = Record({
  latitude: undefined,
  longitude: undefined,
  address: undefined,
  country: undefined,
  province: undefined,
  city: undefined,
  district: undefined,
  street: undefined,
  streetNumber: undefined,
}, 'LocationRecord')

const AppState = Record({
  isRehydrated: undefined,     // 是否已完成持久化数据恢复
  location: undefined,
}, 'AppState')

/**** Constant ****/

const UPDATE_REHYDRATE = 'UPDATE_REHYDRATE'
const UPDATE_REHYDRATE_SUCCESS = 'UPDATE_REHYDRATE_SUCCESS'
const GET_WECHAT_JSAPI_CONFIG = 'GET_WECHAT_JSAPI_CONFIG'
const UPDATE_GEO_LOCATION = 'UPDATE_GEO_LOCATION'

/**** Action ****/

export const appStateAction = {
  updateRehydrate: createAction(UPDATE_REHYDRATE),
  getJsApiConfig: createAction(GET_WECHAT_JSAPI_CONFIG),
}

const updateRehydrateSuccess = createAction(UPDATE_REHYDRATE_SUCCESS)

/**** Saga ****/

function* updateAppRehydrate(action) {
  let payload = action.payload
  try {
    yield put(updateRehydrateSuccess(payload))
  } catch (error) {
    console.log('update App State error:', error)
  }
}

function* fetchJssdkConfig(action) {
  let payload = action.payload

  let jsConfigPayload = {
    debug: payload.debug,
    jsApiList: payload.jsApiList,
    url: payload.url,
  }

  try {
    let configInfo = yield call(appStateCloud.getJssdkConfig, jsConfigPayload)
    if(configInfo && payload.success) {
      payload.success(configInfo)
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export const appStateSaga = [
  takeLatest(UPDATE_REHYDRATE, updateAppRehydrate),
  takeLatest(GET_WECHAT_JSAPI_CONFIG, fetchJssdkConfig),
]

/**** Reducer ****/

const initialState = AppState()

export function appStateReducer(state = initialState, action) {
  switch(action.type) {
    case UPDATE_REHYDRATE_SUCCESS:
      return handleUpdateAppRehydrate(state, action)
    case UPDATE_GEO_LOCATION:
      return handleUpdateGeolocation(state, action)
    default:
      return state
  }
}

function handleUpdateAppRehydrate(state, action) {
  state = state.set('isRehydrated', action.payload.rehydrated)
  return state
}

function handleUpdateGeolocation(state, action) {
  let position = action.payload.position
  let location = new LocationRecord({
    latitude: position.latitude,
    longitude: position.longitude,
    address: position.address,
    country: position.country,
    province: position.province,
    city: position.city,
    district: position.district,
    street: position.street,
    streetNumber: position.streetNumber,
  })
  state = state.set('location', location)
  return state
}

/**** Selector ****/

function selectAppState(state) {
  let appState = state.APPSTATE
  return appState.toJS()
}

function getLocation(state) {
  let location = state.APPSTATE.location
  if (location) {
    return location.toJS()
  }
  return {}
}

function getGeopoint(state) {
  let location = state.APPSTATE.location
  if (location) {
    let locJs = location.toJS()
    return {latitude: locJs.latitude, longitude: locJs.longitude}
  }
  return {latitude: 0, longitude: 0}
}

export const appStateSelector = {
  selectAppState,
  getLocation,
  getGeopoint,
}