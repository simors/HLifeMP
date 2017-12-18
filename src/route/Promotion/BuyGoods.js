/**
 * Created by wanpeng on 2017/12/8.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {shopSelector} from '../Shop'
import styles from './buygoods.module.scss'
import { Carousel, WhiteSpace, WingBlank, TextareaItem, Icon} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {PAYMENT_TYPE} from './redux'
import {mineAction} from '../Mine'


class BuyGoods extends PureComponent {
  constructor(props) {
    super(props)
    document.title = "下单"
    this.state = {
      count: 1,
      remark: undefined,
      touchMinus: false,
      touchPlus: false,
    }
  }

  componentDidMount() {
    this.props.fetchMyAddr({isRefresh: true})
  }

  renderHeaderAlbum() {
    let {shopGoods} = this.props
    if (!shopGoods) {
      return null
    }

    if (shopGoods.album.length == 1) {
      return (
        <img src={shopGoods.album[0]} width="100%" />
      )
    }
    return (
      <div>
        <Carousel
          className={styles.carousel}
          autoplay={true}
          infinite
          selectedIndex={0}
          swipeSpeed={35}
          dotStyle={{width: 16, height: 16}}
          dotActiveStyle={{width: 16, height: 16}}
        >
          {
            shopGoods.album.map((photo, index) => {
              return (
                <img key={index} src={photo} className={styles.imgStyle} />
              )
            })
          }
        </Carousel>
      </div>
    )
  }

  gotoSelectAddress() {
    const {history, shopGoods, shopDetail, activeUser} = this.props
    let metadata = {
      'fromUser': activeUser,
      'toUser': shopDetail.ownerId,
      'dealType': PAYMENT_TYPE.BUY_GOODS,
      'vendorId': shopGoods.targetShopId,
      'goodsId': shopGoods.id,
      'goodsAmount': this.state.count,
      'receiver': '',
      'receiverPhone': '',
      'receiverAddr': '',
      'remark': this.state.remark,
    }
    history.push('/submitOrder', {metadata: metadata})
  }

  renderToolbar() {
    const {shopGoods} = this.props
    return (
      <div className={styles.toolbar}>
        <div className={styles.price}>
          <span className={styles.title}>实付款：</span>
          <span className={styles.symbol}>¥</span>
          <span className={styles.number} >{shopGoods.price * this.state.count}</span>
        </div>
        <div className={styles.purchaseBtn} onClick={() => this.gotoSelectAddress()}>
          <span>确定</span>
        </div>
      </div>
    )
  }

  onMinusCount() {
    let that = this
    if(this.state.count > 1) {
      that.setState({count: this.state.count - 1, touchMinus: true})
    }
    setTimeout(function () {
      that.setState({touchMinus: false})
    }, 300)
  }

  onPlusCount() {
    let that = this
    that.setState({count: this.state.count + 1, touchPlus: true})
    setTimeout(function () {
      that.setState({touchPlus: false})
    }, 300)
  }

  render() {
    const {shopGoods} = this.props
    return(
      <div className={styles.page}>
        {this.renderHeaderAlbum()}
        <div className={styles.goodsDesc}>
          <div className={styles.cover}>
            <img src={shopGoods.coverPhoto} alt="" style={{display: `block`, width: `2.0rem`, height: `2.0rem`}}/>
          </div>
          <div className={styles.desc}>
            <div className={styles.name}>{shopGoods.goodsName}</div>
            <div className={styles.price}>
              <span>¥</span>
              <span>{shopGoods.price}</span>
            </div>
          </div>
        </div>
        <div className={styles.form}>

          <div className={styles.count}>
            <div className={styles.countTitle}>购买数量</div>
            <div className={styles.stepper}>
              <div className={styles.minus}
                   style={{backgroundColor: this.state.touchMinus? '#fff' : 'rgba(0,0,0,0.2)'}}
                   onClick={() => this.onMinusCount()}>
                <span>-</span>
              </div>
              <div className={styles.number}>{this.state.count}</div>
              <div className={styles.plus} style={{backgroundColor: this.state.touchPlus? '#fff' : 'rgba(0,0,0,0.2)'}}
                   onClick={() => this.onPlusCount()}>
                <span>+</span>
              </div>
            </div>
          </div>
          <div className={styles.mark}>
            <div className={styles.markTitle}>备注信息</div>
            <div className={styles.textArea}>
              <TextareaItem
                placeholder="商品颜色、规格等要求需给商家留言"
                rows={3}
                onChange={(text) => {this.setState({remark: text})}}
              />
            </div>
          </div>
        </div>

        {this.renderToolbar()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let {match} = ownProps
  let {goodsId} = match.params
  let shopGoods = shopSelector.selectShopGoodsDetail(state, goodsId)
  let shopDetail =shopGoods? shopSelector.selectShopDetail(state, shopGoods.targetShopId) : undefined
  return {
    shopGoods,
    shopDetail,
    activeUser: authSelector.activeUserId(state),
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuyGoods))