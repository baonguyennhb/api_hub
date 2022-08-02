import React, { Component } from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import './style.css'
export default class President extends Component {
    render() {
        console.log(this.props)
        return (
            <header
                className="header"
            >
                <div className='btn-toggle1'>
                    {React.createElement(this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                        className: 'trigger',
                        onClick: () => this.props.handleToggle(),
                    })}
                </div>
                <div className='title-header'>REPORT TOOL</div>
            </header>
        )
    }
}
