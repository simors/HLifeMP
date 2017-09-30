/**
 * Created by yangyang on 2017/9/30.
 */
import React from 'react'
import { Button } from 'antd-mobile'
import * as appConfig from '../../util/appConfig'
import styles from './welcomepanel.module.scss'

export default class WelcomePanel extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.welcomePanel}>
        <Button onClick={() => document.location=appConfig.APP_DOWNLOAD_URL} >我也要开店</Button>
      </div>
    )
  }
}