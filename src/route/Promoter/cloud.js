/**
 * Created by yangyang on 2017/9/22.
 */
import AV from 'leancloud-storage'

export function fetchPromterByUser(payload) {
  let userId = payload.userId
  let params = {
    userId,
  }
  return AV.Cloud.run('promoterFetchByUser', params).then((promoter) => {
    return promoter
  }, (err) => {
    throw err
  })
}

export function getUpPromoter(payload) {
  let params = {
    userId: payload.userId,
  }
  return AV.Cloud.run('promoterGetUpPromoter', params).then((promoterInfo) => {
    return promoterInfo
  }, (err) => {
    throw err
  })
}

export function getFriendsByLevel(payload) {
  let params = {
    userId: payload.level,
    limit: payload.limit,
    lastUpdatedAt: payload.lastUpdatedAt,
  }
  return AV.Cloud.run('promoterGetFriends', params).then((promoterInfo) => {
    return promoterInfo
  }, (err) => {
    throw err
  })
}