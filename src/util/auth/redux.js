/**
 * Created by yangyang on 2017/9/19.
 */
import {Map, List, Record} from 'immutable'
import {createAction} from 'redux-actions'
import {REHYDRATE} from 'redux-persist/constants'
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as datetime from '../datetime'
import * as authCloud from './cloud'

/****  Model  ****/

export const UserInfoRecord = Record({
  id: undefined,
  phone: undefined,
  token: undefined,
  avatar: undefined,
  nickname: undefined,
  gender: undefined,
  birthday: undefined,
  identity: undefined,
  geo: undefined,
  geoProvince: undefined,
  geoProvinceCode: undefined,
  geoCity: undefined,
  geoCityCode: undefined,
  geoDistrict: undefined,
  geoDistrictCode: undefined,
  createdAt: '',
  createdDate: '',
  updatedAt: '',
  updatedDate: '',
  lastLoginDuration: '',
  username: '',
  type: '',
  emailVerified: false,
  status: '',
  mobilePhoneNumber: '',
  mobilePhoneVerified: false,
  detail: {},
  enable: false,
  paymentPassword: undefined,
  isVirtual:0,
  authData: undefined,
  openid: undefined,         //公众号对应的微信openid
}, 'UserInfoRecord')

export const UserStateRecord = Record({
  activeUser: undefined,      // 已登录用户ID
  profiles: Map(),            // 用户个人信息列表，已用户id作为健值
  token: undefined,
  followees: Map(),
  followers: Map(),
  followersTotalCount: Map(),
  favoriteArticles: Map(),
  shop: List(),
  points: Map(),          // 用户积分
}, 'UserStateRecord')

export class UserInfo extends UserInfoRecord {
  static fromLeancloudObject(lcObj, type) {
    let attrs = lcObj.attributes
    if(type) {
      lcObj = attrs[type]
      attrs = attrs[type].attributes
    }

    let info = new UserInfoRecord()
    return info.withMutations((record) => {
      record.set('id', lcObj.id)

      if(lcObj.createdAt) {
        let createdAt = lcObj.createdAt
        let updatedAt = lcObj.updatedAt

        record.set('createdAt', createdAt.valueOf())
        record.set('createdDate', datetime.formatLeancloudTime(createdAt, 'YYYY-MM-DD HH:mm:SS'))
        record.set('updatedAt', updatedAt.valueOf())
        record.set('updatedDate', datetime.formatLeancloudTime(updatedAt, 'YYYY-MM-DD HH:mm:SS'))
        record.set('lastLoginDuration', datetime.getConversationTime(updatedAt))
      }

      record.set('phone', attrs['mobilePhoneNumber'])
      record.set('mobilePhoneNumber', attrs['mobilePhoneNumber'])
      record.set('avatar', attrs['avatar'])
      record.set('nickname', attrs['nickname'])
      record.set('gender', attrs['gender'])
      record.set('birthday', attrs['birthday'])
      record.set('identity', new List(attrs.identity))
      record.set('geo', attrs['geo'])
      record.set('geoProvince', attrs['geoProvince'])
      record.set('geoProvinceCode', attrs['geoProvinceCode'])
      record.set('geoCity', attrs['geoCity'])
      record.set('geoCityCode', attrs['geoCityCode'])
      record.set('geoDistrict', attrs['geoDistrict'])
      record.set('geoDistrictCode', attrs['geoDistrictCode'])
      record.set('username', attrs['username'])
      record.set('emailVerified', attrs['emailVerified'])
      record.set('mobilePhoneVerified', attrs['mobilePhoneVerified'])
      record.set('isVirtual', attrs['isVirtual'])
      record.set('status', attrs['status'])
      record.set('type', attrs['type'])
      record.set('enable', attrs['enable'])
    })
  }

  static fromLeancloudApi(lcObj) {
    let info = new UserInfoRecord()
    info = info.withMutations((record) => {
      for(let key in lcObj) {
        if('identity' == key) {
          record.set('identity', new List(lcObj.identity))
        }else if('mobilePhoneNumber' == key){
          record.set(key, lcObj[key])
          record.set('phone', lcObj[key])
        }else {
          record.set(key, lcObj[key])
        }
      }
    })
    return info
  }

  static fromShopFollowersLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let info = new UserInfoRecord()
    info = info.withMutations((record) => {
      let fAttrs = lcObj.attributes.follower.attributes
      record.set('id', lcObj.attributes.follower.id)
      record.set('avatar',fAttrs.avatar)
      record.set('phone', fAttrs.mobilePhoneNumber)
      record.set('nickname', fAttrs.nickname)
      record.set('gender', fAttrs.gender)
      record.set('birthday', fAttrs.birthday)
      record.set('identity', new List(fAttrs.identity))
    })
    return info
  }

}

export class UserState extends UserStateRecord {
  getUserInfoById(userId) {
    const userInfo = this.profiles.get(userId)
    return userInfo ? userInfo : new UserInfo()
  }
}

/**** Constant ****/

const AUTO_LOGIN = 'AUTO_LOGIN'
const LOGIN_WITH_AUTH_DATA = 'LOGIN_WITH_AUTH_DATA'
const LOGIN_SUCCESS = "LOGIN_SUCCESS"
const LOGIN_OUT = "LOGIN_OUT"
const REGISTER_SUCCESS = "REGISTER_SUCCESS"
const GET_SMS_CODE_SUCCESS = "GET_SMS_CODE_SUCCESS"
const FORGOT_PASSWORD_SUCCESS = "FORGOT_PASSWORD_SUCCESS"

const SHOP_CERTIFICATION_SUCCESS = "SHOP_CERTIFICATION_SUCCESS"
const SHOP_RE_CERTIFICATION_SUCCESS = "SHOP_RE_CERTIFICATION_SUCCESS"
const COMPLETE_SHOP_INFO_SUCCESS = "COMPLETE_SHOP_INFO_SUCCESS"
const EDIT_SHOP_INFO_SUCCESS = "EDIT_SHOP_INFO_SUCCESS"
const PUBLISH_ANNOUNCEMENT_SUCCESS = "PUBLISH_ANNOUNCEMENT_SUCCESS"
const UPDATE_ANNOUNCEMENT_SUCCESS = "UPDATE_ANNOUNCEMENT_SUCCESS"
const ADD_PERSONAL_IDENTITY = 'ADD_PERSONAL_IDENTITY'

const PROFILE_SUBMIT_SUCCESS = "PROFILE_SUBMIT_SUCCESS"
const ADD_USER_PROFILE = "ADD_USER_PROFILE"
const ADD_USER_PROFILES = "ADD_USER_PROFILES"
const FETCH_PERSONAL_INFO_SUCCESS = "FETCH_PERSONAL_INFO_SUCCESS"

const FETCH_USER_FOLLOWERS_SUCCESS = 'FETCH_USER_FOLLOWERS_SUCCESS'
const FETCH_USER_FOLLOWERS_PAGING_SUCCESS = 'FETCH_USER_FOLLOWERS_PAGING_SUCCESS'
const FETCH_USER_FOLLOWERS_TOTAL_COUNT_SUCCESS = 'FETCH_USER_FOLLOWERS_TOTAL_COUNT_SUCCESS'
const FETCH_USER_FOLLOWEES_SUCCESS = 'FETCH_USER_FOLLOWEES_SUCCESS'
const FETCH_USER_FOLLOWEES_PAGING_SUCCESS = 'FETCH_USER_FOLLOWEES_PAGING_SUCCESS'
const FETCH_USER_FAVORITEARTICLE_SUCCESS = 'FETCH_USER_FAVORITEARTICLE_SUCCESS'

const UPDATE_USER_POINT = 'UPDATE_USER_POINT'

const UPDATE_USER_IDENTITY = 'UPDATE_USER_IDENTITY'

/**** Action ****/

export const authAction = {
  loginWithAuthData: createAction(LOGIN_WITH_AUTH_DATA),
  autoLogin: createAction(AUTO_LOGIN),
}

const loginSuccess = createAction(LOGIN_SUCCESS)
const logoutSuccess = createAction(LOGIN_OUT)

/**** Saga ****/

function* loginAuthData(action) {
  let payload = action.payload
  try {
    let user = yield call(authCloud.loginAuthData, payload)
    let userInfo = UserInfo.fromLeancloudObject(user.userInfo)
    userInfo = userInfo.set('token', user.token)
    yield put(loginSuccess({userInfo}))
  } catch (error) {
    // yield put(logoutSuccess({}))
  }
}

function* autoLogin(action) {
  let payload = action.payload
  try {
    let result = yield call(authCloud.become, payload)
    let token = result.token
    let userInfo = UserInfo.fromLeancloudObject(result.userInfo)
    userInfo = userInfo.set('token', token)
    yield put(loginSuccess({userInfo: userInfo}))
    console.log("自动登录成功：", userInfo)
  } catch(error) {
    console.log("自动登录失败：", error)
    // yield put(logoutSuccess({}))
  }
}

export const authSagaFunc = {
  autoLogin,
}

export const authSaga = [
  takeLatest(LOGIN_WITH_AUTH_DATA, loginAuthData),
  takeLatest(AUTO_LOGIN, autoLogin),
]

/**** Reducer ****/

const initialState = new UserState()

export function authReducer(state = initialState, action) {
  switch(action.type) {
    case REGISTER_SUCCESS:
      return handleRegisterSuccess(state, action)
    case LOGIN_SUCCESS:
      return handleLoginSuccess(state, action)
    case LOGIN_OUT:
      return handleUserLogout(state, action)
    case SHOP_CERTIFICATION_SUCCESS:
      return handleShopCertificationSuccess(state, action)
    case PROFILE_SUBMIT_SUCCESS:
      return handleProfileSubmitSuccess(state, action)
    case ADD_USER_PROFILE:
      return handleAddUserProfile(state, action)
    case ADD_USER_PROFILES:
      return handleAddUserProfiles(state, action)
    case FETCH_USER_FOLLOWERS_SUCCESS:
      return handleFetchUserFollowersSuccess(state, action)
    case FETCH_USER_FOLLOWERS_PAGING_SUCCESS:
      return handleFetchUserFollowersPagingSuccess(state, action)
    case FETCH_USER_FOLLOWERS_TOTAL_COUNT_SUCCESS:
      return handleFetchUserFollowersTotalCountSuccess(state, action)
    case FETCH_USER_FOLLOWEES_SUCCESS:
      return handleFetchUserFolloweesSuccess(state, action)
    case FETCH_USER_FOLLOWEES_PAGING_SUCCESS:
      return handleFetchUserFolloweesPagingSuccess(state, action)
    case FETCH_USER_FAVORITEARTICLE_SUCCESS:
      return handleFetchUserFavoriteArticleSuccess(state,action)
    case ADD_PERSONAL_IDENTITY:
      return handleAddPersonalIdentity(state, action)
    case UPDATE_USER_POINT:
      return handleUserPoint(state, action)
    case UPDATE_USER_IDENTITY:
      return handleUpdateUserIdentity(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdateUserIdentity(state, action){
  let newIdentity = action.payload.identity
  let activeUser = state.get('activeUser')
  state = state.setIn(['profiles', activeUser, 'identity'], newIdentity)
  return state
}

function handleRegisterSuccess(state, action) {
  let userInfo = action.payload.userInfo
  state = state.set('activeUser', userInfo.id)
  state = state.set('token', action.payload.token)
  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleLoginSuccess(state, action) {
  const userInfo = action.payload.userInfo
  state = state.set('activeUser', userInfo.get('id'))
  state = state.set('token', userInfo.get('token'))
  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleUserLogout(state, action) {
  let activeUser = state.get('activeUser')
  state = state.set('activeUser', undefined)
  state = state.set('token', undefined)
  state = state.deleteIn(['profiles', activeUser])
  return state
}

function handleShopCertificationSuccess(state, action) {
  let payload = action.payload
  let shop = payload.shop
  state = state.set('shop',  shop)
  return state
}

function handleProfileSubmitSuccess(state, action) {
  let userInfo = action.payload.userInfo

  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleAddUserProfile(state, action) {
  let userInfo = action.payload.userInfo
  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleAddUserProfiles(state, action) {
  let userProfiles = action.payload.userProfiles
  userProfiles.forEach((userInfo) => {
    state = state.setIn(['profiles', userInfo.id], userInfo)
  })
  return state
}

function handleFetchUserFolloweesSuccess(state, action) {
  let currentUserId = action.payload.currentUserId
  let followees = action.payload.followees
  state = state.setIn(['followees', currentUserId], followees)
  return state
}

function handleFetchUserFolloweesPagingSuccess(state, action) {
  let payload = action.payload
  let currentUserId = payload.currentUserId
  let followees = payload.followees
  let _followees = state.getIn(['followees', currentUserId])
  let newFollowees = _followees.concat(followees)
  state = state.setIn(['followees', currentUserId], newFollowees)
  return state
}

function handleFetchUserFollowersSuccess(state, action) {
  let userId = action.payload.userId
  let followers = action.payload.followers
  state = state.setIn(['followers', userId], followers)
  return state
}

function handleFetchUserFollowersPagingSuccess(state, action) {
  let payload = action.payload
  let userId = payload.userId
  let followers = payload.followers
  let _followers = state.getIn(['followers', userId])
  let newFollowers = _followers.concat(followers)
  state = state.setIn(['followers', userId], newFollowers)
  return state
}

function handleFetchUserFollowersTotalCountSuccess(state, action) {
  let userId = action.payload.userId
  let followersTotalCount = action.payload.followersTotalCount
  state = state.setIn(['followersTotalCount', userId], followersTotalCount)
  return state
}

function handleFetchUserFavoriteArticleSuccess(state,action){
  let currentUserId = action.payload.currentUserId
  let favoriteArticles = action.payload.favoriteArticles
  state = state.setIn(['favoriteArticles',currentUserId],favoriteArticles)
  return state
}

function handleAddPersonalIdentity(state, action) {
  let newIdentity = action.payload.identity
  let activeUser = state.get('activeUser')
  let identity = state.getIn(['profiles', activeUser, 'identity'])
  if (!identity) {
    state = state.setIn(['profiles', activeUser, 'identity'], new List([newIdentity]))
  } else if (-1 == identity.indexOf(newIdentity)) {
    identity = identity.push(newIdentity)
    state = state.setIn(['profiles', activeUser, 'identity'], identity)
  }
  return state
}

function handleUserPoint(state, action) {
  let point = action.payload.point
  let userId = action.payload.userId
  state = state.setIn(['points', userId], point)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.AUTH
  if (!incoming) {
    return state
  }

  if (!incoming.activeUser) {
    return state
  }
  state = state.set('activeUser', incoming.activeUser)
  state = state.set('token', incoming.token)

  const profiles = Map(incoming.profiles)
  try {
    for (let [userId, profile] of profiles) {
      if (userId && profile) {
        const userInfo = new UserInfo({...profile})
        state = state.setIn(['profiles', userId], userInfo)
      }
    }
  } catch (e) {
    profiles.clear()
  }

  const followees = Map(incoming.followees)
  try {
    for (let [userId, followee] of followees) {
      if (userId && followee) {
        let followeeRec = []
        for (let fol of followee) {
          let userInfo = new UserInfo({...fol})
          followeeRec.push(userInfo)
        }
        state = state.setIn(['followees', userId], new List(followeeRec))
      }
    }
  } catch (e) {
    followees.clear()
  }

  const followers = Map(incoming.followers)
  try {
    for (let [userId, follower] of followers) {
      if (userId && follower) {
        let followerRec = []
        for (let fol of follower) {
          let userInfo = new UserInfo({...fol})
          followerRec.push(userInfo)
        }
        state = state.setIn(['followers', userId], new List(followerRec))
      }
    }
  } catch (e) {
    followees.clear()
  }

  return state
}

/**** Selector ****/

function activeUserId(state) {
  return state.AUTH.activeUser
}

function activeUserAndToken(state) {
  return {
    token: state.AUTH ? state.AUTH.token : undefined,
    activeUser: state.AUTH ? state.AUTH.activeUser : undefined,
  }
}

function isUserLogined(state) {
  let activeUser = activeUserAndToken(state).activeUser
  return activeUser ? true : false
}

function userInfoById(state, userId) {
  return state.AUTH ? state.AUTH.getUserInfoById(userId) : new UserInfo()
}

function userInfoByIds(state, userIds) {
  let users = []
  userIds.forEach((id) => {
    users.push(userInfoById(state, id).toJS())
  })
  return users
}

function activeUserInfo(state) {
  let activeUser = activeUserId(state)
  return activeUser ? state.AUTH.getUserInfoById(activeUser) : new UserInfo()
}

function getUserIdentity(state, userId) {
  let userInfo = userInfoById(state, userId).toJS()
  let identity = userInfo.identity
  if (!identity) {
    return []
  }
  return identity
}

function selectToken(state) {
  let AUTH = state.AUTH
  return AUTH.token
}

export const authSelector = {
  activeUserId,
  isUserLogined,
  userInfoById,
  userInfoByIds,
  activeUserInfo,
  getUserIdentity,
  selectToken,
}