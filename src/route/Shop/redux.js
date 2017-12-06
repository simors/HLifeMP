/**
 * Created by yangyang on 2017/9/27.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as shopCloud from './cloud'
import {appStateSelector} from '../../util/appstate'
import {store} from '../../store/persistStore'
import {authAction, authSelector} from '../../util/auth'

/****  Model  ****/

const ShopTagRecord = Record({
  id: undefined,
  name: undefined,
  status: undefined,
  upCategoryId: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}, 'ShopTag')

class ShopTag extends ShopTagRecord {
  static fromJsonApi(lcObj) {
    try {
      let shopTag = new ShopTagRecord()
      return shopTag.withMutations((record) => {
        record.set('id', lcObj.id)
        record.set('name', lcObj.name)
        record.set('status', lcObj.status)
        record.set('upCategoryId', lcObj.upCategoryId)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

const ShopCategoryRecord = Record({
  id: undefined,
  imageSource: undefined,
  shopCategoryId: undefined,
  status: undefined,
  text: undefined,
  displaySort: undefined,
  textColor: undefined,
  describe: undefined,
  shopPictureSource: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}, 'ShopCategory')

class ShopCategory extends ShopCategoryRecord {
  static fromJsonApi(lcObj) {
    try {
      let shopTag = new ShopCategoryRecord()
      return shopTag.withMutations((record) => {
        record.set('id', lcObj.id)
        record.set('imageSource', lcObj.imageSource)
        record.set('shopCategoryId', lcObj.shopCategoryId)
        record.set('status', lcObj.status)
        record.set('text', lcObj.text)
        record.set('displaySort', lcObj.displaySort)
        record.set('textColor', lcObj.textColor)
        record.set('describe', lcObj.describe)
        record.set('shopPictureSource', lcObj.shopPictureSource)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

const ShopRecord = Record({
  id: undefined,
  name: undefined,                      // 店主姓名
  phone: undefined,                     // 店主电话
  shopName: undefined,                  // 店铺名称
  shopAddress: undefined,               // 店铺地址
  coverUrl: undefined,                  // 店铺封面图片地址
  contactNumber: undefined,             // 店铺联系电话（客服电话）
  contactNumber2: undefined,            // 店铺联系电话（备用电话）
  certification: '',
  targetShopCategoryId: undefined,      // 店铺所属分类信息Id
  geo: [],                              // 店铺地理坐标
  geoCity: undefined,                   // 店铺地理坐标对应城市名
  geoDistrict: '',                      // 店铺地理坐标对应区名
  geoProvince: undefined,
  geoProvinceCode: undefined,
  geoCityCode: undefined,
  geoDistrictCode: undefined,
  distance: undefined,                  // 用户与店铺的距离
  distanceUnit: 'km',                   // 用户与店铺的距离单位
  geoName: undefined,                   // 店铺地理坐标对应城市区域名称
  pv: 0,                                // 店铺点击量
  score: 4.5,                           // 店铺评分
  ourSpecial: '',                       // 本店特色
  openTime: '',                         // 营业时间
  album: List(),                        // 店铺相册
  ownerId: undefined,                   // 店铺拥有者信息id
  inviterId: undefined,                 // 邀请注册店铺的用户id
  containedTag: List(),                 // 店铺拥有的标签id列表
  status: -1,                           // 0-后台关闭； 1-正常； 2-店主自己关闭
  payment: 0,                           // 记录店铺注册后是否已完成支付流程，0表示未支付，1表示已支付
  tenant: 0,                            // 记录店铺注册时缴纳的入驻费,
  commentNum: 0,
  followerNum: 0,
  isOpen: undefined,
  grade: undefined,
  createdAt: undefined,                 // 创建时间戳
  updatedAt: undefined,                 // 更新时间戳
}, 'ShopRecord')

class ShopInfo extends ShopRecord {
  static fromJsonApi(lcObj) {
    try {
      let shopRecord = new ShopRecord()
      return shopRecord.withMutations((record) => {
        record.set('id', lcObj.id)
        record.set('name', lcObj.name)
        record.set('phone', lcObj.phone)
        record.set('shopName', lcObj.shopName)
        record.set('shopAddress', lcObj.shopAddress)
        record.set('coverUrl', lcObj.coverUrl)
        record.set('contactNumber', lcObj.contactNumber)
        record.set('contactNumber2', lcObj.contactNumber2)
        record.set('certification', lcObj.certification)
        record.set('status', lcObj.status && parseInt(lcObj.status))
        record.set('targetShopCategoryId', lcObj.targetShopCategoryId)
        record.set('ownerId', lcObj.ownerId)
        record.set('inviterId', lcObj.inviterId)

        let containedTag = []
        if (lcObj.containedTag && lcObj.containedTag.length) {
          lcObj.containedTag.forEach((containedTagAttrs)=> {
            containedTag.push(containedTagAttrs.id)
          })
        }
        record.set('containedTag', new List(containedTag))

        record.set('geo', lcObj.geo)
        let userCurGeo = appStateSelector.getGeopoint(store.getState())
        if (lcObj.geo && userCurGeo) {
          let curGeoPoint = new AV.GeoPoint(userCurGeo)
          let geo = new AV.GeoPoint(lcObj.geo)
          let distance = geo.kilometersTo(curGeoPoint)
          let distanceUnit = 'km'
          if (distance > 1) {
            distance = Number(distance).toFixed(1)
          } else {
            distance = Number(distance * 1000).toFixed(0)
            distanceUnit = 'm'
          }
          record.set('distance', distance)
          record.set('distanceUnit', distanceUnit)
        }

        record.set('geoName', lcObj.geoName)
        record.set('geoCity', lcObj.geoCity)
        record.set('geoDistrict', lcObj.geoDistrict)
        record.set('geoDistrictCode', lcObj.geoDistrictCode)
        record.set('geoCityCode', lcObj.geoCityCode)
        record.set('geoProvince', lcObj.geoProvince)
        record.set('geoProvinceCode', lcObj.geoProvinceCode)
        record.set('pv', lcObj.pv)
        record.set('score', lcObj.score)
        record.set('ourSpecial', lcObj.ourSpecial)
        record.set('openTime', lcObj.openTime)
        record.set('album', new List(lcObj.album))
        record.set('payment', lcObj.payment)
        record.set('tenant', lcObj.tenant)
        record.set('commentNum', lcObj.commentNum)
        record.set('followerNum', lcObj.followerNum)
        record.set('isOpen', lcObj.isOpen)
        record.set('grade', lcObj.grade)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

const ShopPromotionRecord = Record({
  id: undefined,
  promotionPrice: undefined,
  targetGoodsId: undefined,
  targetShopId: undefined,
  startDate: undefined,
  endDate: undefined,
  abstract: undefined,
  status: undefined,
  type: undefined,
  typeId: undefined,
  geo: undefined,
  createdAt: undefined,                 // 创建时间戳
  updatedAt: undefined,                 // 更新时间戳
}, 'ShopPromotion')

class ShopPromotion extends ShopPromotionRecord {
  static fromJsonApi(lcObj) {
    try {
      let shopTag = new ShopPromotionRecord()
      return shopTag.withMutations((record) => {
        record.set('id', lcObj.id)
        record.set('promotionPrice', lcObj.promotionPrice)
        record.set('targetGoodsId', lcObj.targetGoodsId)
        record.set('targetShopId', lcObj.targetShopId)
        record.set('startDate', lcObj.startDate)
        record.set('endDate', lcObj.endDate)
        record.set('abstract', lcObj.abstract)
        record.set('status', lcObj.status)
        record.set('type', lcObj.type)
        record.set('typeId', lcObj.typeId)
        record.set('geo', lcObj.geo)
        record.set('createdAt', lcObj.createdAt)
        record.set('updatedAt', lcObj.updatedAt)
      })
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

const ShopGoodsRecord = Record({
  id: undefined,
  goodsName: undefined,
  targetShopId: undefined,
  goodsPromotionId: undefined,
  price: undefined,
  originalPrice: undefined,
  coverPhoto: undefined,
  album: undefined,
  status: undefined,
  detail: undefined,
  createdAt: undefined,                 // 创建时间戳
  updatedAt: undefined,                 // 更新时间戳
})

class ShopGoods extends ShopGoodsRecord {
  static fromJsonApi(lcObj) {
    let shopGoods = new ShopGoods()
    return shopGoods.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('goodsName', lcObj.goodsName)
      record.set('targetShopId', lcObj.targetShopId)
      record.set('goodsPromotionId', lcObj.goodsPromotionId)
      record.set('price', lcObj.price)
      record.set('originalPrice', lcObj.originalPrice)
      record.set('coverPhoto', lcObj.coverPhoto)
      record.set('album', new List(lcObj.album))
      record.set('status', lcObj.status)
      record.set('detail', lcObj.detail)
      record.set('createdAt', lcObj.createdAt)
      record.set('updatedAt', lcObj.updatedAt)
    })
  }
}

const Shop = Record({
  shopTagSet: Map(),
  shopCategorySet: Map(),
  shopDetails: Map(),
  shopGoodsDetail: Map(),   // 店铺商品详细，键为商品id，值为店铺详细信息
  shopPromotion: Map(),
}, 'Shop')

/**** Constant ****/

const GET_SHOP_GOODS_DETAIL = 'GET_SHOP_GOODS_DETAIL'
const UPDATE_SHOP_GOODS = 'UPDATE_SHOP_GOODS'
const UPDATE_SHOP_DETAIL = 'UPDATE_SHOP_DETAIL'
const BATCH_SAVE_SHOP_DETAIL = 'BATCH_SAVE_SHOP_DETAIL'
const BATCH_SAVE_GOODS_DETAIL = 'BATCH_SAVE_GOODS_DETAIL'

/**** Action ****/

export const shopAction = {
  getShopGoodsDetail: createAction(GET_SHOP_GOODS_DETAIL),
  batchSaveShopDetail: createAction(BATCH_SAVE_SHOP_DETAIL),
  batchSaveGoodsDetail: createAction(BATCH_SAVE_GOODS_DETAIL),
}

const updateShopGoods = createAction(UPDATE_SHOP_GOODS)
const updateShopDetail = createAction(UPDATE_SHOP_DETAIL)

/**** Saga ****/

function* shopGoodsDetailSaga(action) {
  let payload = action.payload
  try {
    let result = yield call(shopCloud.fetchShopGoodsDetail, payload)
    if (result.errcode) {
      if (payload.error) {
        payload.error(result.message)
      }
    }
    let goods = result.goods
    let targetShop = goods.targetShop
    let owner = targetShop.owner
    let inviter = targetShop.inviter
    yield put(authAction.addUserProfile({userInfo: owner}))
    yield put(authAction.addUserProfile({userInfo: inviter}))
    yield put(updateShopGoods({goods}))
  } catch (error) {
    if (payload.error) {
      payload.error('获取店铺商品失败')
    }
  }
}

export const shopSaga = [
  takeLatest(GET_SHOP_GOODS_DETAIL, shopGoodsDetailSaga),
]

/**** Reducer ****/

const initialState = Shop()

export function shopReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SHOP_DETAIL:
      return updateShopDetailReducer(state, action)
    case UPDATE_SHOP_GOODS:
      return updateGoodsReducer(state, action)
    case BATCH_SAVE_SHOP_DETAIL:
      return handleBatchSaveShopDetail(state, action)
    case BATCH_SAVE_GOODS_DETAIL:
      return handleBatchSaveGoodsDetail(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function saveShopTagReducer(state, tags) {
  if (!tags) {
    return state
  }
  tags.forEach((tag) => {
    let tagRecord = ShopTag.fromJsonApi(tag)
    state = state.setIn(['shopTagSet', tag.id], tagRecord)
  })
  return state
}

function saveShopCategoryReducer(state, category) {
  if (!category) {
    return state
  }
  let shopCategory = ShopCategory.fromJsonApi(category)
  state = state.setIn(['shopCategorySet', category.id], shopCategory)
  return state
}

function saveShopInfoReducer(state, shopInfo) {
  if (!shopInfo) {
    return state
  }
  state = saveShopTagReducer(state, shopInfo.containedTag)
  state = saveShopCategoryReducer(state, shopInfo.targetShopCategory)
  let shopId = shopInfo.id
  let shopRecord = ShopInfo.fromJsonApi(shopInfo)
  state = state.setIn(['shopDetails', shopId], shopRecord)
  return state
}

function savePromotionReducer(state, promotion) {
  if (!promotion) {
    return state
  }
  let promotionRecord = ShopPromotion.fromJsonApi(promotion)
  state = state.setIn(['shopPromotion', promotion.id], promotionRecord)
  return state
}

function updateShopDetailReducer(state, action) {
  let shopInfo = action.payload.shopInfo
  state = saveShopInfoReducer(state, shopInfo)
  return state
}

function updateGoodsReducer(state, action) {
  let goods = action.payload.goods
  let goodsId = goods.id
  state = saveShopInfoReducer(state, goods.targetShop)
  state = savePromotionReducer(state, goods.goodsPromotion)
  let goodsRecord = ShopGoods.fromJsonApi(goods)
  state = state.setIn(['shopGoodsDetail', goodsId], goodsRecord)
  return state
}

function handleBatchSaveShopDetail(state, action) {
  let shopSet = action.payload.shopSet
  shopSet.forEach((shop) => {
    state = saveShopInfoReducer(state, shop)
  })
  return state
}

function handleBatchSaveGoodsDetail(state, action) {
  let goodSet = action.payload.goodSet
  goodSet.forEach((goods) => {
    let goodsRecord = ShopGoods.fromJsonApi(goods)
    state = state.setIn(['shopGoodsDetail', goods.id], goodsRecord)
  })
  return state
}

function onRehydrate(state, action) {
  let incoming = action.payload.SHOP
  return state
}

/**** Selector ****/

function selectShopGoodsDetail(state, goodsId) {
  let goodsDetail = state.SHOP.getIn(['shopGoodsDetail', goodsId])
  if (goodsDetail) {
    return goodsDetail.toJS()
  }
  return undefined
}

function selectShopCategory(state, categoryId) {
  let categoryRec = state.SHOP.getIn(['shopCategorySet', categoryId])
  if (!categoryRec) {
    return undefined
  }
  let category = categoryRec.toJS()
  return category
}

function selectShopTag(state, tagId) {
  let tagRec = state.SHOP.getIn(['shopTagSet', tagId])
  if (!tagRec) {
    return undefined
  }
  return tagRec.toJS()
}

function selectShopDetail(state, shopId) {
  let shopDetailRec = state.SHOP.getIn(['shopDetails', shopId])
  if (!shopDetailRec) {
    return undefined
  }
  let shopDetail = shopDetailRec.toJS()
  let categoryId = shopDetail.targetShopCategoryId
  shopDetail.targetShopCategory = selectShopCategory(state, categoryId)
  let tags = shopDetail.containedTag
  let containedTag = []
  tags.forEach((tagId) => {
    let shopTag = selectShopTag(state, tagId)
    containedTag.push(shopTag)
  })
  shopDetail.containedTag = containedTag
  let owner = authSelector.userInfoById(state, shopDetail.ownerId)
  if (owner) {
    shopDetail.owner = owner.toJS()
  }
  let inviter = authSelector.userInfoById(state, shopDetail.inviterId)
  if (inviter) {
    shopDetail.inviter = inviter.toJS()
  }
  return shopDetail
}

function selectShopPromotion(state, promotionId) {
  let promotionRec = state.SHOP.getIn(['shopPromotion', promotionId])
  if (!promotionRec) {
    return undefined
  }
  return promotionRec.toJS()
}

export const shopSelector = {
  selectShopGoodsDetail,
  selectShopDetail,
  selectShopPromotion,
}