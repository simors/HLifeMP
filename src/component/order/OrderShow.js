/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './orderShow.module.scss'
import Avatar from '../../component/avatar'
import {Button, WingBlank} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector, mineConfig} from '../../route/Mine/redux'
import Loading from '../../component/loading'
import {getThumbUrl} from '../../util/imageUtils'
import appConfig from '../../util/appConfig'

const ORDER_STATUS = mineConfig.ORDER_STATUS

class OrderShow extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }


  goodsDetail(order) {
    let goods = order.goods
    return (
      <div
        onClick={()=> {
          this.gotoOrderDetail(order.id)
        }}
        className={styles.goodsBox}>
        <div className={styles.goodsView}>
          <img className={styles.cover} src={getThumbUrl(goods.coverPhoto, 80, 80)}/>
          <div className={styles.goodsInfo}>
            <span className={styles.goodsNameText}>{goods.goodsName}</span>
            <div className={styles.priceView}>
              <div className={styles.priceBox}>
                <span className={styles.price}>¥{goods.price}</span>
                <span className={styles.originalPrice}>¥{goods.originalPrice}</span>
              </div>
              <span className={styles.amount}>x {order.goodsAmount}</span>
            </div>
          </div>
        </div>
        <div className={styles.paidView}>
          <span className={styles.paidLabel}>共{order.goodsAmount}件商品  实付款：</span>
          <span className={styles.paidText}>¥{order.paid}</span>
        </div>
      </div>
    )

  }

  renderButton(order) {
    let orderStatus = order.orderStatus
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      return (
        <div className={styles.blankButton}></div>
      )
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return (
        <div className={styles.itemBottomView}>
          <Button className={styles.confirmButton}
                  onClick={() => {
                    this.props.setOrderStatus(order.buyerId, order.id, ORDER_STATUS.ACCOMPLISH)
                  }}>
            确认收货
          </Button>
        </div>
      )
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return (
        <div className={styles.itemBottomView}>
          <Button className={styles.deleteButton}
                  onClick={() => {
                    this.props.setOrderStatus(order.buyerId, order.id, ORDER_STATUS.DELETED)
                  }}>
            删除订单
          </Button>
        </div>
      )
    }
  }

  tipsText(order) {
    let orderStatus = order.orderStatus
    if (orderStatus == ORDER_STATUS.PAID_FINISHED) {
      if (!order.receiver || order.receiver == "") {
        return '请及时取货'
      }
      return '等待卖家发货'
    } else if (orderStatus == ORDER_STATUS.DELIVER_GOODS) {
      return '已发货'
    } else if (orderStatus == ORDER_STATUS.ACCOMPLISH) {
      return '已完成'
    }
  }

  gotoOrderDetail(orderId) {
    let {history} = this.props
    setTimeout(() => {
      history.push('/orderDetail/' + orderId)
    }, 300)
  }

  render() {
    let {order} = this.props
    console.log('order=====>', order)
    let goods = order.goods
    let vendor = order.vendor
    if (!goods || !vendor) {
      return <div/>
    }
    console.log('order=====>', order)
    return (
      <div className={styles.body}>
        <div
          onClick={()=> {
            this.gotoOrderDetail(order.id)
          }}
          className={styles.statusBox}>
          <div className={styles.shopInfoBox}>
            <img src={require('../../asset/image/shop_invite@2x.png')} className={styles.shopIcon}/>
            <span className={styles.shopName}>{vendor.shopName}</span>
            <img src={require('../../asset/image/PinLeft_right_12@2x.png')} className={styles.backIcon}/>
          </div>
          <span className={styles.shopTips}>{this.tipsText(order)}</span>
        </div>
        {this.goodsDetail(order)}
           {this.renderButton(order)}

      </div>
    )
  }
}


export default withRouter(OrderShow)