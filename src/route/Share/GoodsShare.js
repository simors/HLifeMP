/**
 * Created by yangyang on 2017/9/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import { Carousel, WhiteSpace, WingBlank, Popup } from 'antd-mobile'
import styles from "./shopshare.module.scss"
import {shopAction, shopSelector} from '../Shop'
import appConfig from '../../util/appConfig'
import ArticleViewer from '../../component/article'
import EndPanel from '../../component/share/EndPanel'
import WelcomePanel from '../../component/share/WelcomePanel'
import Loading from '../../component/loading'

class GoodsShare extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = "店铺商品"
  }

  componentDidMount() {
    let {match} = this.props
    let {goodsId} = match.params
    this.props.getShopGoodsDetail({goodsId})
    setTimeout(() => (
      Popup.show(<WelcomePanel onClick={() => Popup.hide()}/>, {
        style: {backgroundColor: 'transparent'}
      })
    ), 5000)
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

  renderToolbar() {
    return (
      <div className={styles.toolbar}>
        <div className={styles.contactBtn} onClick={() => document.location=appConfig.APP_DOWNLOAD_URL}>
          <div style={{paddingTop: 8}}>
            <img src={require('../../asset/svg/service.svg')} width={40} />
          </div>

          <div>联系卖家</div>
        </div>
        <div className={styles.purchaseBtn} onClick={() => document.location=appConfig.APP_DOWNLOAD_URL}>
          <span>
            <img src={require('../../asset/svg/purchase_24.svg')} width={60} />
          </span>
          <span>立即购买</span>
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
        <WhiteSpace size="xl" />
        <EndPanel/>
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
    shopPromotion = shopSelector.selectShopPromotion(state, shopGoods.goodsPromotionId)
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