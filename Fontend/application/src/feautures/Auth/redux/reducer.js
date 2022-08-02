import initState from './initState'
import * as CONSTANTS from './constants'
export function reducer(state = initState, action) {
    const stateLocal = loadStateFromLocal()
    switch (action.type) {
        case CONSTANTS.LOGIN_LOADING:
            return {
                ...state,
                login: {
                    ...state.login,
                    loading:true
                }
            }
        case CONSTANTS.SET_TOKEN_ACTION:
        case CONSTANTS.CLEAR_TOKEN_ACTION: {
            return {
                ...state,
                ...stateLocal,
                login: {
                    loading: false
                }
            }
        }
        default:
            return state
    }
}

export function loadStateFromLocal() {
    let stateFromLocal
    try {

        let dataLocal = JSON.parse(localStorage.getItem(CONSTANTS.ARG_TOKEN))
        const {data, meta } = dataLocal
        stateFromLocal = {
            user: {
                id: data.id,
                name: data.name,
                email: data.email
            },
            meta: {
                token: meta.token
            }
        }
    } catch (error) {
        localStorage.removeItem(CONSTANTS.ARG_TOKEN)
        stateFromLocal = {
            user: {
                id: null,
                name: null,
                email: null
            },
            meta: {
                token: null
            },
           
        }
    }
    return stateFromLocal
}