// We only need to import the modules necessary for initial render
import React from 'react'
import {Route, Switch} from 'react-router-dom'
import AuthRoute from './AuthRoute'
import ShareAuthRoute from './ShareAuthRoute'
import Home from './Home'
import PromoterPerformance from './Promoter'
import PromoterFriends from './Promoter/PromoterFriends'
import MyNearFriend from './Promoter/MyNearFriend'
import GoodsShare from './Share/GoodsShare'
import Wallet from './Mine/Wallet'
import Withdraw from './Mine/Withdraw'
import NoMatch from './NoMatch'
import ErrorPage from './Error'
import LoadingPage from './Loading'
import NearbyPromotion from './Promotion'

const rootRoutes = (
  <Switch>
    <AuthRoute path="/promoter" component={PromoterPerformance}/>
    <AuthRoute path="/promotion" component={NearbyPromotion}/>
    <AuthRoute path="/wallet" component={Wallet}/>
    <AuthRoute path="/withdraw" component={Withdraw}/>
    <Route path="/friends/:level" component={PromoterFriends}/>
    <Route path="/nearfriend" component={MyNearFriend}/>
    <ShareAuthRoute path="/shareGoods/:goodsId" component={GoodsShare}/>
    <Route path="/error" component={ErrorPage} />
    <Route path="/loading" component={LoadingPage}/>
    <Route path="/" component={Home}/>
    <Route component={NoMatch}/>
  </Switch>
)

export default rootRoutes