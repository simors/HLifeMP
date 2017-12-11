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

let tabs = [
  { title: '全部订单' ,tab : 1,key: 1},
  { title: '待收货订单' ,tab : 2, key: 2},
  { title: '已完成订单',tab : 3, key: 3 },
];

export default class MyAddr extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '收货地址管理'
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }




  render() {
    let tabs = [
      { title: '全部订单' ,tab : 1,key: 1},
      { title: '待收货订单' ,tab : 2, key: 2},
      { title: '已完成订单',tab : 3, key: 3 },
    ];
    return (
      <div className={styles.body}>
        <Tabs tabs={tabs}
              initialPage={1}
              onChange={(tab, index) => { console.log('onChange', index, tab); }}
              onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
              className={styles.tabs}
        >
          <div key={1}  style={{ width:'7.5rem',display: 'flex', alignItems: 'center', justifyContent: 'center',backgroundColor: '#fff' }}>
            <OrderAllList/>
          </div>
          <div key={2}  style={{ width:'7.5rem' ,display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
            <OrderDeliverList/>
          </div>
          <div key={3}  style={{width:'7.5rem',display: 'flex', alignItems: 'center', justifyContent: 'center',  backgroundColor: '#fff' }}>
            <OrderFinishList/>
          </div>
        </Tabs>
      </div>
    )
  }
}



