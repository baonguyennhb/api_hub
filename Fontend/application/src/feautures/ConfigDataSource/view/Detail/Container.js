import React, { Component } from 'react'
import President from './President'
import { fetchingTableDataSource } from '../../redux/actions'
import { connect } from 'react-redux'

class Container extends Component {
  render() {
    return (
      <President {...this.props}/>
    )
  }
  componentDidMount() {
    this.props.fetchingTableDataSource()
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchingTableDataSource: () => {
      dispatch(fetchingTableDataSource())
    }
  }
}
function mapStateToProps(state) {
  return {
    dataSources: state.configDataSource
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
