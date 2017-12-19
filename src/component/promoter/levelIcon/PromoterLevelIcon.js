/**
 * Created by yangyang on 2017/9/22.
 */
import React from 'react'
import styles from './levelIcon.module.scss'
import {Icon} from 'antd-mobile'

const level = ['少尉', '中尉', '上尉', '少校', '中校', '上校', '大校', '少将', '中将', '上将', '少帅', '中帅', '大帅']

export default class PromoterLevelIcon extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.levelText}>当前等级</div>
        <div>
          <img src={require('../../../asset/image/vip.png')} width={32} height={32}/>
        </div>
        <div className={styles.levelText}>{level[this.props.level-1]}</div>
      </div>
    )
  }
}