/**
 * Created by wanpeng on 2017/12/4.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {actions as promotionActions, selector as promotionSelector} from './redux'
import {appStateAction, appStateSelector} from '../../util/appstate'
import wx from 'tencent-wx-jssdk'
import { WhiteSpace, Popup, Button, ListView, Toast, PullToRefresh } from 'antd-mobile'
import {getMobileOperatingSystem, getDistanceFromLatLonInKm} from '../../util/OSUtil'
import styles from './promotion.module.scss'

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
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource,
      isLoading: true,
      hasMore: true,
    };
  }

  componentWillMount() {
    const {getJsApiConfig, entryURL, fetchPromotionAction} = this.props
    const OS = getMobileOperatingSystem()
    let jssdkURL = window.location.href
    if(OS === 'iOS') {
      //微信JS-SDK Bug: SPA(单页应用)ios系统必须使用首次加载的url初始化jssdk
      jssdkURL = entryURL
    }
    getJsApiConfig({
      debug: __DEV__? false: false,
      jsApiList: ['scanQRCode', 'getLocation'],
      url: jssdkURL,
      success: (configInfo) => {
        wx.config(configInfo)
      },
      error: (error) => {console.log(error)}
    })
    fetchPromotionAction({
      geo: {
        latitude: LOCATION.latitude,
        longitude: LOCATION.longitude,
      },
      limit: 10,
      lastDistance: undefined,
      nowDate: new Date('2016-09-01'),
      isRefresh: true,
      success: this.fetchPromotionActionSuccess,
      error: this.fetchPromotionActionError,
    })
  }

  fetchPromotionActionSuccess = (promotions) => {
    if(promotions.length === 0) {
      this.setState({hasMore: false, isLoading: false})
    }
  }

  fetchPromotionActionError = (error) => {
    this.setState({isLoading: false})
    Toast.fail(error)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nearbyPromList !== this.props.nearbyPromList) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.nearbyPromList),
      });
    }
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

  }

  calculateDistance(geo) {
    let distance = getDistanceFromLatLonInKm(LOCATION.latitude, LOCATION.longitude, geo[0], geo[1])
    distance = distance.toFixed(2)
    if(distance < 1.0) {
      return distance * 1000 + "米"
    }
    return distance + "km"
  }

  onEndReached = (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    this.setState({isLoading: true})
    const {fetchPromotionAction, nearbyPromList} = this.props
    const geo = nearbyPromList[nearbyPromList.length - 1].geo
    const lastDistance = getDistanceFromLatLonInKm(LOCATION.latitude, LOCATION.longitude, geo[0], geo[1])
    fetchPromotionAction({
      geo: {
        latitude: LOCATION.latitude,
        longitude: LOCATION.longitude,
      },
      limit: 10,
      lastDistance: lastDistance,
      nowDate: new Date('2016-09-01'),
      isRefresh: false,
      success: this.fetchPromotionActionSuccess,
      error: this.fetchPromotionActionError,
    })
  }

  render() {
    const {dataSource} = this.state
    const row = (rowData, sectionID, rowID) => {
      console.log("rowData", rowData)
      return (
        <div key={rowID} className={styles.promContainer}>
          <div className={styles.cover}>
            <img src={rowData.goods.coverPhoto} alt="" style={{display: `block`, width: `2.0rem`, height: `2.0rem`}}/>
          </div>
          <div className={styles.details}>
            <div className={styles.goodsName}>{rowData.goods.goodsName}</div>
            <div className={styles.shopName}>
              {rowData.shop.shopName}
            </div>
            <div className={styles.goodsTrip}>
              <div className={styles.label}>{rowData.type}</div>
            </div>
            <div className={styles.goodsPrice}>
              <p>{"¥ " + rowData.goods.price}</p>
            </div>
          </div>
          <div className={styles.trips}>
            <div>{this.calculateDistance(rowData.geo)}</div>
          </div>
        </div>
      )
    }
    return(
      <div>
        <ListView
          dataSource={dataSource}
          renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
            {this.state.isLoading ? '加载中...' : '全部加载成功'}
          </div>)}
          renderRow={row}
          useBodyScroll
          onEndReached={this.onEndReached}
          onEndReachedThreshold={50}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const nearbyPromList = promotionSelector.selectNearbyPromotion(state)
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