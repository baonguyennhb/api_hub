import React, { Component } from 'react'
import { Table, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default class President extends Component {
    render() {
        const { data } = this.props.reports.list
        const dataSource = data.map((value, index) => {
            return {
                index: index + 1,
                key: value.reportId,
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
                title: 'REPORT NAME',
                dataIndex: 'reportName',
                key: 'reportName',
            },
            {
                title: 'REPORT DESCRIPTION',
                dataIndex: 'reportDsc',
                key: 'reportDsc',
            },
            {
                title: 'PLANT',
                dataIndex: 'plant',
                key: 'plant',
            },
            {
                title: 'EXCUTE',
                dataIndex: 'reportExcute',
                key: 'reportExcute',
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
                <div className='title-page'>REPORT MANAGERMENT</div>
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
