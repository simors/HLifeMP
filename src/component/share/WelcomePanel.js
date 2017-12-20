/**
 * Created by yangyang on 2017/9/30.
 */
import React from 'react'
import appConfig from '../../util/appConfig'
import styles from './welcomepanel.module.scss'

export default class WelcomePanel extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({showModal: true})
    }, 2000)
  }

  close = (e) => {
    this.setState({showModal: false})
  }

  render() {
    let {showModal} = this.state
    if (showModal) {
      return (
        <div className={styles.modalStyle} onClick={this.close}>
          <div className={styles.welcomePanel}>
            <div className={styles.closeBtn} onClick={this.close}>
              <img src={require('../../asset/image/close.png')} className={styles.icon} />
            </div>
            <div onClick={() => document.location=appConfig.APP_DOWNLOAD_URL}>
              <img className={styles.welcomeImg} src={require('../../asset/image/shop_in@16x.png')} />
            </div>
            <div className={styles.handStyle} onClick={() => document.location=appConfig.APP_DOWNLOAD_URL}>
              <img src={require('../../asset/image/click.png')} />
              <div style={{color: '#fff', paddingTop: 10}}>点击了解详情</div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}