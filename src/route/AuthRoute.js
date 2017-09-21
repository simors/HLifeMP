/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {withRouter, Route, Redirect} from 'react-router-dom'
import {wechatOauth} from '../util/wechatUtil'
import {appStateSelector} from '../util/appstate'
import {store} from '../store/persistStore'

const AuthRoute = ({ component: Component, ...rest }) => {
  let {location} = rest
  let comp = wechatOauth(location)
  if (!comp) {
    return (
      <Route {...rest} render={props => (
        <Component {...props}/>
      )}/>
    )
  }
  return comp
}

export default AuthRoute
