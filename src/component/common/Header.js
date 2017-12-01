/**
 * Created by lilu on 2017/12/1.
 */

import React from 'react'
import { Button } from 'antd-mobile'
import * as appConfig from '../../util/appConfig'
import styles from './header.module.scss'

export default class WelcomePanel extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  close = (e) => {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  renderLeft = (e) => {

  }

  renderCenter = (e) => {

  }

  renderRight = (e) => {

  }

  render() {
    return (
      <div className={styles.headerWrap}>
        {this.renderLeft}
        {this.renderCenter}
        {this.renderRight}
      </div>
    )
  }
}

Header.defaultProps = {
  leftType: 'icon',
  leftIconName: 'ios-arrow-back',
  title: '',
  rightType: '',
  rightText: ''
}