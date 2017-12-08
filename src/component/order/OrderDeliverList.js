/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './orderList.module.scss'
import Avatar from '../../component/avatar'
import {Button, WingBlank , List} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from '../../route/Mine'
import Loading from '../../component/loading'
import AddrShow from './OrderShow'
import appConfig from '../../util/appConfig'


class OrderDeliverList extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

  renderAddrList(){
    // let {addrList} = this.props
    let orderList = [{
      username: 'asdasd',
      mobilePhoneNumber: '123123123',
      tag: '家',
      addr: 'asdasdasdasdasdasdasd'
    },{
      username: 'sdd',
      mobilePhoneNumber: '123123123',
      tag: '公司',
      addr: '123123123'
    },{
      username: 'sdd',
      mobilePhoneNumber: '123123123',
      tag: '公司',
      addr: '123123123'
    },{
      username: 'sdd',
      mobilePhoneNumber: '123123123',
      tag: '公司',
      addr: '123123123'
    },{
      username: 'sdd',
      mobilePhoneNumber: '123123123',
      tag: '公司',
      addr: '123123123'
    },{
      username: 'sdd',
      mobilePhoneNumber: '123123123',
      tag: '公司',
      addr: '123123123'
    }]
    console.log('')
    if(orderList && orderList.length>0){
      let orderViewList = orderList.map((item,key)=>{
        return <div key = {key} className={styles.blankWrap} ><AddrShow order={item}  /></div>
      })
      return orderViewList
    }else{
      return <div></div>
    }
  }


  render() {


    return (
      <div >
        <List className={styles.list}>
          {this.renderAddrList()}
        </List>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let user = authSelector.activeUserId(state)
  let orderList = mineSelector.selectUserOrders(state,user.id,appConfig.ORDER_STATUS.DELIVER_GOODS)
  return {
    orderList,
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderDeliverList))
