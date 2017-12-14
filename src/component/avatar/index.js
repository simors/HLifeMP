/**
 * Created by yangyang on 2017/9/22.
 */
import React from 'react'
import styles from './avatar.module.scss'
import {Icon} from 'antd-mobile'

export default class Avatar extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    let {src, size} = this.props
    if (!size) {
      size = 20
    }
    if (!src || src == "") {
      return (
        <div className={[styles.container, {width: size, height: size, borderRadius: size/2}]}>
          <Icon type={require('../../asset/svg/user.svg')} width={size} height={size} />
        </div>
      )
    }
    return (
      <div className={[styles.container, {width: size, height: size, borderRadius: size/2}]}>
        <img src={src} width={size} height={size} style={{borderRadius: '50%'}} />
      </div>
    )
  }
}