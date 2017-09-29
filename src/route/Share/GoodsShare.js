/**
 * Created by yangyang on 2017/9/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import { Carousel, WhiteSpace, WingBlank } from 'antd-mobile'
import styles from "./shopshare.module.scss"
import {shopAction, shopSelector} from '../Shop'

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
                <img key={index} src={photo} />
              )
            })
          }
        </Carousel>
      </div>
    )
  }

  render() {
    let {shopGoods} = this.props
    if (!shopGoods) {
      return <div>正在加载...</div>
    }
    return (
      <div>
        {this.renderHeaderAlbum()}
        <WingBlank size="sm">
          <div>店铺商品</div>
        </WingBlank>
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