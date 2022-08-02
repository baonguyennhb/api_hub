import React, { Component } from 'react'
import { Home } from '../feautures/Home'
import { Switch } from 'react-router-dom'
import { PublicRoutes } from './PublicRoutes'
import { PrivateRoute } from './PrivateRoutes'
import { ViewReport } from '../feautures/ViewReport'

export default class AllRoutes extends Component {
  render() {
    return (
      <Switch>
        <PrivateRoute path="/" exact={true}> <Home /></PrivateRoute>
        <PrivateRoute path="/plant" exact={true}><ViewReport /></PrivateRoute>
      </Switch>
    )
  }
}
