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
import Mine from './Mine/Mine'
import MyAddr from './Mine/MyAddr'
import CreateMyAddr from './Mine/CreateMyAddr'
import UpdateMyAddr from './Mine/UpdateMyAddr'
import MyOrder from './Mine/MyOrder'
import OrderDetail from './Mine/OrderDetail'

import NearbyPromotion, {PromotionDetail, BuyGoods, SelectAddress, SubmitOrder} from './Promotion'

const rootRoutes = (
  <Switch>
    <AuthRoute path="/promoter" component={PromoterPerformance}/>
    <AuthRoute path="/promotion" component={NearbyPromotion}/>
    <AuthRoute path="/promotionDetail/:goodsId" component={PromotionDetail}/>
    <AuthRoute path="/selectAddress" component={SelectAddress}/>
    <AuthRoute path="/submitOrder" component={SubmitOrder}/>
    <AuthRoute path="/buygoods/:goodsId" component={BuyGoods}/>
    <AuthRoute path="/wallet" component={Wallet}/>
    <AuthRoute path="/mine" component={Mine}/>
    <AuthRoute path="/withdraw" component={Withdraw}/>
      <AuthRoute path="/myAddr" component={MyAddr}/>
    <AuthRoute path="/createMyAddr" component={CreateMyAddr}/>
    <AuthRoute path="/updateMyAddr" component={UpdateMyAddr}/>
    <AuthRoute path="/myOrder" component={MyOrder}/>
      <AuthRoute path="/orderDetail/:orderId" component={OrderDetail}/>

    <AuthRoute path="/about" component={Withdraw}/>

      <Route path="/friends/:level" component={PromoterFriends}/>
    <Route path="/nearfriend" component={MyNearFriend}/>
    <ShareAuthRoute path="/shareGoods/:goodsId" component={GoodsShare}/>
    <Route path="/error" component={ErrorPage}/>
    <Route path="/loading" component={LoadingPage}/>
    <Route path="/" component={Home}/>
    <Route component={NoMatch}/>
  </Switch>
)

export default rootRoutes