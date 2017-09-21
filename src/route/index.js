// We only need to import the modules necessary for initial render
import React from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'
import AuthRoute from './AuthRoute'
import Home from './Home'
import PromoterPerformance from './Promoter/PromoterPerformance'
import NoMatch from './NoMatch'
import ErrorPage from './Error'
import LoadingPage from './Loading'

const rootRoutes = (
  <Switch>
    <AuthRoute path="/promoter" component={PromoterPerformance}/>
    <Route path="/error" component={ErrorPage} />
    <Route path="/loading" component={LoadingPage}/>
    <AuthRoute path="/" component={Home}/>
    <Route component={NoMatch}/>
  </Switch>
)

export default rootRoutes