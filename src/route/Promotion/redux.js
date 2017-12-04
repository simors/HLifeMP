/**
 * Created by wanpeng on 2017/12/4.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as promCloud from './cloud'

/****  Model  ****/
const PromotionRecord = Record({
  id: undefined,
  coverPhoto: undefined,
  typeId: undefined,
  type: undefined,
  goodId: undefined,
  abstract: undefined,
  originalPrice: undefined,
  promotionPrice: undefined,
  price: undefined,
  album: undefined,
  detail: undefined,
  goodStatus: undefined,
  goodUpdatedAt: undefined,
  status: undefined,
  geo: undefined,
  shopId: undefined,
  shopName: undefined,
  shopDistrict: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  distance: undefined,
  distanceUnit: undefined,
  goodName: undefined,
  startDate: undefined,
  endDate: undefined,
}, 'PromotionRecord')

class Promotion extends PromotionRecord {
  static fromJsonApi(lcObj) {
    try {
      let promotion = new PromotionRecord()

    } catch (e) {
      throw e
    }
  }
}

const PromotionState = Record({
  allPromotion: Map(),          // 全部商品活动信息：键-id，值-PromotionRecord
  nearbyPromList: List(),       // 附近的商品活动列表
}, 'PromotionState')

/**** Constant ****/
const FETCH_PROMOTION = "FETCH_PROMOTION"
const SAVE_PROMOTION = "SAVE_PROMOTION"
const BATCH_SAVE_PROMOTION = "BATCH_SAVE_PROMOTION"
const UPDATE_NEARBY_PROM_LIST = "UPDATE_NEARBY_PROM_LIST"

/**** Action ****/
export const actions = {
  fetchPromotionAction: createAction(FETCH_PROMOTION),
  savePromotion: createAction(SAVE_PROMOTION),
  batchSavePromotion: createAction(BATCH_SAVE_PROMOTION),
}

const updateNearbyPromListAction = createAction(UPDATE_NEARBY_PROM_LIST)

/**** Saga ****/
function* fetchPromotion(action) {
  let payload = action.payload

  let apiPayload = {

  }

  try {
    let results = yield call(promCloud.fetchPromotionApi, apiPayload)

  } catch (error) {
    console.error(error)
    if(payload.error) {
      payload.error(error)
    }
  }
}

export const saga = [
  takeLatest(FETCH_PROMOTION, fetchPromotion),

]
/**** Reducer ****/
const initialState = PromotionState()

export function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_NEARBY_PROM_LIST:
      return handleUpdateNearbyPromList(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdateNearbyPromList(state, action) {

}

function onRehydrate(state, action) {
  var incoming = action.payload.PROMOTION
  if (!incoming) return state

  let allPromotionMap = new Map(incoming.allPromotion)
  try {
    for(let [promotionId, promotion] of allPromotionMap) {
      if(promotionId, promotion) {
        let promotionRecord = new PromotionRecord({...promotion})
        state = state.setIn(['allPromotion', promotionId], promotionRecord)
      }
    }
  } catch (error) {
    allPromotionMap.clear()
  }

  let nearbyPromList = incoming.nearbyPromList
  if(nearbyPromList) {
    state = state.set('nearbyPromList', List(nearbyPromList))
  }

  return state
}

/**** Selector ****/
export const selector = {

}