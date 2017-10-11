/**
 * Created by yangyang on 2017/9/30.
 */
import React from 'react'
import { Card, Button, WingBlank } from 'antd-mobile'
import * as appConfig from '../../util/appConfig'
import styles from './endpanel.module.scss'

export default class EndPanel extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  renderFocusBtn() {
    return (
      <span>
        <Button type="primary" size="small" inline onClick={() => document.location=appConfig.FOCUS_MP_URL} className={styles.focusBtn}>
          <span style={{color: '#fff'}}>关注</span>
        </Button>
      </span>
    )
  }

  render() {
    return (
      <WingBlank size="lg" className={styles.focusPanel}>
        <Card>
          <Card.Header
            title={<span style={{fontSize: '0.28rem'}}>汇邻优店公众号</span>}
            thumb={require('../../asset/image/appIcon.jpeg')}
            thumbStyle={{width: '0.8rem', borderRadius: '50%'}}
            extra={this.renderFocusBtn()}
          />
          <Card.Body>
            <div style={{fontSize: '0.24rem', color: '#F6A623'}}>好吃的、好玩的、生活实用技能都在这里，还可以开店赚钱，赶快关注哦^_^</div>
          </Card.Body>
        </Card>
      </WingBlank>
    )
  }
}