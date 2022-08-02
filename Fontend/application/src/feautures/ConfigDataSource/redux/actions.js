import * as CONSTANTS  from './constants'
import axios from 'axios'
export function fetchingTableDataSource(){
    return dispatch => {
        dispatch(fetchingLoadingAction())
        axios.get("http://localhost:4000/api/v1/data-source/list/cfg")
            .then(res => {
                dispatch(fetchingAction(res))
            })
    }
}
export function fetchingAction(response) {
    return {
        type: CONSTANTS.FETCHING_LIST_DATASOURCE,
        payload: response
    }
}
export function fetchingLoadingAction() {
    return {
        type: CONSTANTS.FETCHING_LIST_DATASOURCE_LOADDING,
        payload: {}
    }
}