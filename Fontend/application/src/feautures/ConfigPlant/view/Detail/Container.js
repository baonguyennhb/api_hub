import React, { Component } from 'react'
import President from './President'
import { fetchingTablePlant } from '../../redux'
import { connect } from 'react-redux'

class Container extends Component {
  render() {
    return (
      <President {...this.props}/>
    )
  }
  componentDidMount() {
    this.props.fetchingTablePlant()
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchingTablePlant: () => {
      dispatch(fetchingTablePlant())
    }
  }
}
function mapStateToProps(state) {
  return {
    plants: state.configPlant
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Container)