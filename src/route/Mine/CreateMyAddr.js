/**
 * Created by lilu on 2017/12/3.
 */

import {createForm} from 'rc-form';

import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Avatar from '../../component/avatar'
import {Button, WingBlank, InputItem, List} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from '../../route/Mine/redux'
import Loading from '../../component/loading'
import RegionPicker from '../../component/common/RegionPicker'

import styles from './createMyAddr.module.scss'

class CreateMyAddr extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '创建收货地址'
    this.state={
      showCusInput: false,
      province: undefined,
      city: undefined,
      district: undefined,
      tag: undefined
    }
    this.customFocusInst='ttt'
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

  submit = ()=> {
    this.props.form.validateFields((error, value) => {
      let payload = {
        username: value.username,
        mobilePhoneNumber: value.mobilePhoneNumber,
        addr: value.addr,
        province: this.state.province,
        city: this.state.city,
        district: this.state.district,
        tag: this.state.tag
      }

      this.props.createMyAddr(payload)

      console.log(error, value);
    });
  }

  renderTagBox(){
    return (
      <div className={styles.tagBox}>
        <span className={styles.tagLabel}>标签</span>
        <div className={styles.tagWrap}>
          <div className={this.state.tag=='家'?styles.selectedTag:styles.tag} onClick={()=>{this.setState({tag:'家'})}}>家</div>
          <div className={this.state.tag=='公司'?styles.selectedTag:styles.tag} onClick={()=>{this.setState({tag:'公司'})}}>公司</div>
          <div className={this.state.tag=='学校'?styles.selectedTag:styles.tag} onClick={()=>{this.setState({tag:'学校'})}}>学校</div>
        </div>
      </div>
    )
  }

  render() {
    const {getFieldProps} = this.props.form;
    const {user} = this.props

    return (
      <div className={styles.body}>
        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>收货人:</span>
          <input className={styles.input} {...getFieldProps('username',{
            initialValue: user.nickname
          })}/>
        </div>
        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>联系电话:</span>
          <input className={styles.input} {...getFieldProps('mobilePhoneNumber',{
            initialValue: user.mobilePhoneNumber
          })}/>
        </div>
          <RegionPicker className = {styles.inputBox} level={3} onOk={(value)=> {
            this.setState({province: value[0], city: value[1], district: value[2]})
          }} />
        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>详细地址:</span>
          <input className={styles.input} {...getFieldProps('addr',{
            initialValue: ''
          })}/>
        </div>
        {this.renderTagBox()}


        <div className={styles.submit} onClick={this.submit}>保存</div>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let user = authSelector.activeUserInfo(state)
  let addrList = mineSelector.getUserAddressList(state)
  return {
    addrList,
    user
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(createForm()(CreateMyAddr)))




