import React, {Component} from 'react';
import {App} from "../../layouts/App";
import {Route} from "react-router-dom";

class Container extends Component {
    render() {

        let component;
        switch (this.props.layout) {
            // case 'Auth':
            //     component = <Auth>{this.props.children}</Auth>
            //     break;
            default:
                component = <App>{this.props.children}</App>
                break;
        }

        return this.props.exact ?
            (<Route exact path={this.props.path} >{component}</Route>)
            : (<Route path={this.props.path}>{component}</Route>)
    }
}

export default Container