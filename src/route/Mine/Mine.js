/**
 * Created by lilu on 2017/12/2.
 */

import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './mine.module.scss'
import Avatar from '../../component/avatar'
import { Button, WingBlank, Icon } from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from './redux'
import Loading from '../../component/loading'

class Mine extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '个人中心'
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

  gotoWallet = () => {
    let {history} = this.props
    history.push('/wallet')
  }

  gotoOrder = () => {
    let {history} = this.props
    history.push('/myOrder')
  }

  gotoAddr = () => {
    let {history} = this.props
    history.push('/myAddr')
  }

  gotoAbout = () => {
    let {history} = this.props
    history.push('http://simors.github.io/ljyd_blog')
  }

  renderAvatar() {
    let {activeUser} = this.props
    if(activeUser && activeUser.avatar) {
      return(
        <img className={styles.avatar} src={activeUser.avatar} alt=""/>
      )
    } else {
      return(
        <img className={styles.avatar} src={require('../../asset/image/user.png')}/>
      )
    }
  }

  render() {
    let {activeUser} = this.props
    if (!activeUser ) {
      return <Loading/>
    }
    // let activeUser = {}
    return (
      <div className={styles.mine} >
        <div className={styles.headerView}>
          <div className={styles.avatar}>
            {this.renderAvatar()}
          </div>
          <span className={styles.nickname}>{activeUser.nickname}</span>
        </div>
        <div className={styles.body}>
          <Button className={styles.ButtonWrap} onClick={this.gotoWallet}>
            <div className={styles.leftBox}>
              <img src={require('../../asset/image/wallet_icon@2x.png')} className={styles.image}/>
              <span className={styles.text}>钱包</span>
            </div>
            <div className={styles.rightBox}>
              <img src={require('../../asset/image/right.png')} className={styles.icon}/>
            </div>
          </Button>
          <Button className={styles.ButtonWrap} onClick={this.gotoOrder}>
            <div className={styles.leftBox}>
              <img src={require('../../asset/image/order_icon@2x.png')} className={styles.image}/>
              <span className={styles.text}>我的订单</span>
            </div>
            <div className={styles.rightBox}>
              <img src={require('../../asset/image/right.png')} className={styles.icon}/>
            </div>
          </Button>
          <Button className={styles.ButtonWrap} onClick={this.gotoAddr}>
            <div className={styles.leftBox}>
              <img src={require('../../asset/image/address_icon@2x.png')} className={styles.image}/>
              <span className={styles.text}>地址管理</span>
            </div>
            <div className={styles.rightBox}>
              <img src={require('../../asset/image/right.png')} className={styles.icon}/>
            </div>
          </Button>

        </div>
        <div className={styles.body}>
          <a className={styles.ButtonWrap} href='http://simors.github.io/ljyd_blog'>
            <div className={styles.leftBox}>
              <img src={require('../../asset/image/about_icon@2x.png')} className={styles.image}/>
              <span className={styles.text}>关于汇邻优店</span>
            </div>
            <div className={styles.rightBox}>
              <img src={require('../../asset/image/right.png')} className={styles.icon}/>
            </div>
          </a>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let activeUser = authSelector.activeUserInfo(state)
  // let payment = mineSelector.selectPayment(state)
  return {
    activeUser,
    // payment,
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mine))