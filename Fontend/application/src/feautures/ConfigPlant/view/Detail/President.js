import { Table, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import React, { Component } from 'react'
import './style.css'
export default class President extends Component {
  showDeleteConfirm = () => {

  }
  render() {
    const { data } = this.props.plants.list
    const dataSource = data.map((value, index) => {
      return {
        index: index + 1,
        key: value.plantId,
        ...value
      }
    })
    const columns = [
      {
        title: 'NO',
        dataIndex: 'index',
        key: 'index',
      },
      {
        title: 'PLANT ID',
        dataIndex: 'plantId',
        key: 'plantId',
      },
      {
        title: 'PLANT NAME',
        dataIndex: 'plantName',
        key: 'plantName',
      },
      {
        title: 'PLANT ADDRESS',
        dataIndex: 'plantAddress',
        key: 'plantAddress',
      },
      {
        title: 'ACTION',
        key: 'action',
        render: (record) => (
          <Space size="middle">
            <Tooltip title={'Edit'}>
              <EditOutlined onClick={() => {
                // setFactoryrecord(record)
                // showEdit()
              }} />
            </Tooltip>
            <Tooltip title={'Delete'}>
              <DeleteOutlined onClick={(e) => this.showDeleteConfirm(record)} />
            </Tooltip>
          </Space>
        ),
      },
    ];
    return (
      <div className='main-container'>
        <div className='title-page'>PLANT MANAGERMENT</div>
        <div className='container-table'>
          <Tooltip color={'green'} title={'Insert Plant'}>
            <Button className={'btn-create'}>
              +
            </Button>
          </Tooltip>

          <Table columns={columns} dataSource={dataSource} />
        </div>
      </div>
    )
  }
}
