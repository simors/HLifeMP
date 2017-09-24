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
import {promoterAction, promoterSelector} from './redux'

const {
  Page,
  InfiniteLoader,
  Cells,
} = WeUI

class PromoterFriends extends React.PureComponent {
  constructor(props) {
    super(props)
    this.friendLabel = ""
  }

  componentDidMount() {
    let {match} = this.props
    let level = Number(match.params.level)
    this.props.getPromoterFriends({level})
    switch (level) {
      case 1:
        this.friendLabel = "好友"
        break
      case 2:
        this.friendLabel = "熟人"
        break
      case 3:
        this.friendLabel = "人脉"
        break
      default:
        this.friendLabel = "好友"
    }
    document.title = "我的" + this.friendLabel
  }

  renderFriendRow() {
    let {friends} = this.props
    if (!friends || friends.length == 0) {
      return <div>您暂时还没有{this.friendLabel}</div>
    }
    return (
      friends.map((friend, index) => {
        return <PromoterPerformanceItem key={index} friend={friend} />
      })
    )
  }

  render() {
    return (
      <Page transition={true} infiniteLoader={false} ptr={false}>
        <InfiniteLoader onLoadMore={(resolve, finish) => {}}>
          <Cells style={{marginTop: 0}}>
            {this.renderFriendRow()}
          </Cells>
        </InfiniteLoader>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let {match} = ownProps
  let level = Number(match.params.level)
  let friends = promoterSelector.selectPromoterFriends(state, level)
  return {
    friends,
  }
}

const mapDispatchToProps = {
  ...promoterAction,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PromoterFriends))