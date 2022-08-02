import React, { Component } from 'react'
import { Layout } from 'antd';
import { Header, Slider } from "../index";
import './style.css'

export default class President extends Component {
    render() {
        return (
            <Layout style={{height:"100%"}}>
                <Header />
                <Layout>
                   <Slider/>
                    <Layout.Content
                        style={{
                            margin: '8px 16px',
                            padding: 0,
                            minHeight: '91vh',
                        }}
                    >
                        {this.props.children}
                    </Layout.Content>
                </Layout>
            </Layout>
        );
    }
}
