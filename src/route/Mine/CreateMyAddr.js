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
    this.state={showCusInput: false}
    this.customFocusInst='ttt'
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

  submit = ()=> {
    this.props.form.validateFields((error, value) => {
      console.log(error, value);
    });
  }

  render() {
    const {getFieldProps} = this.props.form;

    return (
      <div className={styles.body}>
        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>收货人:</span>
          <input className={styles.input} {...getFieldProps('username',{
            initialValue: ''
          })}/>
        </div>
        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>联系电话:</span>
          <input className={styles.input} {...getFieldProps('mobilePhoneNumber',{
            initialValue: ''
          })}/>
        </div>
          <RegionPicker className = {styles.inputBox} level={3} onOk={(value)=>{console.log('value=->',value)}} />
        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>详细地址:</span>
          <input className={styles.input} {...getFieldProps('addr',{
            initialValue: ''
          })}/>
        </div>
        <div className = {styles.inputBox} onClick={()=>{this.setState({showCusInput: true})
          this.customFocusInst.focus()
        }}>
          a那我一下
          </div>
        {this.state.showCusInput?<div className = {styles.inputBox}>
          <InputItem
            {...getFieldProps('tag', {})}
            maxLength={10}
            labelNumber={3}
            clear
            locale={{ confirmLabel: '提现' }}
            style={{minHeight: '0.34rem', height: '0.34rem'}}
            className={styles.input}
          >
            标签：
          </InputItem>
        </div>:null}


        <Button onClick={this.submit}>保存</Button>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let addrList = mineSelector.getUserAddressList(state)
  return {
    addrList,
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(createForm()(CreateMyAddr)))




