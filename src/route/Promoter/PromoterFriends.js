/**
 * Created by yangyang on 2017/9/22.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

class PromoterFriends extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    let {match} = this.props
    return (
      <div>friends level {match.params.level}</div>
    )
  }
}

const mapStateToProps = (appState, ownProps) => {
  return {
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PromoterFriends))