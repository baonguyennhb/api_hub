import React, { Component } from 'react'
import President from './President'
import { fechingTableReport } from '../../redux/actions'
import { connect } from 'react-redux'

class Container extends Component {
  render() {
    return (
        <President {...this.props}/>
    )
  }
  componentDidMount() {
    this.props.fechingTableReport()
  }
}

function mapDispatchToProps(dispatch) {
    return {
        fechingTableReport: () => {
            dispatch(fechingTableReport())
        }
    }
}
function mapStateToProps(state) {
    return {
        reports:  state.configReport
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Container)