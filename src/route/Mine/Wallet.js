/**
 * Created by yangyang on 2017/10/4.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './wallet.module.scss'
import Avatar from '../../component/avatar'
import { Button, WingBlank } from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from './redux'

class Wallet extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let {activeUser} = this.props
    this.props.getPaymentInfo({userId: activeUser.id})
  }

  render() {
    let {activeUser, payment} = this.props
    if (!activeUser || !payment) {
      return <div>正在加载数据...</div>
    }
    return (
      <div>
        <div className={styles.headerView}>
          <span>汇邻优店账号</span>
          <div className={styles.avatar}>
            <Avatar size={30} src={activeUser.avatar} />
            <span className={styles.nickname}>{activeUser.nickname}</span>
          </div>
        </div>
        <div className={styles.balance}>
          <div className={styles.balanceText}>{Number(payment.balance).toFixed(2)}</div>
          <div className={styles.balanceTip}>账户余额</div>
          <WingBlank size="md">
            <Button className={styles.balanceBtn}><span style={{color: '#fff'}}>提现到微信余额</span></Button>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallet))