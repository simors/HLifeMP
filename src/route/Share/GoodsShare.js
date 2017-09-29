/**
 * Created by yangyang on 2017/9/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile'
import styles from "./shopshare.module.scss"
import {shopAction, shopSelector} from '../Shop'
import * as appConfig from '../../util/appConfig'
import ArticleViewer from '../../component/article'

class GoodsShare extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = "店铺商品"
  }

  componentDidMount() {
    let {match} = this.props
    let {goodsId} = match.params
    this.props.getShopGoodsDetail({goodsId})
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
          dotStyle={{width: 8, height: 8}}
          dotActiveStyle={{width: 8, height: 8}}
        >
          {
            shopGoods.album.map((photo, index) => {
              return (
                <img key={index} src={photo} width="100%" />
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
        <span className={styles.promotionView}>
          {shopPromotion.type}
        </span>
        <span className={styles.promotionAbstract}>
          {shopPromotion.abstract}
        </span>
      </div>
    )
  }

  render() {
    let {shopGoods, shopDetail} = this.props
    if (!shopGoods || !shopDetail) {
      return <div>正在加载...</div>
    }
    return (
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
        <div style={{height: 100}}/>
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
  console.log('shopGoods:', shopGoods)
  if (shopGoods) {
    shopDetail = shopSelector.selectShopDetail(state, shopGoods.targetShopId)
    console.log('shopDetail:', shopDetail)
    shopPromotion = shopSelector.selectShopPromotion(state, shopGoods.goodsPromotionId)
    console.log('shopPromotion', shopPromotion)
  }
  return {
    shopGoods,
    shopDetail,
    shopPromotion,
  }
}

const mapDispatchToProps = {
  ...shopAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GoodsShare))