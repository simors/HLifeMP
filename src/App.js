import React from 'react'
import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import rootRoutes from './route'
import {updateProvincesAndCities} from './util/configUtils'
import {connect} from 'react-redux'

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  shouldComponentUpdate () {
    return false
  }

  componentDidMount() {
    updateProvincesAndCities()
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={this.props.history}>
          {rootRoutes}
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App
