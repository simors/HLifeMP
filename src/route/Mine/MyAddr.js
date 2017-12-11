/**
 * Created by lilu on 2017/12/3.
 */
/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import Avatar from '../../component/avatar'
import {Button, WingBlank} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from '../../route/Mine/redux'
import Loading from '../../component/loading'
import AddrList from '../../component/address/AddrList'
import styles from './myAddr.module.scss'

export default class MyAddr extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = '收货地址管理'
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }


  render() {

    return (
      <div className={styles.body}>
        <AddrList/>
        <Button onClick={()=>{this.props.history.push('/createMyAddr')}}>新增收货地址</Button>
      </div>
    )
  }
}



