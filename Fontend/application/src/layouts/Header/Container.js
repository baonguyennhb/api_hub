import React, { Component } from 'react'
import President from './President'

export default class Container extends Component {
    state = {
        collapsed: false
    }
    handleToggle = () => {
        console.log("OK")
        this.setState({ collapsed: !this.state.collapsed })
    }
  render() {
    return (
      <President {...this.props} handleToggle = {this.handleToggle} collapsed = {this.state.collapsed}/>
    )
  }
}
