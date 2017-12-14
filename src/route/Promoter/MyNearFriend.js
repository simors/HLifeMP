/**
 * Created by yangyang on 2017/9/25.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import Avatar from '../../component/avatar'
import {getConversationTime} from '../../util/datetime'
import styles from './promoter.module.scss'
import math from 'mathjs'
import {promoterSelector} from './redux'
import {authSelector} from '../../util/auth'
import {Icon} from 'antd-mobile'

const {
  Panel
} = WeUI

class MyNearFriend extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = "我的密友"
  }

  render() {
    let {upPromoter, upUser} = this.props
    return (
      <Panel className={styles.itemPanel}>
        <div style={{paddingRight: 16}}>
          <Avatar src={upUser.avatar} size={70}/>
        </div>
        <div style={{flex: 1}}>
          <div className={styles.teamView}>
            <div>
              <div className={styles.nameText}>{upUser.nickname}</div>
              <div className={styles.performText}>最新业绩：{getConversationTime(new Date(upPromoter.updatedAt))}</div>
            </div>
            <div>
              <Icon type={require('../../asset/svg/team_18@2x.svg')} width={48} height={48} />
              <div className={styles.teamnum}>{math.chain(upPromoter.teamMemNum).add(upPromoter.level2Num).add(upPromoter.level3Num).done()}人</div>
            </div>
          </div>
          <div className={styles.performView}>
            <div className={styles.titleText}>总业绩</div>
            <div className={styles.earnText}>{Number(upPromoter.royaltyEarnings + upPromoter.shopEarnings).toFixed(2)}</div>
          </div>
        </div>
      </Panel>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let upUser = undefined
  let upPromoterId = promoterSelector.getUpPromoterId(state)
  let upPromoter = promoterSelector.getPromoterById(state, upPromoterId)
  if (upPromoter) {
    upUser = authSelector.userInfoById(state, upPromoter.userId).toJS()
  }
  return {
    upPromoter,
    upUser,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyNearFriend))