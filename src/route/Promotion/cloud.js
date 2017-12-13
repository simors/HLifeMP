/**
 * Created by wanpeng on 2017/12/4.
 */
import AV from 'leancloud-storage'

export async function fetchPromotionApi(payload) {
  let result = await AV.Cloud.run('goodsFetchNearbyGoodPromotion', payload)
  if(result.errcode === 0) {
    return result.promotions
  }
}

export async function createPaymentRequest(payload) {
  let result = await AV.Cloud.run('hLifeCreatePaymentV2', payload)
  if(result.errCode === 0) {
    return result.charge
  }
}