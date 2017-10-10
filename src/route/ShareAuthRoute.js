/**
 * Created by yangyang on 2017/9/26.
 */
import React from 'react'
import {Route} from 'react-router-dom'
import {shareOauth} from '../util/wechatUtil'
import Loading from '../component/loading'

const ShareAuthRoute = ({ component: Component, ...rest }) => {
  let {location} = rest
  if (shareOauth(location)) {
    return (
      <Route {...rest} render={props => (
        <Component {...props}/>
      )}/>
    )
  }
  return <Route render={() => <Loading/>}/>
}

export default ShareAuthRoute