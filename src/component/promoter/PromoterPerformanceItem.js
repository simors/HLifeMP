/**
 * Created by yangyang on 2017/9/21.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

class PromoterPerformanceItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>item</div>
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
