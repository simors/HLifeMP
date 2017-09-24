/**
 * Created by yangyang on 2017/9/22.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import PromoterPerformanceItem from '../../component/promoter/performance/PromoterPerformanceItem'
import {promoterAction} from './redux'

const {
  Page,
  InfiniteLoader,
  Cells,
} = WeUI

class PromoterFriends extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let {match} = this.props
    let level = Number(match.params.level)
    this.props.getPromoterFriends({level})
    switch (level) {
      case 1:
        document.title = "我的好友"
        break
      case 2:
        document.title = "我的熟人"
        break
      case 3:
        document.title = "我的人脉"
        break
      default:
        document.title = "我的好友"
    }
  }

  render() {
    return (
      <Page transition={true} infiniteLoader={false} ptr={false}>
        <InfiniteLoader onLoadMore={(resolve, finish) => {}}>
          <Cells style={{marginTop: 0}}>
            <PromoterPerformanceItem/>
            <PromoterPerformanceItem/>
            <PromoterPerformanceItem/>
            <PromoterPerformanceItem/>
          </Cells>
        </InfiniteLoader>
      </Page>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
  ...promoterAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PromoterFriends))