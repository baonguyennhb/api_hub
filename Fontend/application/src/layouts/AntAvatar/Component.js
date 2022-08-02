import React, {Component} from 'react';
import {Avatar} from "antd";

class CustomComponent extends Component {
    render() {
        const {src, size, className, icon, alt} = this.props

        return (
            <Avatar
                src={src} size={size}
                className={className}
                alt={alt}
                icon={icon}>
                {this.props.children}
            </Avatar>
        )
    }
}

export default CustomComponent