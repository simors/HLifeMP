/**
 * Created by yangyang on 2017/10/4.
 */
import AV from 'leancloud-storage'

function generateUUID(){
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
}

export function fetchUserPayment(payload) {
  let userId = payload.userId
  let params = {
    userId,
  }
  return AV.Cloud.run('hLifeGetPaymentInfoByUserId', params).then((payment) => {
    return payment
  }, (err) => {
    throw err
  })
}

export function createTransfer(payload) {
  var params = {
    channel: 'wx_pub',
    order_no: generateUUID().replace(/-/g, '').substr(0, 16),
    amount: payload.amount,
    openid: payload.openid,
    // openid: "oOg170xeHdU5TgOEpN1TWfGKihrg",
    metadata: {
      userId: payload.userId,
      nickname: payload.nickname
    },
  }
  AV.Cloud.run('hLifeCreateTransfers', params).then((result) => {
    return result
  }, (err) => {
    throw err
  })
}


export function getAddressList(payload) {
  let parmas = {
    isRefresh: payload.isRefresh,
    lastCreatedAt: payload.lastCreatedAt
  }
  return AV.Cloud.run('addrGetAddrs',parmas).then((result)=>{
    return result
  },(err)=>{
    throw  err
  })

}

export function createAddrApi(payload){
  let params = {
    username: payload.username,
    mobilePhoneNumber: payload.mobilePhoneNumber,
    province: payload.province,
    city: payload.city,
    district: payload.district,
    addr: payload.addr,
    tag: payload.tag
  }
  return AV.Cloud.run('addrCreateAddr', params).then((result)=>{

    return result
  },(err)=>{
    throw  err
  })
}


export function updateAddr(payload){
  let params = {
    addrId: payload.addrId,
    username: payload.username,
    mobilePhoneNumber: payload.mobilePhoneNumber,
    province: payload.province,
    city: payload.city,
    district: payload.district,
    addr: payload.addr,
    tag: payload.tag
  }

  return AV.Cloud.run('addrUpdateAddr', params).then((result)=>{
    return result
  },(err)=>{
    throw  err
  })
}

export function disableAddr(payload){
  let params = {
    addrId: payload.addrId
  }
  return AV.Cloud.run('addrDisableAddr', params).then((result)=>{
    return result
  },(err)=>{
    throw  err
  })
}

export function setDefaultAddr(payload){
  let params = {
    addrId: payload.addrId
  }

  return AV.Cloud.run('addrSetDefaultAddr', params).then((result)=>{
    return result
  },(err)=>{
    throw  err
  })
}


export function getUserOrders(payload) {
  let params = {
    buyerId: payload.buyerId,
    orderStatus: payload.orderStatus,
    lastTime: payload.lastTime,
    limit: payload.limit,
  }
  return AV.Cloud.run('orderQueryOrdersV2', params).then((result) => {
    console.log('result=============>',result)

    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function setOrderStatus(payload) {
  let params = {
    orderId: payload.orderId,
    orderStatus: payload.orderStatus,
  }
  return AV.Cloud.run('orderModifyStatus', params).then((result) => {
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}
