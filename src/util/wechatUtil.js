/**
 * Created by yangyang on 2017/9/19.
 */
import React from 'react'
import {withRouter, Route, Redirect} from 'react-router-dom'
import querystring from 'querystring'
import URL from  'url'
import AV from 'leancloud-storage'
import * as appConfig from './appConfig'
import {authAction} from '../util/auth'
import {store} from '../store/persistStore'
import {appStateSelector} from '../util/appstate'

function getAuthorizeURL(redirect, state, scope) {
  let url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  let info = {
    appid: appConfig.WECHAT_MP_APPID,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope || 'snsapi_base',
    state: state || ''
  };
  return url + '?' + querystring.stringify(info) + '#wechat_redirect';
}


export function wechatOauth(nextPath) {
  // 必须从持久化数据中获取数据，因为这个时候有可能持久化数据恢复还没有完成
  let appState = appStateSelector.selectAppState(store.getState())
  let isRehydrated = undefined
  if (appState) {
    isRehydrated = appState.isRehydrated
  }
  if (!isRehydrated) {
    console.log('redirect to loading')
    return (
      <Redirect to={{
        pathname: '/loading',
        state: {from: nextPath}
      }}/>
    )
  }
  let authInfo = localStorage.getItem('reduxPersist:AUTH')
  let activeUser = authInfo? JSON.parse(authInfo).activeUser : undefined
  if (activeUser) {
    console.log('authInfo', activeUser)
    return null
  }
  // let currentUser = AV.User.current()
  // if (currentUser) {
  //   return null
  // }
  let redirectUri = appConfig.BACKEND_DOMAIN + '/wxOauth/clientAuth'
  let urlObj = URL.parse(document.location.href)
  let {openid, access_token, expires_at} = querystring.parse(urlObj.query)
  let authData = undefined
  if (openid && access_token && expires_at) {
    authData = {
      openid,
      access_token,
      expires_at,
    }
  }
  if(!authData) {
    let nextPathname = appConfig.CLIENT_DOMAIN + nextPath.pathname
    let redirectUrl = getAuthorizeURL(redirectUri, nextPathname, 'snsapi_userinfo')
    document.location = redirectUrl
  } else {
    store.dispatch(authAction.loginWithAuthData(authData))
  }
  return null
}