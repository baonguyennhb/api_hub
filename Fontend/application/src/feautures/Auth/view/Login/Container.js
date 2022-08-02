import React, { Component } from 'react'
import President from './President'
import { Navigate } from 'react-router-dom'
import { login } from '../../redux/actions'
import { connect } from 'react-redux'

class Container extends Component {

    handleLogin = (data) => {
        console.log(data)
        this.props.login({
            email: data.username,
            password: data.password
        })
    }
    render() {
        const auth = this.props.auth
        const user = auth.user
        console.log(user)
        if (user.email !== null) {
            return (
                <Navigate to={"/home"} />
            )
        }
        return (

            <President handleLogin={this.handleLogin} />

        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        login: (data) => {
            dispatch(login(data))
        }
    }
}
function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Container)