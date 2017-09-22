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
} = WeUI

class PromoterPerformance extends React.Component {
  constructor(props) {
    super(props)
    document.title = "我的邻友"
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