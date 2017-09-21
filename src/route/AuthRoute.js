/**
 * Created by yangyang on 2017/9/11.
 */
import React from 'react'
import {Route} from 'react-router-dom'
import {wechatOauth} from '../util/wechatUtil'

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
