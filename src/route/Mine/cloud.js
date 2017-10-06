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