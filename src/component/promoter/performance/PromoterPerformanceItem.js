/**
 * Created by yangyang on 2017/9/21.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import styles from './performance.module.scss'
import Avatar from '../../../component/avatar'
import {authSelector} from '../../../util/auth'
import math from 'mathjs'
import {getConversationTime} from '../../../util/datetime'

const {
  Panel
} = WeUI

class PromoterPerformanceItem extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    let {friend, userInfo} = this.props
    return (
      <Panel className={styles.itemPanel}>
        <div style={{paddingRight: 8}}>
          <Avatar src={userInfo.avatar} size={45}/>
        </div>
        <div style={{flex: 1}}>
          <div className={styles.teamView}>
            <div>
              <div className={styles.nameText}>{userInfo.nickname}</div>
              <div className={styles.performText}>最新业绩：{getConversationTime(new Date(friend.updatedAt))}</div>
            </div>
            <div>
              <img src={require('../../../asset/svg/team_18@2x.svg')} width={24} height={24} />
              <div className={styles.teamnum}>{math.chain(friend.teamMemNum).add(friend.level2Num).add(friend.level3Num).done()}人</div>
            </div>
          </div>
          <div className={styles.performView}>
            <div className={styles.titleText}>总业绩</div>
            <div className={styles.earnText}>{Number(friend.royaltyEarnings + friend.shopEarnings).toFixed(2)}</div>
          </div>
        </div>
      </Panel>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let {friend} = ownProps
  let userId = friend.userId
  let userInfo = authSelector.userInfoById(state, userId).toJS()
  return {
    userInfo,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PromoterPerformanceItem))
