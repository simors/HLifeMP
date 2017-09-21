/**
 * Created by yangyang on 2017/9/19.
 */
import React from 'react'
import {connect} from 'react-redux'
import {Link, Route, withRouter, Switch} from 'react-router-dom'

class PromoterPerformance extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        推广页面
      </div>
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