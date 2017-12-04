/**
 * Created by wanpeng on 2017/12/4.
 */
import AV from 'leancloud-storage'

export async function fetchPromotionApi(payload) {
  return await AV.Cloud.run('fetchNearbyShopGoodPromotion', payload)
}