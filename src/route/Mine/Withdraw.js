/**
 * Created by yangyang on 2017/10/4.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Button, WingBlank, InputItem, Modal } from 'antd-mobile'
import { createForm } from 'rc-form'
import styles from './withdraw.module.scss'
import {mineSelector, mineAction} from './redux'
import {authSelector} from '../../util/auth'
import './customInputStyle.css'
import Loading from '../../component/loading'

class Withdraw extends React.PureComponent{
  constructor(props) {
    super(props)
    this.state = {
      money: '',
      showModel: false,
      tips: '',
    }
    document.title = '提现到微信余额'
  }

  withdrawPress = () => {
    let amount = this.state.money
    if (isNaN(amount)) {
      this.setState({tips: '请输入数字', showModel: true})
      return
    }
    let {payment, activeUser} = this.props
    let balance = Number(payment.balance).toFixed(2)
    var freeAmount = Number(amount) * 0.01 < 1? 1: Number(amount) * 0.01
    var precision = 0
    if(amount.indexOf('.') > 0) {
      precision = amount.split('.')[1].length
    }
    if(Number(amount) <= 0 ) {
      this.setState({tips: '金额有误', showModel: true})
      return
    }
    if(Number(amount) > balance) {
      this.setState({tips: '余额不足', showModel: true})
      return
    }
    if(Number(amount) + freeAmount > balance ) {  //扣除手续费后余额不足
      this.setState({tips: '扣除手续费后余额不足', showModel: true})
      return
    }
    if(precision >2) {
      this.setState({tips: '提现金额只支持小数点后两位', showModel: true})
      return
    }
    
    let payload = {
      amount: amount,
      openid: activeUser.openid,
      userId: activeUser.id,
      nickname: activeUser.nickname,
      success: () => {this.setState({tips: '提现金额24小时内到账，汇邻优店账户余额将在到账后更新', showModel: true})},
      error: () => {this.setState({tips: '提现申请失败，请稍后再试', showModel: true})},
    }
    this.props.withdrawRequest(payload)
  }

  renderModel(content) {
    return (
      <Modal
        title="提示信息"
        transparent
        maskClosable={true}
        visible={this.state.showModel}
        footer={[{ text: '确定', onPress: () => { this.setState({showModel: false}) } }]}
        style={{width: '100%', paddingLeft: 10, paddingRight: 10, fontSize: '1rem'}}
      >
        {content}
      </Modal>
    )
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
    const { getFieldProps } = this.props.form;
    return (
      <div style={{height: '100vh', backgroundColor: '#f5f5f9'}}>
        <div className={styles.withdrawInput}>
          <div style={{paddingLeft: 8, paddingTop: 10}}>提现金额</div>
          <InputItem
            {...getFieldProps('money', {})}
            placeholder="0.00"
            value={this.state.money}
            maxLength={10}
            labelNumber={1}
            clear
            locale={{ confirmLabel: '提现' }}
            onChange={(value) => this.setState({money: value})}
            style={{minHeight: '1.6rem', height: '1.6rem'}}
          >
            ¥
          </InputItem>
          <div style={{paddingLeft: 8, marginTop: 15}}>当前余额：{balance}元
            <div style={{fontSize: '0.2rem', color: '#ddd'}}>平台将收取1.0%的手续费，最少1.0元</div>
          </div>
        </div>
        <WingBlank size="md">
          <Button className={styles.withdrawBtn} onClick={this.withdrawPress}><span style={{color: '#fff'}}>提现</span></Button>
        </WingBlank>
        {this.renderModel(this.state.tips)}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let activeUser = authSelector.activeUserInfo(state).toJS()
  let payment = mineSelector.selectPayment(state)
  return {
    activeUser,
    payment,
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(createForm()(Withdraw)))