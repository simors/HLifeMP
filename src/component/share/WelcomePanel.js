/**
 * Created by yangyang on 2017/9/30.
 */
import React from 'react'
import { Button, Icon } from 'antd-mobile'
import appConfig from '../../util/appConfig'
import styles from './welcomepanel.module.scss'

export default class WelcomePanel extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  close = (e) => {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render() {
    return (
      <div className={styles.welcomePanel}>
        <div className={styles.closeBtn} onClick={this.close}>
          <Icon type={require('../../asset/svg/close@16x.svg')} />
        </div>
        <div onClick={() => document.location=appConfig.APP_DOWNLOAD_URL}>
          <img className={styles.welcomeImg} src={require('../../asset/image/shop_in@16x.png')} />
        </div>
        <div className={styles.handStyle} onClick={() => document.location=appConfig.APP_DOWNLOAD_URL}>
          <Icon type={require('../../asset/svg/click@16x.svg')} />
          <div style={{color: '#fff', paddingTop: 10}}>点击了解详情</div>
        </div>
      </div>
    )
  }
}