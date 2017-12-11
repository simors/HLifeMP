/**
 * Created by lilu on 2017/12/2.
 */

import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './mine.module.scss'
import Avatar from '../../component/avatar'
import { Button, WingBlank } from 'antd-mobile'
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
    history.push('/about')
  }

  render() {
    let {activeUser} = this.props
    if (!activeUser ) {
      return <Loading/>
    }
    // let activeUser = {}
    return (
      <div style={{backgroundColor:'rgba(0,0,0,0.05)'}}>
        <div className={styles.headerView}>
            <img className={styles.avatar} src={(activeUser&&activeUser.avatar)?activeUser.avatar:require('../../asset/svg/user.svg')} />
          <span className={styles.nickname}>{activeUser.nickname}</span>
        </div>
        <div className={styles.body}>
          <Button className={styles.ButtonWrap} onClick={this.gotoWallet}>
            <div className={styles.leftBox}>
              <img src={require('../../asset/svg/wallet_icon@100x.svg')} className={styles.image}/>
              <span className={styles.text}>钱包</span>
            </div>
            <div className={styles.rightBox}>
              <img src={require('../../asset/svg/Chevron.svg')} className={styles.icon}/>
            </div>
          </Button>
          <Button className={styles.ButtonWrap} onClick={this.gotoOrder}>
            <div className={styles.leftBox}>
              <img src={require('../../asset/svg/order_icon@100x.svg')} className={styles.image}/>
              <span className={styles.text}>我的订单</span>
            </div>
            <div className={styles.rightBox}>
              <img src={require('../../asset/svg/Chevron.svg')} className={styles.icon}/>
            </div>
          </Button>
          <Button className={styles.ButtonWrap} onClick={this.gotoAddr}>
            <div className={styles.leftBox}>
              <img src={require('../../asset/svg/address_icon@100x.svg')} className={styles.image}/>
              <span className={styles.text}>地址管理</span>
            </div>
            <div className={styles.rightBox}>
              <img src={require('../../asset/svg/Chevron.svg')} className={styles.icon}/>
            </div>
          </Button>

        </div>
        <div className={styles.body}>
          <Button className={styles.ButtonWrap} onClick={this.gotoAbout}>
            <div className={styles.leftBox}>
              <img src={require('../../asset/svg/about_icon@100x.svg')} className={styles.image}/>
              <span className={styles.text}>关于汇邻优店</span>
            </div>
            <div className={styles.rightBox}>
              <img src={require('../../asset/svg/Chevron.svg')} className={styles.icon}/>
            </div>
          </Button>
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