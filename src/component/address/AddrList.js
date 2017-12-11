/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './addrList.module.scss'
import Avatar from '../../component/avatar'
import {Button, WingBlank , List} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from '../../route/Mine'
import Loading from '../../component/loading'
import AddrShow from './AddrShow'

 class AddrList extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '收货地址管理'
  }

  componentDidMount() {
    this.props.fetchMyAddr({isRefresh:true})
  }

  componentWillReceiveProps(newProps) {

  }

  renderAddrList(){
    let {addrList} = this.props
    if((!addrList)||(addrList.length)<1){
       addrList = [{
        username: 'asdasd',
        mobilePhoneNumber: '123123123',
        tag: '家',
        addr: 'asdasdasdasdasdasdasd'
      },{
        username: 'sdd',
        mobilePhoneNumber: '123123123',
        tag: '公司',
        addr: '123123123'
      },{
        username: 'sdd',
        mobilePhoneNumber: '123123123',
        tag: '公司',
        addr: '123123123'
      },{
        username: 'sdd',
        mobilePhoneNumber: '123123123',
        tag: '公司',
        addr: '123123123'
      },{
        username: 'sdd',
        mobilePhoneNumber: '123123123',
        tag: '公司',
        addr: '123123123'
      },{
        username: 'sdd',
        mobilePhoneNumber: '123123123',
        tag: '公司',
        addr: '123123123'
      }]
    }

    if(addrList && addrList.length>0){
      let addrViewList = addrList.map((item,key)=>{
        return <div key = {key} className={styles.blankWrap} ><AddrShow addr={item}  /></div>
        })
      return addrViewList
    }else{
      return <div></div>
    }
  }


  render() {


    return (
      <div >
        <List className={styles.list}>
          {this.renderAddrList()}
          </List>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let addrList = mineSelector.getUserAddressList(state)
  return {
    addrList,
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddrList))
