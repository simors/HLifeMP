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

class UpdateMyAddr extends React.PureComponent {
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
    let {addr} = this.props

    return (
      <div className={styles.body}>
        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>收货人:</span>
          <input className={styles.input} {...getFieldProps('username',{
            initialValue: addr.username
          })}/>
        </div>
        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>联系电话:</span>
          <input className={styles.input} {...getFieldProps('mobilePhoneNumber',{
            initialValue: addr.mobilePhoneNumber
          })}/>
        </div>

        <RegionPicker selectedAddr ={[addr.province,addr.city,addr.district]} level={3} onOk={(value)=>{console.log('value=->',value)}} />
        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>详细地址:</span>
          <input className={styles.input} {...getFieldProps('addr',{
            initialValue: addr.addr
          })}/>
        </div>

        <div className = {styles.inputBox}>
          <span className={styles.inputLabel}>标签:</span>
          <input className={styles.input} {...getFieldProps('tag',{
            initialValue: addr.tag
          })}/>
        </div>
        <Button onClick={this.submit}>保存</Button>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let {match} = ownProps
  let {addrId} = match.params

  let addr = mineSelector.getUserAddress(state,addrId)

  console.log('addr=====>',addr)
  return {
    addr: addr
  }
}

const mapDispatchToProps = {
  ...mineAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(createForm()(UpdateMyAddr)))




