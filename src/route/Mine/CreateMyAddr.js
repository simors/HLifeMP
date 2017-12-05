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

import styles from './createMyAddr.module.scss'

class CreateMyAddr extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '创建收货地址'
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
        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>详细地址:</span>
          <input className={styles.input} {...getFieldProps('addr',{
            initialValue: ''
          })}/>
        </div>

        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>标签:</span>
          <input className={styles.input} {...getFieldProps('tag',{
            initialValue: ''
          })}/>
        </div>
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




