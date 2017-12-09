/**
 * Created by wanpeng on 2017/12/9.
 */
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import {mineAction} from '../Mine'
import styles from './submitorder.module.scss'
import {Button} from 'antd-mobile'


class SubmitOrder extends PureComponent {
  constructor(props) {
    super(props)
    document.title = "收货方式"
  }

  render() {
    return(
      <div className={styles.page}>
        <div className={styles.address}>
          <div className={styles.selfPick}>
            <div className={styles.header}>
              <img src={require('../../asset/svg/select@100x.svg')} alt="" style={{width: '0.5rem', height: '0.5rem'}}/>
              <div className={styles.title}>到店自提</div>
            </div>
            <div className={styles.shop}>
              <div className={styles.name}>绿叶水果（奥克斯广场店）</div>
              <div className={styles.address}> 湖南省长沙市岳麓区麓谷国际工业园a5栋国际工业园a5栋</div>
            </div>
          </div>
          <div className={styles.express}>
            <div className={styles.header}>
              <img src={require('../../asset/svg/select@100x.svg')} alt="" style={{width: '0.5rem', height: '0.5rem'}}/>
              <div className={styles.title}>快递</div>
              <div className={styles.selectAddr}>
                <div className={styles.selectAddrbtn}>更换地址</div>
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
          <Button className={styles.button}>提交订单</Button>
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

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SubmitOrder))