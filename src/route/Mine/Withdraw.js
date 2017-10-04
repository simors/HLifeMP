/**
 * Created by yangyang on 2017/10/4.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Button, WingBlank, InputItem } from 'antd-mobile'
import { createForm } from 'rc-form'
import styles from './withdraw.module.scss'
import {mineSelector} from './redux'
import {authSelector} from '../../util/auth'

class Withdraw extends React.PureComponent{
  constructor(props) {
    super(props)
    this.state = {
      money: 0,
    }
    document.title = '提现到微信余额'
  }

  render() {
    let {activeUser, payment} = this.props
    if (!activeUser || !payment) {
      return <div>正在加载数据...</div>
    }
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <div className={styles.withdrawInput}>
          <div style={{paddingLeft: 8, paddingTop: 10}}>提现金额</div>
          <InputItem
            {...getFieldProps('money', {})}
            placeholder="0.00"
            value={this.state.money}
            maxLength={10}
            type="money"
            locale={{ confirmLabel: '提现' }}
            onChange={(value) => this.setState({money: value})}
          >
            ¥
          </InputItem>
          <div style={{paddingLeft: 8, marginTop: 5}}>当前余额：{Number(payment.balance).toFixed(2)}元</div>
        </div>
        <WingBlank size="md">
          <Button className={styles.withdrawBtn}><span style={{color: '#fff'}}>提现</span></Button>
        </WingBlank>
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
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(createForm()(Withdraw)))