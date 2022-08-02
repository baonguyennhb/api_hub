import React, { Component } from 'react'
import { Table, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default class President extends Component {
    render() {
        const { data } = this.props.dataSources.list
        const dataSource = data.map((value, index) => {
            return {
                index: index + 1,
                key: value.dataSrcId,
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
                title: 'DATA SOURCE NAME',
                dataIndex: 'dataSrcName',
                key: 'dataSrcName',
            },
            {
                title: 'SERVER',
                dataIndex: 'server',
                key: 'server',
            },
            {
                title: 'PLANT',
                dataIndex: 'plant',
                key: 'plant',
            },
            {
                title: 'USER',
                dataIndex: 'dataSrcUser',
                key: 'dataSrcUser',
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
                <div className='title-page'>DATASOURCE MANAGERMENT</div>
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
