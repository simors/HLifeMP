/**
 * Created by yangyang on 2017/9/19.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import math from 'mathjs'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import styles from './promoter.module.scss'
import PromoterLevelIcon from '../../component/promoter/levelIcon/PromoterLevelIcon'
import {promoterAction, promoterSelector} from './redux'

const {
  Page,
  Cells,
  CellsTitle,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
} = WeUI

class PromoterPerformance extends React.PureComponent {
  constructor(props) {
    super(props)
    document.title = "邻友圈"
  }

  componentWillMount() {
    this.props.getCurrentPromoter({
      success: () => {},
      error: () => {},
    })
  }

  friendCellClick(level) {
    let {history} = this.props
    history.push('/friends/' + level)
  }

  render() {
    let {promoter} = this.props
    if (!promoter) {
      return <div>正在加载邻友信息……</div>
    }
    return (
      <Page transition={true} infiniteLoader={false} ptr={false}>
        <div className={styles.performanceHeader}>
          <div className={styles.userLevel}>
            <PromoterLevelIcon level={promoter.level}/>
          </div>
          <div className={styles.headerText}>推广总收益</div>
          <div className={styles.headerEarn}>¥{Number(promoter.shopEarnings + promoter.royaltyEarnings).toFixed(2)}</div>
        </div>
        <CellsTitle>我的邻友 | {math.chain(promoter.teamMemNum).add(promoter.level2Num).add(promoter.level3Num).done()}人</CellsTitle>
        <Cells>
          <Cell access={true} onClick={() => this.friendCellClick(1)}>
            <CellHeader>
              <img src={require('../../asset/svg/friend01@2x.svg')} alt="" style={{display: `block`, width: `20px`, marginRight: `5px`}}/>
            </CellHeader>
            <CellBody>
              好友
            </CellBody>
            <CellFooter>
              {promoter.teamMemNum}
            </CellFooter>
          </Cell>
          <Cell access={true} onClick={() => this.friendCellClick(2)}>
            <CellHeader>
              <img src={require('../../asset/svg/friend02@2x.svg')} alt="" style={{display: `block`, width: `20px`, marginRight: `5px`}}/>
            </CellHeader>
            <CellBody>
              熟人
            </CellBody>
            <CellFooter>
              {promoter.level2Num}
            </CellFooter>
          </Cell>
          <Cell access={true} onClick={() => this.friendCellClick(3)}>
            <CellHeader>
              <img src={require('../../asset/svg/friend03@2x.svg')} alt="" style={{display: `block`, width: `20px`, marginRight: `5px`}}/>
            </CellHeader>
            <CellBody>
              人脉
            </CellBody>
            <CellFooter>
              {promoter.level3Num}
            </CellFooter>
          </Cell>
        </Cells>

        <div style={{backgroundColor: '#F5F5F5', paddingTop: 8}}>
          <Cells style={{marginTop: 0}}>
            <Cell access={true} onClick={() => {console.log('xxx')}}>
              <CellBody>
                亲密好友
              </CellBody>
              <CellFooter>
                大自然
              </CellFooter>
            </Cell>
            <Cell access={true}>
              <CellBody>
                邀请的店铺
              </CellBody>
              <CellFooter>
                99家
              </CellFooter>
            </Cell>
          </Cells>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let activePromoterId = promoterSelector.activePromoter(state)
  let promoter = promoterSelector.getPromoterById(state, activePromoterId)
  return {
    promoter,
  }
}

const mapDispatchToProps = {
  ...promoterAction
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PromoterPerformance))