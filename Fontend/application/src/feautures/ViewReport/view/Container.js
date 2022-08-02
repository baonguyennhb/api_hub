import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPlantDetail } from '../../Home/redux'
import { fetchDataReport } from '../redux'
import President from './President'
class Container extends Component {
  handleSearch = (data) => {
    const params = {
      reportId: data.reportId,
      from: data.rangeTime.length ? data.rangeTime[0]._d : null ,
      to: data.rangeTime.length ? data.rangeTime[1]._d : null ,
    }
    console.log(params)
    this.props.fetchDataReport(params)
  }
  render() {
    return (
      <President {...this.props} handleSearch = {this.handleSearch}/>
    )
  }
  componentDidMount() {
    this.props.fetchPlantDetail(1060);
  }
}

function mapDispatchToProps(dispatch) {
  return  {
    fetchPlantDetail: (plantId) => {
      dispatch(fetchPlantDetail(plantId))
    },
    fetchDataReport: (plantId) => {
      dispatch(fetchDataReport(plantId))
    }
  }
}
function mapStateToProps(state) {
  return {
    plant: state.plant,
    report: state.report
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Container)
