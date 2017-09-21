/**
 * Created by yangyang on 2017/9/21.
 */
import React from 'react'
import {connect} from 'react-redux'
import {withRouter, Redirect} from 'react-router-dom'
import {appStateSelector} from '../../util/appstate'

class LoadingPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    if (this.props.isRehydrated) {
      return (
        <Redirect to={from}/>
      )
    }

    return (
      <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>正在加载</div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let appState = appStateSelector.selectAppState(state)
  let isRehydrated = undefined
  if (appState) {
    isRehydrated = appState.isRehydrated
  }
  return {
    isRehydrated,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoadingPage));
