/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './orderDetail.module.scss'
import Avatar from '../../component/avatar'
import {Button, WingBlank, Toast} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector, mineConfig} from '../../route/Mine/redux'
import Loading from '../../component/loading'
import {getThumbUrl} from '../../util/imageUtils'

const ORDER_STATUS = mineConfig.ORDER_STATUS

class OrderDetail extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = "订单详情"

  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

  setOrderStatus(buyerId, orderId, status) {
    let payload = {
      orderStatus: status,
      buyerId: buyerId,
      orderId: orderId,
      success: ()=> {
        this.props.history.goBack()
      },
      error: (err)=> {
        Toast.fail(err.message)
      }
    }
    this.props.setUserOrderStatus(payload)
  }

  BottomView(order) {
    let orderStatus = order.orderStatus
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      return null
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return (
        <div className={styles.itemBottomView} onClick={() => {
          this.setOrderStatus(order.buyerId, order.id, ORDER_STATUS.ACCOMPLISH)
        }}>
          <span className={styles.confirmButton}>
            确认收货
          </span>
        </div>
      )
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return (
        <div className={styles.itemBottomView} onClick={() => {
          this.setOrderStatus(order.buyerId, order.id, ORDER_STATUS.DELETED)
        }}>
          <span className={styles.deleteButton}
          >
            删除订单
          </span>
        </div>
      )
    }
  }

  tipsText(order) {
    let orderStatus = order.orderStatus
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      if (!order.receiver || order.receiver == "") {
        return <span className={styles.noRec}>请及时取货</span>
      }
      return <span className={styles.wait}>等待卖家发货</span>
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return (
        <div className={styles.sendBox}>
          <img src={require('../../asset/svg/right_green@100x.svg')} className={styles.sendImg}/>
          <span className={styles.sendText}>已发货</span>
        </div>
      )
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return (
        <div className={styles.sendBox}>
          <img src={require('../../asset/svg/right_green@100x.svg')} className={styles.sendImg}/>
          <span className={styles.sendText}>交易成功</span>
        </div>
      )
    }
  }

  showHead(order) {
    return (
      <div className={styles.header}>
        {this.tipsText(order)}
      </div>
    )
  }

  showOrderInfo(order) {
    return (
      <div className={styles.orderInfoBox}>
        <div className={styles.shopWrap}>
          <img src={require('../../asset/svg/shop_invite@100x.svg')} className={styles.shopIcon}/>
          <span className={styles.shopName}>{order.vendor.shopName}</span>
          <img src={require('../../asset/svg/Chevron.svg')} className={styles.backIcon}/>
        </div>
        <div className={styles.goodsBox}>
          <img className={styles.coverPhoto} src={order.goods.coverPhoto}/>
          <div className={styles.goodsInfoBox}>
            <span className={styles.goodsName}>{order.goods.goodsName}</span>
            <div className={styles.priceWrap}>
              <div className={styles.priceBox}>
                <span className={styles.price}>¥{order.goods.price}</span>
                <span className={styles.originalPrice}>¥{order.goods.originalPrice}</span>
              </div>
              <span className={styles.amount}>{'x' + order.goodsAmount}</span>
            </div>
          </div>
        </div>
        <div className={styles.orderDate}>
          <span className={styles.orderDateText}>{'下单时间:' + order.createdAt}</span>
        </div>
      </div>
    )
  }

  showPrice(order) {
    return (
      <div className={styles.paidBox}>
        <div className={styles.paidWrap}>
          <span className={styles.paidText}>商品总额：</span>
          <span className={styles.paidText}>¥{order.paid}</span>
        </div>
        <div className={styles.remarkWrap}>
          <span className={styles.remarkText}>备注信息：{order.remark}</span>
        </div>
      </div>
    )
  }

  showAddr(order) {
    if (order.receiver && order.receiver != '') {
      return (
        <div className={styles.receiverBox}>
          <img className={styles.receiverImg} src={require('../../asset/svg/location@100x.svg')}/>
          <div className={styles.receiverInfo}>
            <span className={styles.receiverName}>{order.receiver + ' ' + order.receiverPhone}</span>
            <span className={styles.receiverAddr}>{order.receiverAddr}</span>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  render() {
    let {order} = this.props
    // let goods = order.goods
    // let vendor = order.vendor
    // if (!goods || !vendor) {
    //   return <div/>
    // }
    //
    // let order = {
    //   username: 'asdasd',
    //   mobilePhoneNumber: '123123123',
    //   tag: '家',
    //   order: 'asdasdasdasdasdasdasd'
    // }
    // let order = {
    //   vendor:{
    //     shopName:'123'
    //   },
    //   goods:{
    //     coverPhoto:'https://dn-TUVjJ5HH.qbox.me/5609d21e7198affd1cfc.jpeg',
    //       goodsName:'dd',
    //       price: 2,
    //       originalPrice: 3,
    //
    //   },
    //   id: '12',
    //     goodsAmount: 2,
    //   paid: 24,
    //   orderStatus: 2,
    //   receiver: '3213213',
    //   receiverAddr: '321321',
    //   receiverPhone: '3213213',
    //   remark: 33333,
    //   createdAt: undefined,
    //   updatedAt: undefined,
    // }


    return (
      <div className={styles.body}>
        {this.showHead(order)}
        {this.showAddr(order)}
        {this.showOrderInfo(order)}
        {this.showPrice(order)}
        {this.BottomView(order)}
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let {match} = ownProps
  let {orderId} = match.params

  let order = mineSelector.selectOrderDetail(state, orderId)
  console.log('order=====>', order)
  return {
    order
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderDetail))

