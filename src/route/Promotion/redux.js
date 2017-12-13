/**
 * Created by wanpeng on 2017/12/4.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as promCloud from './cloud'
import {shopAction, shopSelector} from '../Shop'

/****  Model  ****/
const PromotionRecord = Record({
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  promotionPrice: undefined,
  targetGoodsId: undefined,
  targetShopId: undefined,
  startDate: undefined,
  endDate: undefined,
  abstract: undefined,
  status: undefined,
  type: undefined,
  typeId: undefined,
  geo: undefined,
}, 'PromotionRecord')

class Promotion extends PromotionRecord {
  static fromJsonApi(lcObj) {
    try {
      let promotion = new PromotionRecord()
      return promotion.withMutations((record) => {
        record.set('id', lcObj.id)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
        record.set('promotionPrice', lcObj.promotionPrice)
        record.set('targetGoodsId', lcObj.targetGoodsId)
        record.set('targetShopId', lcObj.targetShopId)
        record.set('startDate', lcObj.startDate)
        record.set('endDate', lcObj.endDate)
        record.set('abstract', lcObj.abstract)
        record.set('status', lcObj.status)
        record.set('type', lcObj.type)
        record.set('typeId', lcObj.typeId)
        record.set('geo', lcObj.geo)
      })
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
const CREATE_PAYMENT_REQUEST = "CREATE_PAYMENT_REQUEST"

export const PAYMENT_TYPE = {
  INVITE_PROMOTER: 1,       // 邀请推广员获得的收益
  INVITE_SHOP: 2,           // 邀请店铺获得的收益
  BUY_GOODS: 3,             // 购买商品
  REWARD: 4,                // 打赏
  WITHDRAW: 5,              // 取现
  PUBLISH_PROMOTION: 6,     //发布活动
}
/**** Action ****/
export const actions = {
  fetchPromotionAction: createAction(FETCH_PROMOTION),
  savePromotion: createAction(SAVE_PROMOTION),
  batchSavePromotion: createAction(BATCH_SAVE_PROMOTION),
  createPaymentRequest: createAction(CREATE_PAYMENT_REQUEST),
}

const updateNearbyPromListAction = createAction(UPDATE_NEARBY_PROM_LIST)

/**** Saga ****/
function* fetchPromotion(action) {
  let payload = action.payload

  let apiPayload = {
    geo: payload.geo,
    limit: payload.limit,
    lastDistance: payload.lastDistance,
    nowDate: payload.nowDate,
    isRefresh: payload.isRefresh,
  }

  try {
    let promotions  = yield call(promCloud.fetchPromotionApi, apiPayload)
    let shopSet = new Set()
    let goodSet = new Set()
    promotions.forEach((promotion) => {
      let shop = promotion.targetShop
      let goods = promotion.targetGoods
      if(shop) {
        shopSet.add(shop)
      }
      if(goods) {
        goodSet.add(goods)
      }
    })
    if(shopSet.size > 0) {
      yield put(shopAction.batchSaveShopDetail({shopSet}))
    }
    if(goodSet.size > 0) {
      yield put(shopAction.batchSaveGoodsDetail({goodSet}))
    }
    yield put(updateNearbyPromListAction({ promotions: promotions, isRefresh: apiPayload.isRefresh }))
    if(payload.success) {
      payload.success(promotions)
    }
  } catch (error) {
    console.error(error)
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* createPayment(action) {
  let payload = action.payload

  let apiPayload = {
    amount: payload.amount,
    metadata: payload.metadata,
    subject: payload.subject,
  }
  try {
    let charge = yield call(promCloud.createPaymentRequest, apiPayload)
    if(charge && payload.success){
      payload.success(charge)
    }
  } catch (error) {
    console.error(error)
    if(payload.error) {
      payload.error(error)
    }
  }
}

export const saga = [
  takeLatest(FETCH_PROMOTION, fetchPromotion),
  takeLatest(CREATE_PAYMENT_REQUEST, createPayment),
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
  let promotions = action.payload.promotions
  let isRefresh = action.payload.isRefresh

  let nearbyPromList = List()
  if(!isRefresh) {
    nearbyPromList = state.get('nearbyPromList')
  }
  promotions.forEach((promotion) => {
    let promotionRecord = Promotion.fromJsonApi(promotion)
    state = state.setIn(['allPromotion', promotion.id], promotionRecord)
    nearbyPromList = nearbyPromList.push(promotion.id)
  })
  state = state.set('nearbyPromList', nearbyPromList)
  return state
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
function selectPromotion(state, promotionId) {
  if(!promotionId) {
    return undefined
  }
  let promotionRecord = state.PROMOTION.getIn(['allPromotion', promotionId])
  return promotionRecord? promotionRecord.toJS() : undefined
}

function selectNearbyPromotion(state) {
  let nearbyPromList = state.PROMOTION.get('nearbyPromList')
  let promotionInfoList = []
  nearbyPromList.toArray().forEach((promotionId) => {
    let promotionInfo = selectPromotion(state, promotionId)
    promotionInfo.goods = shopSelector.selectShopGoodsDetail(state, promotionInfo.targetGoodsId)
    promotionInfo.shop = shopSelector.selectShopDetail(state, promotionInfo.targetShopId)
    promotionInfoList.push(promotionInfo)
  })

  return promotionInfoList
}

export const selector = {
  selectPromotion,
  selectNearbyPromotion,
}