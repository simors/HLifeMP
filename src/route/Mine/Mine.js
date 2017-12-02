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
    let {activeUser} = this.props
    if (activeUser) {
      this.props.getPaymentInfo({userId: activeUser.id})
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.activeUser != newProps.activeUser) {
      this.props.getPaymentInfo({userId: newProps.activeUser.id})
    }
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
    let {activeUser, payment} = this.props
    if (!activeUser || !payment) {
      return <Loading/>
    }
    return (
      <div>
        <div className={styles.headerView}>
          <div className={styles.avatar}>
            <Avatar size={70} src={activeUser.avatar} />
          </div>
          <span className={styles.nickname}>{activeUser.nickname}</span>
        </div>
        <div className={styles.body}>
          <Button className={styles.ButtonWrap} onClick={this.gotoWallet}>
            <div className={styles.leftBox}>
              <img src={require('../../asset/svg/wallet_icon@100x.svg')} className={styles.image}/>
              <p calssName={styles.text}>钱包</p>
            </div>
            <div className={styles.rightBox}>
              <img src={require('../../asset/svg/Chevron.svg')} className={styles.icon}/>
            </div>
          </Button>
          <Button className={styles.ButtonWrap} onClick={this.gotoOrder}>
            <div className={styles.leftBox}>
              <img src={require('../../asset/svg/order_icon@100x.svg')} className={styles.image}/>
              <p calssName={styles.text}>我的订单</p>
            </div>
            <div className={styles.rightBox}>
              <img src={require('../../asset/svg/Chevron.svg')} className={styles.icon}/>
            </div>
          </Button>
          <Button className={styles.ButtonWrap} onClick={this.gotoAddr}>
            <div className={styles.leftBox}>
              <img src={require('../../asset/svg/address_icon@100x.svg')} className={styles.image}/>
              <p calssName={styles.text}>地址管理</p>
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
              <p calssName={styles.text}>关于汇邻优店</p>
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
  let payment = mineSelector.selectPayment(state)
  return {
    activeUser,
    payment,
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Mine))