/**
 * Created by yangyang on 2017/9/19.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import styles from './promoter.module.scss'
import PromoterLevelIcon from '../../component/promoter/levelIcon/PromoterLevelIcon'

const {
  Page,
  Cells,
  CellsTitle,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
} = WeUI

class PromoterPerformance extends React.Component {
  constructor(props) {
    super(props)
    document.title = "我的邻友"
  }

  friendCellClick(level) {
    let {history} = this.props
    history.push('/friends/' + level)
  }

  render() {
    return (
      <Page transition={true} infiniteLoader={false} ptr={false}>
        <div className={styles.performanceHeader}>
          <div className={styles.userLevel}>
            <PromoterLevelIcon level={2}/>
          </div>
          <div className={styles.headerText}>推广总收益</div>
          <div className={styles.headerEarn}>¥1000.55</div>
        </div>
        <CellsTitle>我的邻友 | 20人</CellsTitle>
        <Cells>
          <Cell access={true} onClick={() => this.friendCellClick(1)}>
            <CellHeader>
              <img src={require('../../asset/svg/friend01@2x.svg')} alt="" style={{display: `block`, width: `20px`, marginRight: `5px`}}/>
            </CellHeader>
            <CellBody>
              好友
            </CellBody>
            <CellFooter>
              99
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
              99
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
              99
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

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PromoterPerformance))