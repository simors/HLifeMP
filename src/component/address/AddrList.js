/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './addrList.module.scss'
import Avatar from '../../component/avatar'
import {Button, WingBlank, List, Toast} from 'antd-mobile'
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
    this.props.fetchMyAddr({isRefresh: true})
  }

  componentWillReceiveProps(newProps) {

  }

  deleteAddr(addrId) {
    let payload = {
      addrId: addrId,
      success: ()=> {
        // this.props.fetchMyAddr({isRefresh: true})
      },
      error: (err)=> {
        Toast.fail(err.message)
      }

    }
    this.props.disableMyAddr(payload)
  }

  defaultAddr(addrId) {
    let payload = {
      addrId: addrId,
      success: ()=> {
        this.props.fetchMyAddr({isRefresh: true})
      },
      error: (err)=> {
        Toast.fail(err.message)
      }

    }
    this.props.setDefaultAddr(payload)
  }

  renderAddrList() {
    let {addrList} = this.props
    if (addrList && addrList.length > 0) {
      let addrViewList = addrList.map((item, key)=> {
        return <div key={key} className={styles.blankWrap}><AddrShow
          deleteAddr={()=> {
            this.deleteAddr(item.id)
          }}
          addr={item}
          defaultAddr={()=> {
            this.defaultAddr(item.id)
          }}
        /></div>
      })
      return addrViewList
    } else {
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