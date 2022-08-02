import * as CONSTANTS from './constants'
import initState from './initState'

export function reducer(state = initState, action) {
    let payload = action.payload
    switch (action.type) {
        case CONSTANTS.FETCH_DATA_REPORT_LOADING_ACTION:
            return {
                ...state,
                report: {
                    ...state.report,
                    loading: true
                }
            }
        case CONSTANTS.FETCH_DATA_REPORT_ACTION:
            return {
                ...state,
                report: {
                    ...state.report,
                    loading: false,
                    column: payload.column,
                    data: payload.data,
                }
            }
        default:
            return state;
    }
}