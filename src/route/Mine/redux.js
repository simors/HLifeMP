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

const MineInfo = Record({
  payment: undefined,
}, 'MineInfo')

/**** Constant ****/

const GET_PAYMENT_INFO = 'GET_PAYMENT_INFO'
const UPDATE_PAYMENT_INFO = 'UPDATE_PAYMENT_INFO'

/**** Action ****/

export const mineAction = {
  getPaymentInfo: createAction(GET_PAYMENT_INFO),
}

const updatePaymentAction = createAction(UPDATE_PAYMENT_INFO)

/**** Saga ****/

function* paymentInfoSaga(action) {
  let payload = action.payload
  try {
    let payment = yield call(mineCloud.fetchUserPayment, {userId: payload.userId})
    console.log('payment:', payment)
    yield put(updatePaymentAction({payment}))
  } catch (error) {
    console.log('error in get payment', error)
    if (payload.error) {
      payload.error(error)
    }
  }
}

export const mineSaga = [
  takeLatest(GET_PAYMENT_INFO, paymentInfoSaga),
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