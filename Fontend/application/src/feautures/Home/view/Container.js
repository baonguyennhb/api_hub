import React, { Component } from 'react'
import { connect } from 'react-redux'
import { fetchPlantsOverview } from '../redux/actions'
import President from './President'
class Container extends Component {
  listPlant = [
    {
      id: '1060',
      key: '1060',
      name: 'Nhà máy Vĩnh Long',
      address: 'Tỉnh Vĩnh Long',
      reports: 10
    },
    {
      id: '1010',
      key: '1010',
      name: 'Nhà máy Long An',
      address: 'Tỉnh Long An',
      reports: 8
    },
    {
      id: '1030',
      key: '1030',
      name: 'Nhà máy Đồng Nai',
      address: 'Tỉnh Đồng Nai',
      reports: 10
    }
  ]
  render() {
    return (
      <President {...this.props} />
    )
  }

  componentDidMount() {
    this.props.fetchPlantsOverview(1060);
  }
}
function mapDispatchToProps(dispatch) {
  return {
    fetchPlantsOverview: (siteId) => {
      dispatch(fetchPlantsOverview(siteId));
    },
  }
}
function mapStateToProps(state) {
  return {
    plants: state.plant
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
