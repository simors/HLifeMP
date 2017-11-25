/**
 * Created by yangyang on 2017/10/4.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects'
import * as mineCloud from './cloud'

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
      record.set('buyerId', lcObj.buyer.id)
      record.set('vendorId', lcObj.vendor.id)
      record.set('goodsId', lcObj.goods.id)
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
}, 'MineInfo')

/**** Constant ****/

const GET_PAYMENT_INFO = 'GET_PAYMENT_INFO'
const UPDATE_PAYMENT_INFO = 'UPDATE_PAYMENT_INFO'
const REQUEST_WITHDRAW = 'REQUEST_WITHDRAW'

/**** Action ****/

export const mineAction = {
  getPaymentInfo: createAction(GET_PAYMENT_INFO),
  withdrawRequest: createAction(REQUEST_WITHDRAW),
}

const updatePaymentAction = createAction(UPDATE_PAYMENT_INFO)

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

export const mineSelector = {
  selectPayment,
}