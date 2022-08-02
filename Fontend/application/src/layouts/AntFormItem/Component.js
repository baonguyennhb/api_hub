import React, {Component} from 'react';
import {Form} from "antd";

class CustomComponent extends Component {
    render() {
        const {errors, wrapperCol, name, label, initialValue, required} = this.props

        let status = "";
        let help   = "";
        if (errors !== undefined && errors !== null && errors.length > 0) {
            status = "error"
            help   = errors[0];
        }
        return (
            <Form.Item
                required={required}
                initialValue={initialValue}
                name={name}
                label={label}
                wrapperCol={wrapperCol !== undefined ? wrapperCol : null}
                validateStatus={status}
                help={help !== "" ? help : null}
                {... this.props}
            >
                {this.props.children}
            </Form.Item>
        )
    }
}

export default CustomComponent