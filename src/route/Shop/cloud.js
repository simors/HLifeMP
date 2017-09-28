/**
 * Created by yangyang on 2017/9/27.
 */
import AV from 'leancloud-storage'

export function fetchShopGoodsDetail(payload) {
  let params = {
    goodsId: payload.goodsId,
  }
  return AV.Cloud.run('goodsFetchGoodsDetail', params).then((result) => {
    return result
  }, (err) => {
    throw err
  })
}