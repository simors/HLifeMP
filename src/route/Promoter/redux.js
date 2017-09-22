/**
 * Created by yangyang on 2017/9/22.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects'
import * as promoterCloud from './cloud'
import {authSelector} from '../../util/auth'

/****  Model  ****/

export const PromoterRecord = Record({
  id: undefined,
  userId: undefined,              // 对应的用户id
  phone: undefined,               // 联系手机号码
  upUser: undefined,              // 推荐人
  payment: undefined,             // 是否已完成支付，0表示未支付，1表示已支付
  shopEarnings: undefined,        // 邀请店铺收益
  royaltyEarnings: undefined,     // 团队提成收益
  inviteShopNum: undefined,       // 邀请的店铺数量
  teamMemNum: undefined,          // 团队成员的数量
  level: undefined,               // 推广员的级别，目前总共有5个级别，分别为1，2，3，4，5级，默认为1级
  liveProvince: undefined,        // 推广员生活的省份
  liveCity: undefined,            // 推广员生活的城市
  liveDistrict: undefined,        // 推广员生活的区县
  identity: undefined,            // 推广员身份，普通推广员为0，省级代理、市级代理、区县级代理分别为1，2，3，4
  province: undefined,            // 代理控制的省份
  city: undefined,                // 代理控制的城市
  district: undefined,            // 代理控制的区县
  street: undefined,              // 代理控制的街道或乡镇
  createdAt: undefined,
  updatedAt: undefined,
  qrcode: undefined,              // 公众号推广二维码
  level2Num: undefined,
  level3Num: undefined,
}, 'PromoterRecord')

export class PromoterInfo extends PromoterRecord {
  static fromLeancloudObject(lcObj) {
    let promoter = new PromoterInfo()
    promoter = promoter.withMutations((record) => {
      record.set('id', lcObj.objectId)
      record.set('userId', lcObj.user.id)
      record.set('phone', lcObj.phone)
      record.set('upUser', lcObj.upUser ? lcObj.upUser.id : undefined)
      record.set('payment', lcObj.payment)
      record.set('shopEarnings', lcObj.shopEarnings)
      record.set('royaltyEarnings', lcObj.royaltyEarnings)
      record.set('inviteShopNum', lcObj.inviteShopNum)
      record.set('teamMemNum', lcObj.teamMemNum)
      record.set('level', lcObj.level)
      record.set('liveProvince', lcObj.liveProvince)
      record.set('liveCity', lcObj.liveCity)
      record.set('liveDistrict', lcObj.liveDistrict)
      record.set('identity', lcObj.identity)
      record.set('province', lcObj.province)
      record.set('city', lcObj.city)
      record.set('district', lcObj.district)
      record.set('street', lcObj.street)
      record.set('createdAt', lcObj.createdAt)
      record.set('updatedAt', lcObj.updatedAt)
      record.set('qrcode', lcObj.qrcode)
      record.set('level2Num', lcObj.level2Num)
      record.set('level3Num', lcObj.level3Num)
    })
    return promoter
  }
}

export const Promoter = Record({
  activePromoter: undefined,        // 当前推广员id
  upPromoterId: undefined,          // 记录当前推广员的上级推广员id
  userToPromoter: Map(),            // 记录用户id与推广员id的对应关系
  promoters: Map(),                 // 推广员记录，键为推广员id，值为PromoterInfo
}, 'Promoter')

/**** Constant ****/

const GET_CURRENT_PROMOTER = 'GET_CURRENT_PROMOTER'
const UPDATE_PROMOTER_INFO = 'UPDATE_PROMOTER_INFO'
const UPDATE_BATCH_PROMOTER_INFO = 'UPDATE_BATCH_PROMOTER_INFO'
const SET_ACTIVE_PROMOTER = 'SET_ACTIVE_PROMOTER'
const SET_USER_PROMOTER_MAP = 'SET_USER_PROMOTER_MAP'
const SET_USER_PROMOTER_BATCH_MAP = 'SET_USER_PROMOTER_BATCH_MAP'
export const UPDATE_UPPROMOTER_ID = 'UPDATE_UPPROMOTER_ID'

/**** Action ****/

export const promoterAction = {
  getCurrentPromoter: createAction(GET_CURRENT_PROMOTER),
}

const setActivePromoter = createAction(SET_ACTIVE_PROMOTER)
const updatePromoter = createAction(UPDATE_PROMOTER_INFO)
const setUserPromoterMap = createAction(SET_USER_PROMOTER_MAP)

/**** Saga ****/

function* currentPromoterSaga(action) {
  let payload = action.payload
  try {
    let state = yield select()
    let userId = authSelector.activeUserId(state)
    let result = yield call(promoterCloud.fetchPromterByUser, {userId})
    if (result.errcode != 0) {
      if (payload.error) {
        payload.error(result.message)
      }
      return
    }
    let promoterId = result.promoter.objectId
    let promoter = PromoterInfo.fromLeancloudObject(result.promoter)
    console.log('promoter:', promoter)
    yield put(setActivePromoter({promoterId}))
    yield put(updatePromoter({promoterId, promoter}))
    yield put(setUserPromoterMap({userId, promoterId}))
  } catch (error) {
    console.log('fetch current promoter error:', error)
    yield put(setActivePromoter({promoterId: undefined}))
    if (payload.error) {
      payload.error(error)
    }
  }
}

export const promoterSaga = [
  takeLatest(GET_CURRENT_PROMOTER, currentPromoterSaga),
]

/**** Reducer ****/

const initialState = Promoter()

export function promoterReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ACTIVE_PROMOTER:
      return handleSetActivePromoter(state, action)
    case SET_USER_PROMOTER_MAP:
      return handleSetUserPromoterMap(state, action)
    case SET_USER_PROMOTER_BATCH_MAP:
      return handleSetUserPromoterBatchMap(state, action)
    case UPDATE_PROMOTER_INFO:
      return handleUpdatePromoter(state, action)
    case UPDATE_BATCH_PROMOTER_INFO:
      return handleUpdateBatchPromoters(state, action)
    case UPDATE_UPPROMOTER_ID:
      return handleUpdateUpPromoter(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSetActivePromoter(state, action) {
  let promoterId = action.payload.promoterId
  state = state.set('activePromoter', promoterId)
  return state
}

function handleSetUserPromoterMap(state, action) {
  let userId = action.payload.userId
  let promoterId = action.payload.promoterId
  state = state.setIn(['userToPromoter', userId], promoterId)
  return state
}

function handleSetUserPromoterBatchMap(state, action) {
  let payload = action.payload
  let userIds = payload.userIds
  let promoterIds = payload.promoterIds
  if (userIds.length != promoterIds.length) {
    return state
  }
  userIds.forEach((userId, index) => {
    state = state.setIn(['userToPromoter', userId], promoterIds[index])
  })
  return state
}

function handleUpdatePromoter(state, action) {
  let promoterId = action.payload.promoterId
  let promoter = action.payload.promoter
  state = state.setIn(['promoters', promoterId], promoter)
  return state
}

function handleUpdateBatchPromoters(state, action) {
  let promoters = action.payload.promoters
  promoters.forEach((promoter) => {
    let promoterId = promoter.id
    state = state.setIn(['promoters', promoterId], promoter)
  })
  return state
}

function handleUpdateUpPromoter(state, action) {
  let upPromoterId = action.payload.upPromoterId
  state = state.set('upPromoterId', upPromoterId)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.PROMOTER
  if (!incoming) return state

  if (incoming.activePromoter) {
    state = state.set('activePromoter', incoming.activePromoter)
  }

  if (incoming.upPromoterId) {
    state = state.set('upPromoterId', incoming.upPromoterId)
  }

  if (incoming.userToPromoter) {
    state = state.set('userToPromoter', new Map(incoming.userToPromoter))
  }

  let promoters = new Map(incoming.promoters)
  try {
    for (let [promoterId, promoter] of promoters) {
      if (promoterId && promoter) {
        let promoterInfo = new PromoterInfo({...promoter})
        state = state.setIn(['promoters', promoterId], promoterInfo)
      }
    }
  } catch (e) {
    promoters.clear()
  }

  return state
}

/**** Selector ****/

function activePromoter(state) {
  let activeId = state.PROMOTER.get('activePromoter')
  return activeId
}

function getPromoterById(state, id) {
  if (!id) {
    return undefined
  }
  let promoter = state.PROMOTER.getIn(['promoters', id])
  if (promoter) {
    return promoter.toJS()
  }
  return undefined
}

function selectPromoterByUserId(state, userId) {
  let promoterId = state.PROMOTER.getIn(['userToPromoter', userId])
  if (promoterId) {
    let promoter = getPromoterById(state, promoterId)
    return promoter
  }
  return undefined
}

function getUpPromoterId(state) {
  let upPromoterId = state.PROMOTER.get('upPromoterId')
  return upPromoterId
}

export const promoterSelector = {
  activePromoter,
  getPromoterById,
  selectPromoterByUserId,
  getUpPromoterId
}