/**
 * Created by yangyang on 2017/10/4.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import {call, put, takeEvery, takeLatest, select} from 'redux-saga/effects'
import * as mineCloud from './cloud'
import {shopAction, shopSelector, shopReducer} from '../Shop'
import {authAction, authReducer, authSelector} from '../../util/auth'


// 订单状态定义
const ORDER_STATUS = {
  PAID_FINISHED: 1, // 已支付
  DELIVER_GOODS: 2, // 已发货
  ACCOMPLISH: 3,    // 已完成
  DELETED: 4,       // 已删除
}

const ADDR_STATUS = {
  DEFAUT_ADDR: 1, // 默认地址
  ENABLE_ADDR: 2, // 可选地址
  DISABLE_ADDR: 0,    // 被删除地址
}

export const mineConfig = {
  ORDER_STATUS: ORDER_STATUS,
  ADDR_STATUS: ADDR_STATUS
}
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
  static fromApi(lcObj) {
    let addrInfo = new AddrInfoRecord()
    addrInfo = addrInfo.withMutations((record)=> {
      record.set('id', lcObj.id)
      record.set('adminId', lcObj.adminId)
      record.set('username', lcObj.username)
      record.set('mobilePhoneNumber', lcObj.mobilePhoneNumber)
      record.set('province', lcObj.province)
      record.set('city', lcObj.city)
      record.set('district', lcObj.district)
      record.set('addr', lcObj.addr)
      record.set('tag', lcObj.tag)
      record.set('createdAt', lcObj.createdAt)
      record.set('status', lcObj.status)

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
const FETCH_SET_USER_ORDERS_LIST = 'FETCH_SET_USER_ORDERS_LIST'
const FETCH_SET_USER_ORDERS_LIST_SUCCESS = 'FETCH_SET_USER_ORDERS_LIST_SUCCESS'
const FETCH_ADD_USER_ORDERS_LIST = 'FETCH_ADD_USER_ORDERS_LIST'
const FETCH_ADD_USER_ORDERS_LIST_SUCCESS = 'FETCH_ADD_USER_ORDERS_LIST_SUCCESS'
const BATCH_SAVE_USER_ORDERS = 'BATCH_SAVE_USER_ORDERS'
const SET_USER_ORDER_STATUS = 'SET_USER_ORDER_STATUS'
const SET_USER_ORDER_STATUS_SUCCESS = 'SET_USER_ORDER_STATUS_SUCCESS'
const MOVE_USER_ORDER_TO_FINISH = 'MOVE_USER_ORDER_TO_FINISH'
const DELETE_USER_ORDER = 'DELETE_USER_ORDER'


/**** Action ****/

export const mineAction = {
  getPaymentInfo: createAction(GET_PAYMENT_INFO),
  withdrawRequest: createAction(REQUEST_WITHDRAW),
  createMyAddr: createAction(CREATE_MY_ADDR),
  updateMyAddr: createAction(UPDATE_MY_ADDR),
  fetchMyAddr: createAction(FETCH_ADDR_LIST),
  disableMyAddr: createAction(DISABLE_MY_ADDR),
  setDefaultAddr: createAction(SET_DEFAULT_ADDR),
  fetchUserOrderList: createAction(FETCH_SET_USER_ORDERS_LIST),
  setUserOrderStatus: createAction(SET_USER_ORDER_STATUS),
  saveUserOrders: createAction(BATCH_SAVE_USER_ORDERS)
}

const updatePaymentAction = createAction(UPDATE_PAYMENT_INFO)
const createMyAddrSuccess = createAction(CREATE_MY_ADDR_SUCCESS)
const updateMyAddrSuccess = createAction(UPDATE_MY_ADDR_SUCCESS)
const fetchMyAddrSuccess = createAction(FETCH_ADDR_LIST_SUCCESS)
const disableMyAddrSuccess = createAction(DISABLE_MY_ADDR_SUCCESS)
const setDefaultAddrSuccess = createAction(SET_DEFAULT_ADDR_SUCCESS)
const fetchSetUserOrderListSuccess = createAction(FETCH_SET_USER_ORDERS_LIST_SUCCESS)
const fetchAddUserOrderListSuccess = createAction(FETCH_ADD_USER_ORDERS_LIST_SUCCESS)
const setUserOrderStatusSuccess = createAction(SET_USER_ORDER_STATUS_SUCCESS)
const moveOrderToFin = createAction(MOVE_USER_ORDER_TO_FINISH)
const deleteUserOrder = createAction(DELETE_USER_ORDER)

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

function* createUserAddrSaga (action) {
  let payload = action.payload
  try{
    let result = yield call(mineCloud.createAddrApi, {...payload})
    if(result){
      yield put (createMyAddrSuccess({address:result}))
      if(payload.success){
        payload.success()
      }
    }
  }catch (err){
    if(payload.error){
      payload.error(err)
    }
  }
}

function* updateUserAddrSaga (action) {
  let payload = action.payload
  try{
    let result = yield call(mineCloud.updateAddr, {...payload})
    if(result){
      yield put (updateMyAddrSuccess({address:result}))
      if(payload.success){
        payload.success()
      }
    }
  }catch (err){
    if(payload.error){
      payload.error(err)
    }
  }
}

function* getAddrListSaga(action){
  let payload = action.payload
  try{
    let result = yield call(mineCloud.getAddressList, {...payload})
    if(result && result.length>0){
      let params = {
        address: result,
        isRefresh: payload.isRefresh
      }
      yield put(fetchMyAddrSuccess(params))
    }
  }catch(err){
    if(payload.error){
      payload.error(err)
    }
  }
}

function* disableAddrSaga(action){
  let payload = action.payload
  try{
      yield call(mineCloud.disableAddr, {...payload})
      let params = {
        addrId: payload.addrId
      }
      yield put(disableMyAddrSuccess(params))
      if(payload.success){
        payload.success()
      }
  }catch(err){
    if(payload.error){
      payload.error(err)
    }
  }
}

function* setDefaultAddrSaga(action){
  let payload = action.payload
  try{
    let result = yield call(mineCloud.setDefaultAddr, {...payload})
    if(payload.success){
      payload.success()
    }
  }catch(err){
    if(payload.error){
      payload.error(err)
    }
  }
}

function* getUserOrderListSaga(action){
  let payload = action.payload
  let queryType = payload.type
  if (queryType == 'all') {
    payload.orderStatus = [mineConfig.ORDER_STATUS.PAID_FINISHED, mineConfig.ORDER_STATUS.DELIVER_GOODS, mineConfig.ORDER_STATUS.ACCOMPLISH]
  } else if (queryType == 'waiting') {
    payload.orderStatus = [mineConfig.ORDER_STATUS.PAID_FINISHED, mineConfig.ORDER_STATUS.DELIVER_GOODS]
  } else if (queryType == 'finished') {
    payload.orderStatus = [mineConfig.ORDER_STATUS.ACCOMPLISH]
  }
  try{
    let results = yield call(mineCloud.getUserOrders, {...payload})
    let shopOrders = []
    let vendors = []
    let goods = []
    let shopOrderList = []
    let orders = results.shopOrders
    if(orders&&orders.length>0){
      orders.forEach((order) => {
        shopOrderList.push(order.id)
        shopOrders.push(order)
        vendors.push(order.vendor)
        goods.push(order.goods)
      })
    }

    yield put(shopAction.updateBatchShop({shopList:vendors}))
    yield put(shopAction.updateBatchShopGoods({goodsList:goods}))
    yield put(mineAction.saveUserOrders({shopOrders:shopOrders}))
    if(payload.isRefresh){
      yield put(fetchSetUserOrderListSuccess({shopOrderList:shopOrderList,type: payload.type,buyerId: payload.buyerId}))
    }else{
      yield put(fetchAddUserOrderListSuccess({shopOrderList:shopOrderList,type: payload.type,buyerId: payload.buyerId}))
    }
    if(payload.success){
      payload.success()
    }
  }catch(err){
    if(payload.error){
      payload.error(err)
    }
  }
}

function* updateUserOrderStatusSaga (action) {
  let payload = action.payload
  try{
    let results = yield call(mineCloud.setOrderStatus, {...payload})
    console.log('results====>',results)

    if(results.errcode != 0){
      console.log('here is run error====>')

      if(payload.error){
        payload.error(results)
      }
    }else{
      console.log('here is run win====>')

      yield put(setUserOrderStatusSuccess({orderId: payload.orderId,status: payload.orderStatus, buyerId: payload.buyerId}))
      console.log('here is run win====>')
      if(payload.success){
        payload.success()
      }
    }
  }catch(err){
    console.log('here is run error weeoe oeoeoeq oqoeoqeo====>')
    if(payload.error){
      payload.error(err)
    }
  }
}

export const mineSaga = [
  takeLatest(GET_PAYMENT_INFO, paymentInfoSaga),
  takeLatest(REQUEST_WITHDRAW, reqWithdrawSaga),
  takeLatest(CREATE_MY_ADDR, createUserAddrSaga),
  takeLatest(UPDATE_MY_ADDR, updateUserAddrSaga),
  takeLatest(FETCH_ADDR_LIST, getAddrListSaga),
  takeLatest(DISABLE_MY_ADDR, disableAddrSaga),
  takeLatest(SET_DEFAULT_ADDR, setDefaultAddrSaga),
  takeLatest(SET_USER_ORDER_STATUS, updateUserOrderStatusSaga),
  takeEvery(FETCH_SET_USER_ORDERS_LIST, getUserOrderListSaga),
  takeEvery(FETCH_ADD_USER_ORDERS_LIST, getUserOrderListSaga),


]

/**** Reducer ****/

const initialState = MineInfo()

export function mineReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PAYMENT_INFO:
      return updatePayment(state, action)
    case FETCH_ADDR_LIST_SUCCESS:
      return handleFetchAddressList(state, action)
    case CREATE_MY_ADDR_SUCCESS:
      return handleCreateAddress(state, action)
    case UPDATE_MY_ADDR_SUCCESS:
      return handleUpdateAddress(state, action)
    case DISABLE_MY_ADDR_SUCCESS:
      return handleDisableAddress(state, action)
    case FETCH_SET_USER_ORDERS_LIST_SUCCESS:
      return handleSetUserShopOrders(state, action)
    case FETCH_ADD_USER_ORDERS_LIST_SUCCESS:
      return handleAddUserShopOrders(state, action)
    case BATCH_SAVE_USER_ORDERS:
      return handleBatchAddOrdersDetail(state, action)
    case SET_USER_ORDER_STATUS_SUCCESS:
      return handleUpdateShopOrderStatus(state, action)
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
  let shopOrderList = payload.shopOrderList
  console.log('payload======>',payload)
  if ('all' == type) {
    state = state.setIn(['userAllOrders', buyerId], new List(shopOrderList))
  } else if ('waiting' == type) {
    state = state.setIn(['userWaitOrders', buyerId], new List(shopOrderList))
  } else if ('finished' == type) {
    state = state.setIn(['userFinishOrders', buyerId], new List(shopOrderList))
  }
  return state
}

function handleUpdateShopOrderStatus(state, action) {
  let payload = action.payload
  console.log('payload======>',payload)
  let status = payload.status
  let orderId = payload.orderId
  let order = state.getIn(['orderDetail', orderId])
  if (!order) {
    return state
  }
  order = order.set('orderStatus', status)
  state = state.setIn(['orderDetail', orderId], order)
  if (status == mineConfig.ORDER_STATUS.ACCOMPLISH) {
    state = handleMoveUserOrderToFinish(state,{orderId: payload.orderId, buyerId: payload.buyerId})
  } else if (status == mineConfig.ORDER_STATUS.DELETED) {
    handleDeleteUserOrder(state,{orderId: payload.orderId, buyerId: payload.buyerId})
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
  if(orders&&orders.length>0){
    orders.forEach((order) => {
      state = state.setIn(['orderDetail', order.id], ShopOrders.fromApi(order))
    })
  }

  return state
}

function handleMoveUserOrderToFinish(state, params) {
  let orderId = params.orderId
  let buyerId = params.buyerId
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

function handleDeleteUserOrder(state, params) {
  let orderId = params.orderId
  let buyerId = params.buyerId
  let finishOrderList = state.getIn(['userFinishOrders', buyerId])
  if (!finishOrderList) {
    return state
  }
  finishOrderList = finishOrderList.filter((item) => (item != orderId))
  state = state.setIn(['userFinishOrders', buyerId], finishOrderList)

  let allOrderList = state.getIn(['userAllOrders', buyerId])
  if (!allOrderList) {
    return state
  }
  allOrderList = allOrderList.filter((item) => (item != orderId))
  state = state.setIn(['userAllOrders', buyerId], allOrderList)
  return state
}

function handleFetchAddressList(state, action) {
  let addressList = []
  let {address, isRefresh} = action.payload
  if (address && address.length > 0) {
    address.forEach((item)=> {
      addressList.push(item.id)
      state = state.setIn(['allAddress', item.id], AddrInfo.fromApi(item))
    })
  }
  if (!isRefresh) {
    let oldAddrList = state.get('addressList')
    let newAddrList = oldAddrList.concat(new List(addressList))
    state = state.set('addressList', newAddrList)
  } else {
    state = state.set('addressList', List(addressList))
  }
  return state
}

function handleCreateAddress(state, action) {
  let {address} = action.payload
  let oldAddrList = state.get('addressList').toJS() || []
  oldAddrList.splice(0, 0, address.id)
  state = state.set('addressList', new List(oldAddrList))
  state = state.setIn(['allAddress', address.id], AddrInfo.fromApi(address))
  return state
}

function handleUpdateAddress(state, action) {
  let {address} = action.payload
  state = state.setIn(['allAddress', address.id], AddrInfo.fromApi(address))
  return state
}

function handleDisableAddress(state, action) {
  let {addrId} = action.payload
  let oldAddrList = state.get('addressList').toArray() || []
  if (oldAddrList && oldAddrList.length > 0) {
    for (let i = 0; i < oldAddrList.length - 1; i++) {
      if (oldAddrList[i] == addrId) {
        oldAddrList.splice(i, 1)
      }
    }
  }
  state = state.set('addressList', new List(oldAddrList))
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
    orderIds = state.MINE.getIn(['userAllOrders', buyerId]) || []
  } else if ('waiting' == type) {
    orderIds = state.MINE.getIn(['userWaitOrders', buyerId]) || []
  } else if ('finished' == type) {
    orderIds = state.MINE.getIn(['userFinishOrders', buyerId]) || []
  }
  let userOrders = constructOrderList(state, orderIds)
  return userOrders
}

function constructOrderList(state, orderIds) {
  let userOrders = []
  orderIds.forEach((orderId) => {
    let orderRec = state.MINE.getIn(['orderDetail', orderId])
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

function selectOrderDetail(state, orderId) {
  let orderRec = state.MINE.getIn(['orderDetail', orderId])
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

//获取地址列表
function getUserAddressList(state) {
  let addressList = state.MINE.get('addressList')
  let addressDetailList = []
  if (addressList && addressList.size > 0) {
    addressList.forEach((item)=> {
      let address = state.MINE.getIn(['allAddress', item])
      if (address) {
        addressDetailList.push(address.toJS())
      }
    })
  }
  return addressDetailList
}

//获取地址
function getUserAddress(state, addrId) {
  if(!addrId) {
    return undefined
  }
  let address = state.MINE.getIn(['allAddress', addrId])
  return address? address.toJS(): undefined
}

//获取默认地址
function getDefaultAddress(state) {
  let addressList = state.MINE.get('addressList')
  let defaultAddr = {}
  if (addressList && addressList.size > 0) {
    addressList.forEach((item)=> {
      let address = state.MINE.getIn(['allAddress', item])
      if (address) {
        if(address.status==mineConfig.ADDR_STATUS.DEFAUT_ADDR){
          defaultAddr=address.toJS()
        }
      }
    })
  }
  return defaultAddr
}

export const mineSelector = {
  selectPayment,
  selectUserOrders,
  selectOrderDetail,
  getUserAddressList,
  getUserAddress,
  getDefaultAddress
}