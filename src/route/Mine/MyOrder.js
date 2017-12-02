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

class Wallet extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '个人主页'
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

  render() {
    let {activeUser, payment} = this.props
    if (!activeUser || !payment) {
      return <Loading/>
    }
    let balance = 0.00
    if (payment.balance) {
      balance = Number(payment.balance).toFixed(2)
    }
    return (
      <div>
        <div className={styles.headerView}>
          <span>汇邻优店账号</span>
          <div className={styles.avatar}>
            <Avatar size={70} src={activeUser.avatar} />
            <span className={styles.nickname}>{activeUser.nickname}</span>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.balanceText}>{balance}</div>
          <div className={styles.balanceTip}>账户余额</div>
          <WingBlank size="md">
            <Button className={styles.balanceBtn} onClick={this.gotoWithdraw}><span style={{color: '#fff'}}>提现到微信余额</span></Button>
          </WingBlank>
        </div>
        <div className={styles.footer}>
          本服务有长沙小吉网络科技有限公司提供
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallet))/**
 * Created by lilu on 2017/12/2.
 */
