/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Avatar from '../../component/avatar'
import styles from './orderList.module.scss'
import {Button, WingBlank, List, ListView, Toast} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from '../../route/Mine'
import Loading from '../../component/loading'
import OrderShow from './OrderShow'


let {Item} = List
class OrderAllList extends React.PureComponent {
  constructor(props) {
    super(props)
    // const dataSource = new ListView.DataSource({
    //   rowHasChanged: (row1, row2) => row1 !== row2,
    // });
    this.state = {
      isLoading: true,
      hasMore: true,
      checkedRowID: undefined,
    };
  }

  componentWillMount() {
    this.props.fetchUserOrderList({
      type: 'all',
      limit: 10,
      buyerId: this.props.userId,
      isRefresh: true,
      success: this.fetchOrderActionSuccess,
      error: this.fetchOrderActionError,
    })

  }

  fetchOrderActionSuccess = (promotions) => {
    console.log('alll======>promotions======>', promotions)
    if (promotions && promotions.length === 0) {
      this.setState({hasMore: false, isLoading: false})
    }else{
      this.setState({isLoading: false})
    }
  }

  fetchOrderActionError = (error) => {
    this.setState({isLoading: false},()=>{Toast.fail(error)})
  }

  componentDidMount() {

  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.orderList !== this.props.orderList) {
  //     this.setState({
  //       dataSource: this.state.dataSource.cloneWithRows(nextProps.orderList),
  //     });
  //   }
  // }

  onEndReached = (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    this.setState({isLoading: true})
    const {fetchUserOrderList, orderList} = this.props
    let lastTime = undefined
    if (orderList && orderList.length > 0) {
      orderList[orderList.length - 1].createdAt
    }
    fetchUserOrderList({
      lastTime: lastTime,
      type: 'all',
      limit: 10,
      buyerId: this.props.userId,
      isRefresh: false,
      success: this.fetchOrderActionSuccess,
      error: this.fetchOrderActionError,
    })
  }

  setOrderStatus(buyerId, orderId, status) {
    let payload = {
      orderStatus: status,
      buyerId: buyerId,
      orderId: orderId,
    }
    this.props.setUserOrderStatus(payload)
  }

  render() {

    const row = (rowData, sectionID, rowID)=> {
      // console.log('rowData=====>',rowData,sectionID,rowID)
      // let {order} = rowData
      return <div key={rowID}><OrderShow order={rowData} setOrderStatus={(buyerId, orderId, status)=> {
        this.setOrderStatus(buyerId, orderId, status)
      }}/></div>
    }

    let {dataSource} = this.props
    return (
      <ListView
        dataSource={dataSource}
        renderFooter={() => (<div style={{padding: 30, textAlign: 'center'}}>
          {this.state.isLoading ? '加载中...' : '全部加载成功'}
        </div>)}
        renderRow={row}
        useBodyScroll
        onEndReached={this.onEndReached}
        onEndReachedThreshold={50}
      />
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let userId = authSelector.activeUserId(state)
  console.log('userId------>', userId)
  let orderList = mineSelector.selectUserOrders(state, userId, 'all')
  let dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 !== row2,
  });

  console.log('orderList=====>', orderList)
  return {
    orderList,
    userId: userId,
    dataSource: dataSource.cloneWithRows(orderList)
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderAllList))