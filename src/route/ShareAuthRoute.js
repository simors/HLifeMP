/**
 * Created by yangyang on 2017/9/26.
 */
import React from 'react'
import {Route} from 'react-router-dom'
import {shareOauth} from '../util/wechatUtil'

const ShareAuthRoute = ({ component: Component, ...rest }) => {
  let {location} = rest
  if (shareOauth(location)) {
    return (
      <Route {...rest} render={props => (
        <Component {...props}/>
      )}/>
    )
  }
  return <Route render={() => <div>正在加载...</div>}/>
}

export default ShareAuthRoute