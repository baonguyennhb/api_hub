import axios from 'axios'
import * as CONSTANTS from './constants'

export function login (params) {
    return dispatch => {
        dispatch(loginLoadingAction())
        axios.post("http://backend.ziot.vn:5001/fontend/user/login", params)
            .then(res => dispatch(setTokenAction(res.data)))
    }
}

export function loginLoadingAction() {
    return {
        type: CONSTANTS.LOGIN_LOADING,
        payload: null
    }
}
export function setTokenAction (data) {
    console.log(data)
    if(data.code === 200) {
        localStorage.setItem(CONSTANTS.ARG_TOKEN, JSON.stringify(data))
    }
    return {
        type: CONSTANTS.SET_TOKEN_ACTION,
        payload: null
    }
}
export function clearToken() {
    console.log("Clear Token")
    localStorage.removeItem(CONSTANTS.ARG_TOKEN)
    return dispatch => {
        dispatch(clearTokenAction())
    }
}
export function clearTokenAction() {
    return {
        type: CONSTANTS.CLEAR_TOKEN_ACTION,
        payload: null
    }
}