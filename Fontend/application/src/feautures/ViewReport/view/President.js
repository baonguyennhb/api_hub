import React, { Component } from 'react'
import { Space, Table, Col, Row, Button, Input, DatePicker, Empty } from 'antd';
import { FastForwardOutlined, FileSearchOutlined, PicLeftOutlined, PicCenterOutlined, DownloadOutlined } from '@ant-design/icons';
import './style.css'
import { AntButton } from '../../../layouts';
const { RangePicker } = DatePicker;
export default class President extends Component {
  dataReport = this.props.dataReport
  listReport = this.props.listReport
  reportObj = this.props.reportObj
  state = {
    reportName: this.props.plant.detail.reports[0]?.reportName,
    rangeTime: [],
    reportId: null
  }
  handleClickReport = (e) => {
    this.setState({ reportName: e.reportName })
    this.setState({ reportId: e.reportId })
  }
  setStateRangeTime = (range) => {
    this.setState({ rangeTime: range })
  }
  render() {
    const { plant, reports } = this.props.plant.detail
    const { column, data } = this.props.report.report
    return (
      <div className='main-container'>
        <div className='title-page'>REPORT VIEWS</div>
        <Row>
          <Col span={5}>
            <div className='container-list-report'>
              <div className='header-feauture'>
                <div className='header-title'><FileSearchOutlined className='icon' />Report List</div>
              </div>
              <div className='header-feauture-plant'>
                <div className='header-title'><PicLeftOutlined className='icon' />
                  <span className='header-plant'>Plant:</span>
                  <span className='title-name-plant'>{plant}</span>
                </div>
              </div>
              <div className='search-report'>
                <Input placeholder="Search Report" />
              </div>
              <div className='list-reports' >
                {
                  reports.map((report, index) => (
                    <Button key={report.reportId} className='report-list-btn' onClick={() => this.handleClickReport(report)}>{index + 1}. {report.reportName}</Button>
                  ))
                }
              </div>
            </div>
          </Col>
          <Col span={19}>
            <div className='container-table-report'>
              <div className='header-feauture'>
                <div className='header-title'><PicCenterOutlined className='icon' />Report Detail</div>
              </div>
              <div className='group-report-name'>
                <div className='report-name'>{this.state.reportName}</div>
              </div>
              <div className='group-date-picker'>
                <RangePicker className='date-picker' renderExtraFooter={() => 'extra footer'} onCalendarChange={(value) => this.setStateRangeTime(value)} showTime />
                <AntButton  className='btn-search' onClick={(e) => this.props.handleSearch({ reportId: this.state.reportId, rangeTime: this.state.rangeTime })}>Search</AntButton>
                <Button  className='btn-search' icon={<DownloadOutlined />} size={'middle'}>
                  Download CSV
                </Button>
                <Button  className='btn-search' icon={<DownloadOutlined />} size={'middle'}>
                  Download PDF
                </Button>
              </div>
              {
                data.length ? <div className='table-report'>
                  <Table bordered={true} columns={column} dataSource={data} scroll={{ x: 400, y: 550 }} pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }} />
                </div> :
                  <div className='empty'>
                    <Empty />
                  </div>
              }
            </div>
          </Col>
        </Row>
      </div>

    )
  }
}
