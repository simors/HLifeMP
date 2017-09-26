// We only need to import the modules necessary for initial render
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import AuthRoute from './AuthRoute'
import Home from './Home'
import PromoterPerformance from './Promoter'
import PromoterFriends from './Promoter/PromoterFriends'
import MyNearFriend from './Promoter/MyNearFriend'
import GoodsShare from './Shop/GoodsShare'
import NoMatch from './NoMatch'
import ErrorPage from './Error'
import LoadingPage from './Loading'

const rootRoutes = (
  <Switch>
    <AuthRoute path="/promoter" component={PromoterPerformance}/>
    <Route path="/friends/:level" component={PromoterFriends}/>
    <Route path="/nearfriend" component={MyNearFriend}/>
    <Route path="/goodsShare" component={GoodsShare}/>
    <Route path="/error" component={ErrorPage} />
    <Route path="/loading" component={LoadingPage}/>
    <Route path="/" component={Home}/>
    <Route component={NoMatch}/>
  </Switch>
)

export default rootRoutes