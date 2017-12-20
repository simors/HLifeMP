/**
 * Created by wanpeng on 2017/12/7.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import { Carousel, WhiteSpace, WingBlank, Icon} from 'antd-mobile'
import styles from './promotiondetal.module.scss'
import ArticleViewer from '../../component/article'
import Loading from '../../component/loading'
import {shopSelector} from '../Shop'
import {selector} from './redux'
import * as appConfig from '../../util/appConfig'


class PromotionDetail extends PureComponent {
  constructor(props) {
    super(props)
    document.title = "活动详情"
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

  renderPriceBar() {
    let {shopGoods, shopPromotion} = this.props
    if (!shopGoods) {
      return null
    }
    if (!shopPromotion) {
      return (
        <div className={styles.priceBar}>
          <div>
            <span className={styles.price} style={{paddingRight: 8}}>¥{shopGoods.price}</span>
            <span className={styles.originalPrice}>¥{shopGoods.originalPrice}</span>
          </div>
        </div>
      )
    }
    return (
      <div className={styles.priceBar}>
        <div>
          <span className={styles.price} style={{paddingRight: 8}}>¥{shopGoods.price}</span>
          <span className={styles.originalPrice}>¥{shopGoods.originalPrice}</span>
        </div>
        <div className={styles.promotionType}>
          {shopPromotion.type}
        </div>
      </div>
    )
  }

  renderPromotionAbstract() {
    let {shopPromotion} = this.props
    if (!shopPromotion) {
      return null
    }
    return (
      <div>
        <div className={styles.promotionView}>
          {shopPromotion.type}
        </div>
        <div className={styles.promotionAbstract}>
          {shopPromotion.abstract}
        </div>
      </div>
    )
  }

  gotoBuyGoods() {
    const {history, match} = this.props
    let {goodsId} = match.params
    history.push('/buygoods/' + goodsId)
  }

  renderToolbar() {
    return (
      <div className={styles.toolbar}>
        <div className={styles.contactBtn} onClick={() => document.location=appConfig.APP_DOWNLOAD_URL}>
          <div>
            <img src={require('../../asset/image/icon_ service.png')} className={styles.icon} />
          </div>

          <div>联系卖家</div>
        </div>
        <div className={styles.purchaseBtn} onClick={() => this.gotoBuyGoods()}>
          <img src={require('../../asset/image/CNY.png')} className={styles.icon}/>
          <div>立即购买</div>
        </div>
      </div>
    )
  }

  render() {
    let {shopGoods, shopDetail} = this.props
    if (!shopGoods || !shopDetail) {
      return <Loading/>
    }
    if (shopGoods.status != 1) {
      return <div>商品已下架！</div>
    }
    if (shopDetail.status != 1) {
      return <div>店铺已关闭</div>
    }
    return(
      <div>
        {this.renderHeaderAlbum()}
        {this.renderPriceBar()}
        <WingBlank size="sm">
          <div className={styles.goodsName}>{shopGoods.goodsName}</div>
          {this.renderPromotionAbstract()}
        </WingBlank>
        <div className={styles.shopInfoView}>
          <div className={styles.shopName}>{shopDetail.shopName}</div>
          <div className={styles.enterShop} onClick={() => document.location=appConfig.APP_DOWNLOAD_URL}>
            <span>进入店铺 >></span>
          </div>
        </div>
        <WingBlank size="sm" style={{marginTop: 20}}>
          <ArticleViewer artlcleContent={JSON.parse(shopGoods.detail)} />
        </WingBlank>
        <div style={{width: '100%', height: '3.57rem'}}>
        </div>
        {this.renderToolbar()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let shopDetail = undefined
  let shopPromotion = undefined
  let {match} = ownProps
  let {goodsId} = match.params
  let shopGoods = shopSelector.selectShopGoodsDetail(state, goodsId)
  if (shopGoods) {
    shopDetail = shopSelector.selectShopDetail(state, shopGoods.targetShopId)
    shopPromotion = selector.selectPromotion(state, shopGoods.goodsPromotionId)
  }
  return {
    shopGoods,
    shopDetail,
    shopPromotion,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PromotionDetail))