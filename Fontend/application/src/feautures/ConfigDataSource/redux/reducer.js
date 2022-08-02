import * as CONSTANTS from './constants'
import initState from './initState'

export function reducer(state = initState, action) {
    let payload = action.payload
    switch (action.type) {
        case CONSTANTS.FETCHING_LIST_DATASOURCE:
            let data = payload.data !== undefined ? payload.data : []
            return {
                ...state,
                list: {
                    data: data.data,
                    loading: false
                }
            }
        case CONSTANTS.FETCHING_LIST_DATASOURCE_LOADDING:
            return {
                ...state,
                list: {
                    ...state.list,
                    loading: true
                }
            }
        default:
            return state
    }
}