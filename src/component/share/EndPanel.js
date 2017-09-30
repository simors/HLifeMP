/**
 * Created by yangyang on 2017/9/30.
 */
import React from 'react'
import * as appConfig from '../../util/appConfig'
import styles from './endpanel.module.scss'

export default class EndPanel extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.endpanel}>
        <div className={styles.focusMp} onClick={() => document.location=appConfig.FOCUS_MP_URL}>关注公众号</div>
        <div className={styles.downloadApp} onClick={() => document.location=appConfig.APP_DOWNLOAD_URL}>下载app</div>
      </div>
    )
  }
}