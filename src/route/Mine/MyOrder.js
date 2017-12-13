/**
 * Created by lilu on 2017/12/3.
 */
/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Avatar from '../../component/avatar'
import {Button, WingBlank,Tabs,Badge} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from '../../route/Mine/redux'
import Loading from '../../component/loading'
import OrderAllList from '../../component/order/OrderAllList'
import OrderDeliverList from '../../component/order/OrderDeliverList'
import OrderFinishList from '../../component/order/OrderFinishList'
import styles from './myOrder.module.scss'

const TabPane = Tabs.TabPane;

let tabs = [
  { title: '全部订单' ,tab : 1,key: 1},
  { title: '待收货订单' ,tab : 2, key: 2},
  { title: '已完成订单',tab : 3, key: 3 },
];

 class MyOrder extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '我的订单'
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

   gotoOrderDetail(orderId) {
     let {history} = this.props
     setTimeout(() => {
       history.push('/orderDetail/' + orderId)
     }, 300)
   }


  render() {
    let tabs = [
      { title: '全部订单' ,tab : 1,key: 1},
      { title: '待收货订单' ,tab : 2, key: 2},
      { title: '已完成订单',tab : 3, key: 3 },
    ];
    return (
      <div>
        <Tabs  >

          <TabPane tab='全部订单' key="1">
            <OrderAllList gotoOrderDetail={(orderId)=>{this.gotoOrderDetail(orderId)}}/>
          </TabPane>
          <TabPane tab='待收订单' key="2">
            <OrderDeliverList gotoOrderDetail={(orderId)=>{this.gotoOrderDetail(orderId)}}/>
          </TabPane>
          <TabPane tab='完成订单' key="3">
            <OrderFinishList gotoOrderDetail={(orderId)=>{this.gotoOrderDetail(orderId)}}/>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default withRouter(MyOrder)


