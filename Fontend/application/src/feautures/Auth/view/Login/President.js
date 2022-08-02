import React, {Component} from 'react';
import {Link} from "react-router-dom"
import {Form, Input} from "antd";
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {AntButton, AntFormItem,} from "../../../../layouts";

class President extends Component {
    render() {
        return (
            <div className="feature-login">
                <Form
                    onFinish={(data => this.props.handleLogin(data))}
                >
                    <AntFormItem
                        // errors={errors.username}
                        name="username"
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon"/>}
                            placeholder="Tài khoản"
                        />
                    </AntFormItem>
                    <AntFormItem
                        // errors={errors.password}
                        name="password"
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="Mật khẩu"
                        />
                    </AntFormItem>
                    <AntButton type="primary"
                               htmlType="submit"
                               block={true}
                            //    loading={this.props.loading}
                    >
                        Đăng nhập
                    </AntButton>
                </Form>
                <div className="form-option">
                    Không có tài khoản? <Link to={'/register'}>Đăng ký</Link>
                </div>
            </div>
        )
    }
}

export default President;