/**
 * Created by wanpeng on 2017/12/4.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {actions as promotionActions, selector as promotionSelector} from './redux'
import {appStateAction, appStateSelector} from '../../util/appstate'
import wx from 'tencent-wx-jssdk'
import { WhiteSpace, Button, ListView, Toast, PullToRefresh } from 'antd-mobile'
import {getMobileOperatingSystem, getDistanceFromLatLonInKm} from '../../util/OSUtil'
import styles from './nearbypromotion.module.scss'

class NearbyPromotion extends PureComponent {
  constructor(props) {
    super(props)
    document.title = "附近活动"
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      location: {
        latitude: 28.22142,
        longitude: 112.8665,
      },
      dataSource,
      isLoading: true,
      hasMore: true,
      checkedRowID: undefined,
    };
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
      debug: __DEV__? true: false,
      jsApiList: ['scanQRCode', 'getLocation'],
      url: window.location.href,
      success: this.getJsApiConfigSuccess,
      error: (error) => {console.log(error)}
    })
  }

  getJsApiConfigSuccess = (configInfo) => {
    const {fetchPromotionAction} = this.props
    var that = this
    wx.config(configInfo)
    wx.ready(function () {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function (res) {
          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          fetchPromotionAction({
            geo: [latitude, longitude],
            limit: 10,
            lastDistance: undefined,
            nowDate: Date.now(),
            isRefresh: true,
            success: that.fetchPromotionActionSuccess,
            error: that.fetchPromotionActionError,
          })
          that.setState({
            location: {
              latitude: latitude,
              longitude: longitude,
            }
          })
        }
      })
    })
    wx.error(function (err) {
      console.error(err)
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.nearbyPromList !== this.props.nearbyPromList) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.nearbyPromList),
      });
    }
  }

  calculateDistance(geo) {
    let distance = getDistanceFromLatLonInKm(this.state.location.latitude, this.state.location.longitude, geo[0], geo[1])
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
    const lastDistance = getDistanceFromLatLonInKm(this.state.location.latitude, this.state.location.longitude, geo[0], geo[1])
    fetchPromotionAction({
      geo: [this.state.location.latitude, this.state.location.longitude],
      limit: 10,
      lastDistance: lastDistance,
      nowDate: Date.now(),
      isRefresh: false,
      success: this.fetchPromotionActionSuccess,
      error: this.fetchPromotionActionError,
    })
  }

  gotoPromotionDetail(rowID, goodsId) {
    let {history} = this.props
    this.setState({checkedRowID: rowID})
    setTimeout(() => {
      history.push('/promotionDetail/' + goodsId)
    }, 300)
  }

  render() {
    const {dataSource} = this.state

    const row = (rowData, sectionID, rowID) => {
      let itemStyle = {
        backgroundColor: this.state.checkedRowID === rowID? '#f5f5f5' : 'transparent'
      }
      return (
        <div key={rowID} className={styles.promContainer} style={itemStyle} onClick={() => {this.gotoPromotionDetail(rowID, rowData.goods.id)}}>
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