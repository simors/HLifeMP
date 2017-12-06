/**
 * Created by wanpeng on 2017/12/4.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {actions as promotionActions, selector as promotionSelector} from './redux'
import {appStateAction, appStateSelector} from '../../util/appstate'
import wx from 'tencent-wx-jssdk'
import { WhiteSpace, Popup, Button, ListView } from 'antd-mobile'
import {getMobileOperatingSystem} from '../../util/OSUtil'

const LOCATION = {
  latitude: 28.22142,
  longitude: 112.8665,
  speed: -1,
  accuracy: 65,
}

class NearbyPromotion extends PureComponent {
  constructor(props) {
    super(props)
    document.title = "附近活动"
  }

  componentWillMount() {
    const {getJsApiConfig, entryURL} = this.props
    const OS = getMobileOperatingSystem()
    let jssdkURL = window.location.href
    if(OS === 'iOS') {
      //微信JS-SDK Bug: SPA(单页应用)ios系统必须使用首次加载的url初始化jssdk
      jssdkURL = entryURL
    }
    getJsApiConfig({
      debug: __DEV__? true: true,
      jsApiList: ['scanQRCode', 'getLocation'],
      url: jssdkURL,
      success: (configInfo) => {
        wx.config(configInfo)
      },
      error: (error) => {console.log(error)}
    })
  }

  componentDidMount() {

  }

  getWxLocation() {
    const {fetchPromotionAction, nearbyPromList} = this.props
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
        alert(res)
        var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
        var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
        var speed = res.speed; // 速度，以米/每秒计
        var accuracy = res.accuracy; // 位置精度
      }
    })
    fetchPromotionAction({
      geo: {
        latitude: LOCATION.latitude,
        longitude: LOCATION.longitude,
      },
      limit: 10,
      lastDistance: undefined,
      nowDate: new Date('2017-09-01'),
      isRefresh: true,
    })
  }

  render() {
    return(
      <div>
        <WhiteSpace />
        <Button onClick={() => {this.getWxLocation()}}>
          获取地理位置
        </Button>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const nearbyPromList = promotionSelector.selectNearbyPromotion(state)
  console.log("nearbyPromList", nearbyPromList)

  return {
    entryURL: appStateSelector.selectEntryURL(state),
    nearbyPromList: nearbyPromList,
  }
}

const mapDispatchToProps = {
  fetchPromotionAction: promotionActions.fetchPromotionAction,
  ...appStateAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NearbyPromotion))