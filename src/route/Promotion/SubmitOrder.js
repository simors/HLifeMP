/**
 * Created by wanpeng on 2017/12/9.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {mineAction} from '../Mine'
import {actions} from './redux'
import styles from './submitorder.module.scss'
import {Button} from 'antd-mobile'
import pingpp from 'pingpp-js'
import {Toast} from 'antd-mobile'


class SubmitOrder extends PureComponent {
  constructor(props) {
    super(props)
    document.title = "收货方式"
    this.state = {
      checked: 'selfPick',
    }
  }

  gotoSelectAddress = () => {
    const {history, location} = this.props
    const {state} = location
    var {metadata} = state
    history.push('/selectAddress', {metadata: metadata})
  }

  onSubmit = () => {
    const {createPaymentRequest, location } = this.props
    const {state} = location
    var {metadata} = state
    console.log("metadata", metadata)

    // createPaymentRequest({
    //   amount: 10,
    //   metadata: metadata || {},
    //   subject: "汇邻优店",
    //   success: this.createPaymentSuccessCallback,
    //   error: this.createPaymentErrorCallback,
    // })
  }
  createPaymentSuccessCallback = (charge) => {
    const {history} = this.props
    pingpp.createPayment(charge, function (result, err) {
      if (result == "success") {
        Toast.success("支付成功", 1)
        history.replace('/mine')
      } else if (result == "fail") {
        Toast.fail("支付失败", 2)
      } else if (result == "cancel") {
        Toast.info("取消支付", 1)
      }
    })
  }
  createPaymentErrorCallback = (error) => {
    Toast.fail("创建支付请求失败")
  }

  render() {
    console.log("props", this.props)
    return(
      <div className={styles.page}>
        <div className={styles.address}>
          <div className={styles.selfPick}>
            <div className={styles.header}>
              <img src={this.state.checked === 'selfPick'? require('../../asset/svg/selected@100x.svg') : require('../../asset/svg/select@100x.svg')} alt=""
                   style={{width: '0.5rem', height: '0.5rem'}} onClick={() => {this.setState({checked: 'selfPick'})}}/>
              <div className={styles.title}>到店自提</div>
            </div>
            <div className={styles.shop}>
              <div className={styles.name}>绿叶水果（奥克斯广场店）</div>
              <div className={styles.address}> 湖南省长沙市岳麓区麓谷国际工业园a5栋国际工业园a5栋</div>
            </div>
          </div>
          <div className={styles.express}>
            <div className={styles.header}>
              <img src={this.state.checked === 'express'? require('../../asset/svg/selected@100x.svg') : require('../../asset/svg/select@100x.svg')} alt=""
                   style={{width: '0.5rem', height: '0.5rem'}} onClick={() => {this.setState({checked: 'express'})}}/>
              <div className={styles.title}>快递</div>
              <div className={styles.selectAddr}>
                <div className={styles.selectAddrbtn} onClick={this.gotoSelectAddress}>更换地址</div>
              </div>
            </div>
            <div className={styles.userAddress}>
              <div className={styles.nameInfo}>
                <div className={styles.name}>陈梅</div>
                <div className={styles.phone}>15874925604</div>
                <div className={styles.tag}>家</div>
              </div>
              <div className={styles.address}>湖南省长沙市岳麓区麓谷国际工业园a5栋国际工业园a5栋国际工业园a5栋</div>
            </div>
          </div>
        </div>
        <div className={styles.submit}>
          <Button className={styles.button} onClick={this.onSubmit}>提交订单</Button>
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
  ...mineAction,
  ...actions,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubmitOrder))