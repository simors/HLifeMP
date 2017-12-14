/**
 * Created by lilu on 2017/12/3.
 */


import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import styles from './addrShow.module.scss'
import Avatar from '../../component/avatar'
import {Button, WingBlank, Icon} from 'antd-mobile'
import {authSelector} from '../../util/auth'
import {mineAction, mineSelector,mineConfig} from '../../route/Mine/redux'
import Loading from '../../component/loading'

 class AddrShow extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  componentWillReceiveProps(newProps) {

  }

   updateAddr(addrId) {
     let {history} = this.props
     setTimeout(() => {
       history.push('/updateMyAddr/' + addrId)
     }, 300)
   }


  render() {
    let { addr} = this.props

    //
    // let addr = {
    //   username: 'asdasd',
    //   mobilePhoneNumber: '123123123',
    //   tag: '家',
    //   addr: 'asdasdasdasdasdasdasd'
    // }



    return (
      <div className={styles.body}>
        <div className={styles.userInfoBox}>
          <span className={styles.username}>{addr.username}</span>
          <span className={styles.phone}>{addr.mobilePhoneNumber}</span>
          <div className={styles.tagBox}>
            <span className={styles.tag}>{addr.tag}</span>
          </div>
        </div>
        <div className={styles.addrInfo}>
          <p className={styles.addrText}>{addr.addr}</p>

        </div>
        <div className={styles.buttonWrap}>
          <div className={styles.defaultBox} onClick={(addrId)=>{this.props.defaultAddr(addrId)}}>
            <Icon className={styles.defaultButton} type={addr.status==mineConfig.ADDR_STATUS.DEFAUT_ADDR?require('../../asset/svg/selected@100x.svg'):require('../../asset/svg/select@100x.svg')}/>
            <span className={styles.defaultText}>设为默认</span>

          </div>
          <div className={styles.editBox}>
            <Button className={styles.editButton} onClick={()=>{this.updateAddr(addr.id)}} >编辑</Button>
            <Button className={styles.editButton} onClick={()=>{this.props.deleteAddr(addr.id)}}>删除</Button>
          </div>

        </div>

      </div>
    )
  }
}


export default withRouter(AddrShow)
