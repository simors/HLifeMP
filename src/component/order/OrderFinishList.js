/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Avatar from '../../component/avatar'
import {Button, WingBlank , List} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from '../../route/Mine'
import Loading from '../../component/loading'
import AddrShow from './OrderShow'
import appConfig from '../../util/appConfig'
import styles from './orderList.module.scss'


class OrderFinishList extends React.PureComponent {
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
      vendor:{
        shopName:'123'
      },
      goods:{
        coverPhoto:'https://dn-TUVjJ5HH.qbox.me/5609d21e7198affd1cfc.jpeg',
        goodsName:'dd',
        price: 2,
        originalPrice: 3,

      },
      id: '12',
      goodsAmount: 2,
      paid: 24,
      orderStatus: 1,
      receiver: '3213213',
      receiverAddr: '321321',
      receiverPhone: '3213213',
      remark: 33333,
      createdAt: undefined,
      updatedAt: undefined,

    },{
      vendor:{
        shopName:'123'
      },
      goods:{
        coverPhoto:'https://dn-TUVjJ5HH.qbox.me/5609d21e7198affd1cfc.jpeg',
        goodsName:'dd',
        price: 2,
        originalPrice: 3,

      },
      id: '12',
      goodsAmount: 2,
      paid: 24,
      orderStatus: 1,
      receiver: '3213213',
      receiverAddr: '321321',
      receiverPhone: '3213213',
      remark: 33333,
      createdAt: undefined,
      updatedAt: undefined,

    },
      {
        vendor:{
          shopName:'123'
        },
        goods:{
          coverPhoto:'https://dn-TUVjJ5HH.qbox.me/5609d21e7198affd1cfc.jpeg',
          goodsName:'dd',
          price: 2,
          originalPrice: 3,

        },
        id: '12',
        goodsAmount: 2,
        paid: 24,
        orderStatus: 1,
        receiver: '3213213',
        receiverAddr: '321321',
        receiverPhone: '3213213',
        remark: 33333,
        createdAt: undefined,
        updatedAt: undefined,

      },]
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
      <List className={styles.list}>
        {this.renderAddrList()}
      </List>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  // let user = authSelector.activeUserId(state)
  // let orderList = mineSelector.selectUserOrders(state,user.id,appConfig.ORDER_STATUS.ACCOMPLISH)
  return {
    // orderList,
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderFinishList))
