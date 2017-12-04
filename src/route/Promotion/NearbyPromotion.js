/**
 * Created by wanpeng on 2017/12/4.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {promotionAction} from '../Promotion'
import {appStateAction, appStateSelector} from '../../util/appstate'
import wx from 'tencent-wx-jssdk'
import { Carousel, WhiteSpace, WingBlank, Popup, Button } from 'antd-mobile'
import {getMobileOperatingSystem} from '../../util/OSUtil'


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

  getWxLocation() {
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
  return {
    entryURL: appStateSelector.selectEntryURL(state)
  }
}

const mapDispatchToProps = {
  ...promotionAction,
  ...appStateAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NearbyPromotion))