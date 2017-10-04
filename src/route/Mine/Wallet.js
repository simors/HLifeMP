/**
 * Created by yangyang on 2017/10/4.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './wallet.module.scss'
import Avatar from '../../component/avatar'
import { Button, WingBlank } from 'antd-mobile'

class Wallet extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div className={styles.headerView}>
          <span>汇邻优店账号</span>
          <div className={styles.avatar}>
            <Avatar size={30} />
            <span className={styles.nickname}>迷你</span>
          </div>
        </div>
        <div className={styles.balance}>
          <div className={styles.balanceText}>¥10000.33</div>
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
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Wallet))