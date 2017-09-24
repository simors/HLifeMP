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

const {
  Panel
} = WeUI

class PromoterPerformanceItem extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    let {friend} = this.props
    console.log('friend', friend)
    return (
      <Panel className={styles.itemPanel}>
        <div style={{paddingRight: 8}}>
          <Avatar src="http://img1.imgtn.bdimg.com/it/u=4165490297,2822026681&fm=214&gp=0.jpg" size={45}/>
        </div>
        <div style={{flex: 1}}>
          <div className={styles.teamView}>
            <div>
              <div className={styles.nameText}>名字</div>
              <div className={styles.performText}>最新业绩：一天前</div>
            </div>
            <div>
              <img src={require('../../../asset/svg/team_18@2x.svg')} width={24} height={24} />
              <div className={styles.teamnum}>88人</div>
            </div>
          </div>
          <div className={styles.performView}>
            <div className={styles.titleText}>总业绩</div>
            <div className={styles.earnText}>44334.00</div>
          </div>
        </div>
      </Panel>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PromoterPerformanceItem))
