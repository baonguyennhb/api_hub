import React, {Component} from 'react';
import {Button} from "antd";

class CustomComponent extends Component {
    render() {
        let {type, htmlType, size, disabled, block, className, minWidth} = this.props

        minWidth  = minWidth !== undefined ? minWidth : true;
        className = className !== undefined ? className : '';
        if (minWidth) {
            className = className + 'btn-min-with'
        }
        className = className.trim();
        return (
            <Button type={type}
                    htmlType={htmlType}
                    size={size}
                    disabled={disabled}
                    block={block}
                    {...this.props}
                    className={this.props.className + ' ' + className}
            >
                {this.props.children}
            </Button>
        )
    }
}

export default CustomComponent