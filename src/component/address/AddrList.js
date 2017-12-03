/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './addrShow.module.scss'
import Avatar from '../../component/avatar'
import {Button, WingBlank} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector} from '../../route/Mine/redux'
import Loading from '../../component/loading'
import AddrShow from './AddrShow'

export default class AddrList extends React.PureComponent {
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
      <div >
        <AddrShow/>
      </div>
    )
  }
}



