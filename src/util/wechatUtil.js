/**
 * Created by yangyang on 2017/9/19.
 */
import React from 'react'
import {withRouter, Route, Redirect} from 'react-router-dom'
import querystring from 'querystring'
import URL from  'url'
import AV from 'leancloud-storage'
import * as appConfig from './appConfig'
import {authAction, authSelector} from '../util/auth'
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
  let state = store.getState()
  let appState = appStateSelector.selectAppState(state)
  let isRehydrated = undefined
  if (appState) {
    isRehydrated = appState.isRehydrated
  }
  if (!isRehydrated) {
    return (
      <Redirect to={{
        pathname: '/loading',
        state: {from: nextPath}
      }}/>
    )
  }
  let activeUser = authSelector.activeUserId(state)
  if (activeUser) {
    return null
  }
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