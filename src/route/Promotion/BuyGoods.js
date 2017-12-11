/**
 * Created by wanpeng on 2017/12/8.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {shopSelector} from '../Shop'
import styles from './buygoods.module.scss'
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile'


class BuyGoods extends PureComponent {
  constructor(props) {
    super(props)
    document.title = "下单"
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

  renderToolbar() {
    const {shopGoods} = this.props
    return (
      <div className={styles.toolbar}>
        <div className={styles.price}>
          <span className={styles.title}>实付款：</span>
          <span className={styles.symbol}>¥</span>
          <span className={styles.number} >{shopGoods.price}</span>
        </div>
        <div className={styles.purchaseBtn} onClick={() => {}}>
          <span>确定</span>
        </div>
      </div>
    )
  }

  render() {
    const {shopGoods} = this.props
    return(
      <div>
        {this.renderHeaderAlbum()}
        <div className={styles.goodsDesc}>
          <div className={styles.cover}>
            <img src={shopGoods.coverPhoto} alt="" style={{display: `block`, width: `2.0rem`, height: `2.0rem`}}/>
          </div>
          <div className={styles.desc}>
            <span className={styles.name}>{shopGoods.goodsName}</span>
            <div className={styles.price}>
              <span>¥</span>
              <span>{shopGoods.price}</span>
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
  return {
    shopGoods,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BuyGoods))