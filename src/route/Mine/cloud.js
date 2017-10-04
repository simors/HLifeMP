/**
 * Created by yangyang on 2017/10/4.
 */
import AV from 'leancloud-storage'

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