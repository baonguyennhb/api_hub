import React, { Component } from 'react'
import President from './President'

export default class Container extends Component {
  render() {
    return (
        <President {...this.props}/>
    )
  }
}
