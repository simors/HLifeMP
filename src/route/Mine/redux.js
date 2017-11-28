/**
 * Created by yangyang on 2017/10/4.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects'
import * as mineCloud from './cloud'
import {shopAction,shopSelector,shopReducer} from '../Shop'
import {authAction,authReducer,authSelector} from '../../util/auth'

/****  Model  ****/

const PaymentRecord = Record({
  userId: undefined,
  balance: undefined,
  id_name: undefined,
  id_number: undefined,
  card_number: undefined,
  phone_number: undefined,
  password: undefined,
  alipay_account: undefined,
  open_id: undefined,
  open_bank_code: undefined,
  open_bank: undefined,
}, 'PaymentRecord')

class Payment extends PaymentRecord {
  static fromJsonApi(lcObj) {
    let payment = new PaymentRecord()
    payment = payment.withMutations((record) => {
      record.set('userId', lcObj.userId)
      record.set('balance', lcObj.balance)
      record.set('id_name', lcObj.id_name)
      record.set('id_number', lcObj.id_number)
      record.set('card_number', lcObj.card_number)
      record.set('phone_number', lcObj.phone_number)
      record.set('password', lcObj.password)
      record.set('alipay_account', lcObj.alipay_account)
      record.set('open_id', lcObj.open_id)
      record.set('open_bank_code', lcObj.open_bank_code)
      record.set('open_bank', lcObj.open_bank)
    })
    return payment
  }
}


export const AddrInfoRecord = Record({
  id: undefined,
  adminId: undefined,
  username: undefined,
  mobilePhoneNumber: undefined,
  province: undefined,
  city: undefined,
  district: undefined,
  addr: undefined,
  tag: undefined,
  createdAt: undefined,
  status: undefined,

}, 'AddrInfoRecord')

export class AddrInfo extends AddrInfoRecord {
  static fromApi(lcObj){
    let addrInfo = new AddrInfoRecord()
    addrInfo = addrInfo.withMutations((record)=>{
      record.set('id',lcObj.id)
      record.set('adminId',lcObj.adminId)
      record.set('username',lcObj.username)
      record.set('mobilePhoneNumber',lcObj.mobilePhoneNumber)
      record.set('province',lcObj.province)
      record.set('city',lcObj.city)
      record.set('district',lcObj.district)
      record.set('addr',lcObj.addr)
      record.set('tag',lcObj.tag)
      record.set('createdAt',lcObj.createdAt)
      record.set('status',lcObj.status)

    })
    return addrInfo
  }
}


export const ShopOrdersRecord = Record({
  id: undefined,
  buyerId: undefined,
  vendorId: undefined,
  goodsId: undefined,
  goodsAmount: undefined,
  paid: undefined,
  orderStatus: undefined,
  receiver: undefined,
  receiverAddr: undefined,
  receiverPhone: undefined,
  remark: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}, 'ShopOrdersRecord')

export class ShopOrders extends ShopOrdersRecord {
  static fromApi(lcObj) {
    let shopOrders = new ShopOrdersRecord()
    return shopOrders.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('buyerId', lcObj.buyerId)
      record.set('vendorId', lcObj.vendorId)
      record.set('goodsId', lcObj.goodsId)
      record.set('goodsAmount', lcObj.goodsAmount)
      record.set('paid', lcObj.paid)
      record.set('orderStatus', lcObj.orderStatus)
      record.set('receiver', lcObj.receiver)
      record.set('receiverAddr', lcObj.receiverAddr)
      record.set('receiverPhone', lcObj.receiverPhone)
      record.set('remark', lcObj.remark)
      record.set('createdAt', lcObj.createdAt)
      record.set('updatedAt', lcObj.updatedAt)
    })
  }
}



const MineInfo = Record({
  payment: undefined,
  allAddress: Map(),         //user address
  addressList: List(),      //user address.id list
  selectAddr: undefined,     // addrId
  orderDetail: Map(),       // 用户订单详情，键为订单id，值为订单详情
  userAllOrders: Map(),     // 用户全部订单，键为用户id，值为订单id组成的List
  userWaitOrders: Map(),    // 用户待收货订单，键为用户id，值为订单id组成的List
  userFinishOrders: Map(),  // 用户已完成订单，键为用户id，值为订单id组成的List
}, 'MineInfo')

/**** Constant ****/

const GET_PAYMENT_INFO = 'GET_PAYMENT_INFO'
const UPDATE_PAYMENT_INFO = 'UPDATE_PAYMENT_INFO'
const REQUEST_WITHDRAW = 'REQUEST_WITHDRAW'
const CREATE_MY_ADDR = 'CREATE_MY_ADDR'
const CREATE_MY_ADDR_SUCCESS = 'CREATE_MY_ADDR_SUCCESS'
const UPDATE_MY_ADDR = 'UPDATE_MY_ADDR'
const UPDATE_MY_ADDR_SUCCESS = 'UPDATE_MY_ADDR_SUCCESS'
const FETCH_ADDR_LIST = 'FETCH_ADDR_LIST'
const FETCH_ADDR_LIST_SUCCESS = 'FETCH_ADDR_LIST_SUCCESS'
const DISABLE_MY_ADDR = 'DISABLE_MY_ADDR'
const DISABLE_MY_ADDR_SUCCESS = 'DISABLE_MY_ADDR_SUCCESS'
const SET_DEFAULT_ADDR = 'SET_DEFAULT_ADDR'
const SET_DEFAULT_ADDR_SUCCESS = 'SET_DEFAULT_ADDR_SUCCESS'
const FETCH_USER_ORDERS_LIST = 'FETCH_USER_ORDERS_LIST'
const FETCH_USER_ORDERS_LIST_SUCCESS = 'FETCH_USER_ORDERS_LIST_SUCCESS'
const MOVE_USER_ORDER_TO_FINISH = 'MOVE_USER_ORDER_TO_FINISH'
const MOVE_USER_ORDER_TO_FINISH_SUCCESS = 'MOVE_USER_ORDER_TO_FINISH_SUCCESS'


/**** Action ****/

export const mineAction = {
  getPaymentInfo: createAction(GET_PAYMENT_INFO),
  withdrawRequest: createAction(REQUEST_WITHDRAW),
  createMyAddr: createAction(CREATE_MY_ADDR),
  updateMyAddr: createAction(UPDATE_MY_ADDR),
  fetchMyAddr: createAction(FETCH_ADDR_LIST),
  disableMyAddr: createAction(DISABLE_MY_ADDR),
  setDefaultAddr: createAction(SET_DEFAULT_ADDR),
  fetchUserOrderList: createAction(FETCH_ADDR_LIST),
  moveOrderToFinish: createAction(MOVE_USER_ORDER_TO_FINISH),
}

const updatePaymentAction = createAction(UPDATE_PAYMENT_INFO)
const createMyAddrSuccess = createAction(CREATE_MY_ADDR_SUCCESS)
const updateMyAddrSuccess = createAction(UPDATE_MY_ADDR_SUCCESS)
const fetchMyAddrSuccess = createAction(FETCH_ADDR_LIST_SUCCESS)
const disableMyAddrSuccess = createAction(DISABLE_MY_ADDR_SUCCESS)
const setDefaultAddrSuccess = createAction(SET_DEFAULT_ADDR_SUCCESS)
const fetchUserOrderListSuccess = createAction(FETCH_USER_ORDERS_LIST_SUCCESS)
const moveOrderToFinishSuccess = createAction(MOVE_USER_ORDER_TO_FINISH_SUCCESS)

/**** Saga ****/

function* paymentInfoSaga(action) {
  let payload = action.payload
  try {
    let payment = yield call(mineCloud.fetchUserPayment, {userId: payload.userId})
    yield put(updatePaymentAction({payment}))
  } catch (error) {
    console.log('error in get payment', error)
    if (payload.error) {
      payload.error(error)
    }
  }
}

function* reqWithdrawSaga(action) {
  let payload = action.payload
  try {
    let result = yield call(mineCloud.createTransfer, {...payload})
    if (!result) {
      if (payload.success) {
        payload.success()
      }
      return
    }
    if (result.errcode == 1) {
      if (payload.error) {
        payload.error(error)
      }
    } else {
      if (payload.success) {
        payload.success()
      }
    }
  } catch (error) {
    console.log('error in get payment', error)
    if (payload.error) {
      payload.error(error)
    }
  }
}

export const mineSaga = [
  takeLatest(GET_PAYMENT_INFO, paymentInfoSaga),
  takeLatest(REQUEST_WITHDRAW, reqWithdrawSaga),
]

/**** Reducer ****/

const initialState = MineInfo()

export function mineReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PAYMENT_INFO:
      return updatePayment(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function updatePayment(state, action) {
  let payload = action.payload
  let payment = payload.payment
  let paymentRec = Payment.fromJsonApi(payment)
  state = state.set('payment', paymentRec)
  return state
}


function handleSetUserShopOrders(state, action) {
  let payload = action.payload
  let buyerId = payload.buyerId
  let type = payload.type
  let shopOrdersList = payload.shopOrdersList
  if ('all' == type) {
    state = state.setIn(['userAllOrders', buyerId], new List(shopOrdersList))
  } else if ('waiting' == type) {
    state = state.setIn(['userWaitOrders', buyerId], new List(shopOrdersList))
  } else if ('finished' == type) {
    state = state.setIn(['userFinishOrders', buyerId], new List(shopOrdersList))
  }
  return state
}

function handleAddUserShopOrders(state, action) {
  let payload = action.payload
  let buyerId = payload.buyerId
  let type = payload.type
  let shopOrdersList = payload.shopOrdersList
  let oldOrderList = new List()
  if ('all' == type) {
    oldOrderList = state.getIn(['userAllOrders', buyerId])
    if (!oldOrderList) {
      oldOrderList = new List()
    }
    state = state.setIn(['userAllOrders', buyerId], oldOrderList.concat(new List(shopOrdersList)))
  } else if ('waiting' == type) {
    oldOrderList = state.getIn(['userWaitOrders', buyerId])
    if (!oldOrderList) {
      oldOrderList = new List()
    }
    state = state.setIn(['userWaitOrders', buyerId], oldOrderList.concat(new List(shopOrdersList)))
  } else if ('finished' == type) {
    oldOrderList = state.getIn(['userFinishOrders', buyerId])
    if (!oldOrderList) {
      oldOrderList = new List()
    }
    state = state.setIn(['userFinishOrders', buyerId], oldOrderList.concat(new List(shopOrdersList)))
  }
  return state
}

function handleBatchAddOrdersDetail(state, action) {
  let orders = action.payload.shopOrders
  orders.forEach((order) => {
    state = state.setIn(['orderDetail', order.id], order)
  })
  return state
}

function handleMoveUserOrderToFinish(state, action) {
  let payload = action.payload
  let orderId = payload.orderId
  let buyerId = payload.buyerId
  let waitList = state.getIn(['userWaitOrders', buyerId])
  if (!waitList) {
    return state
  }
  waitList = waitList.filter((item) => (item != orderId))
  state = state.setIn(['userWaitOrders', buyerId], waitList)
  let finishList = state.getIn(['userFinishOrders', buyerId])
  if (!finishList) {
    finishList = new List()
  }
  finishList = finishList.insert(0, orderId)
  state = state.setIn(['userFinishOrders', buyerId], finishList)
  return state
}


function onRehydrate(state, action) {
  var incoming = action.payload.MINE
  if (!incoming) return state

  return state
}


/**** Selector ****/

function selectPayment(state) {
  let paymentRec = state.MINE.payment
  if (!paymentRec) {
    return undefined
  }
  return paymentRec.toJS()
}


export function selectUserOrders(state, buyerId, type) {
  let orderIds = []
  if ('all' == type) {
    orderIds = state.SHOP.getIn(['userAllOrders', buyerId]) || []
  } else if ('waiting' == type) {
    orderIds = state.SHOP.getIn(['userWaitOrders', buyerId]) || []
  } else if ('finished' == type) {
    orderIds = state.SHOP.getIn(['userFinishOrders', buyerId]) || []
  }
  let userOrders = constructOrderList(state, orderIds)
  return userOrders
}

function constructOrderList(state, orderIds) {
  let userOrders = []
  orderIds.forEach((orderId) => {
    let orderRec = state.SHOP.getIn(['orderDetail', orderId])
    if (orderRec) {
      let order = orderRec.toJS()
      let vendorId = order.vendorId
      let vendor = shopSelector.selectShopDetail(state, vendorId)
      let buyer = authSelector.activeUserInfo(state).toJS()
      let goodsId = order.goodsId
      let goods = shopSelector.selectShopGoodsDetail(state, goodsId)
      userOrders.push({
        ...order,
        buyer,
        vendor,
        goods,
      })
    }
  })
  return userOrders
}

export function selectOrderDetail(state, orderId) {
  let orderRec = state.SHOP.getIn(['orderDetail', orderId])
  if (!orderRec) {
    return undefined
  }
  let order = orderRec.toJS()
  let vendorId = order.vendorId
  let vendor = shopSelector.selectShopDetail(state, vendorId)
  let buyer = authSelector.activeUserInfo(state).toJS()
  let goodsId = order.goodsId
  let goods = shopSelector.selectShopGoodsDetail(state, goodsId)
  return {
    ...order,
    buyer,
    vendor,
    goods,
  }
}

export const mineSelector = {
  selectPayment,
  selectUserOrders,
  selectOrderDetail
}