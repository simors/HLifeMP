/**
 * Created by lilu on 2017/12/1.
 */

import React from 'react'
import { Button , Icon } from 'antd-mobile'
import * as appConfig from '../../util/appConfig'
import styles from './header.module.scss'

export default class WelcomePanel extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  renderLeft (){
    if(this.props.leftType == 'icon'){
      return (
        <div className={styles.leftBox}>
          <Icon type="left" className={styles.leftIcon}/>
        </div>
      )
    }else if(this.props.leftType == 'svg'){
      return (
        <div className={styles.leftBox}>
          <img src={require('../../asset/svg/'+this.props.leftIcon+'.svg')} />
        </div>
      )
    }


  }

  renderCenter (){
    return (
      <div className={styles.centerBox}>
        <p className={styles.titleText}>{this.props.titleText}</p>
      </div>
    )
  }

  renderRight () {
    return (
      <div className={styles.rightBox}>
        <img src={require('../../asset/svg/'+this.props.leftIcon+'.svg')} />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.headerBox}>
        {this.renderLeft()}
        {this.renderCenter()}
        {this.renderRight()}
      </div>
    )
  }
}

Header.defaultProps = {
  leftType: 'icon',
  leftIcon: 'ios-arrow-back',
  titleText: '',
  rightIcon: '',
  rightText: ''
}