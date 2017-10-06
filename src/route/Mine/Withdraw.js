/**
 * Created by yangyang on 2017/10/4.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Button, WingBlank, InputItem, Modal } from 'antd-mobile'
import { createForm } from 'rc-form'
import styles from './withdraw.module.scss'
import {mineSelector} from './redux'
import {authSelector} from '../../util/auth'

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
    let {payment} = this.props
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
      this.setState({tips: '平台将收取1.0%的手续费，最少1.0元', showModel: true})
      return
    }
    if(precision >2) {
      this.setState({tips: '提现金额只支持小数点后两位', showModel: true})
      return
    }
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
            labelNumber={1}
            locale={{ confirmLabel: '提现' }}
            onChange={(value) => this.setState({money: value})}
            style={{minHeight: '5rem', height: '5rem'}}
          >
            ¥
          </InputItem>
          <div style={{paddingLeft: 8, marginTop: 5}}>当前余额：{Number(payment.balance).toFixed(2)}元</div>
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