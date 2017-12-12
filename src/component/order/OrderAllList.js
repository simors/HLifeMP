/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Avatar from '../../component/avatar'
import styles from './orderList.module.scss'
import {Button, WingBlank , List,ListView,Toast} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from '../../route/Mine'
import Loading from '../../component/loading'
import OrderShow from './OrderShow'
import appConfig from '../../util/appConfig'

let {Item} = List
class OrderAllList extends React.PureComponent {
  constructor(props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource,
      isLoading: true,
      hasMore: true,
      checkedRowID: undefined,
    };
  }

  componentWillMount() {
    this.props.fetchUserOrderList({
      type:'all',
      limit: 10,
      buyerId: this.props.userId,
      isRefresh: true,
      success: this.fetchOrderActionSuccess,
      error: this.fetchOrderActionError,
    })

  }

  fetchOrderActionSuccess = (promotions) => {
    if(promotions.length === 0) {
      this.setState({hasMore: false, isLoading: false})
    }
  }

  fetchOrderActionError = (error) => {
    this.setState({isLoading: false})
    Toast.fail(error)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.orderList !== this.props.orderList) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.orderList),
      });
    }
  }

  renderAddrList(){

    let {orderList} = this.props
    // let orderList = [{
    //   vendor:{
    //     shopName:'123'
    //   },
    //   goods:{
    //     coverPhoto:'https://dn-TUVjJ5HH.qbox.me/5609d21e7198affd1cfc.jpeg',
    //     goodsName:'dd',
    //     price: 2,
    //     originalPrice: 3,
    //
    //   },
    //   id: '12',
    //   goodsAmount: 2,
    //   paid: 24,
    //   orderStatus: 1,
    //   receiver: '3213213',
    //   receiverAddr: '321321',
    //   receiverPhone: '3213213',
    //   remark: 33333,
    //   createdAt: undefined,
    //   updatedAt: undefined,
    //
    // },{
    //   vendor:{
    //     shopName:'123'
    //   },
    //   goods:{
    //     coverPhoto:'https://dn-TUVjJ5HH.qbox.me/5609d21e7198affd1cfc.jpeg',
    //     goodsName:'dd',
    //     price: 2,
    //     originalPrice: 3,
    //
    //   },
    //   id: '12',
    //   goodsAmount: 2,
    //   paid: 24,
    //   orderStatus: 1,
    //   receiver: '3213213',
    //   receiverAddr: '321321',
    //   receiverPhone: '3213213',
    //   remark: 33333,
    //   createdAt: undefined,
    //   updatedAt: undefined,
    //
    // },
    //   {
    //     vendor:{
    //       shopName:'123'
    //     },
    //     goods:{
    //       coverPhoto:'https://dn-TUVjJ5HH.qbox.me/5609d21e7198affd1cfc.jpeg',
    //       goodsName:'dd',
    //       price: 2,
    //       originalPrice: 3,
    //
    //     },
    //     id: '12',
    //     goodsAmount: 2,
    //     paid: 24,
    //     orderStatus: 1,
    //     receiver: '3213213',
    //     receiverAddr: '321321',
    //     receiverPhone: '3213213',
    //     remark: 33333,
    //     createdAt: undefined,
    //     updatedAt: undefined,
    //
    //   },]
    if(orderList && orderList.length>0){
      let orderViewList = orderList.map((item,key)=>{
        return <div key = {key} className={styles.blankWrap} ><AddrShow order={item}  /></div>
      })
      return orderViewList
    }else{
      return <div></div>
    }
  }

  onEndReached = (event) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
    this.setState({isLoading: true})
    const {fetchUserOrderList, orderList} = this.props
    const lastTime = orderList[orderList.length - 1].createdAt
    fetchUserOrderList({
      lastTime: lastTime,
      type:'all',
      limit: 10,
      buyerId: this.props.userId,
      isRefresh: false,
      success: this.fetchOrderActionSuccess,
      error: this.fetchOrderActionError,
    })
  }

  render() {

    const row=(rowData, sectionID, rowID)=>{
      let {order} = rowData
      return <div key = {rowID} className={styles.blankWrap} ><OrderShow order={order}  /></div>
    }

    let {dataSource} = this.state
    return (
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
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let user = authSelector.activeUserId(state)
  let orderList = mineSelector.selectUserOrders(state,user.id,undefined)
  return {
    orderList,
    userId:user.id
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderAllList))
