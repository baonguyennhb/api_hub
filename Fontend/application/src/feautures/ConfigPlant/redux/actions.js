import axios from 'axios'
import * as CONSTANTS from './constants'

export function fetchingTablePlant() {
    return dispatch => {
        dispatch(fetchingLoadingAction)
        axios.get('http://localhost:4000/api/v1/plant/list/cfg')
            .then(res => {
                console.log(res)
                dispatch(fetchingAction(res))
            })
    }
}
export function fetchingAction(response) {
    return {
        type: CONSTANTS.FETCHING_LIST_PLANT,
        payload: response
    }
}
export function fetchingLoadingAction() {
    return {
        type: CONSTANTS.FETCHING_LIST_PLANT_LOADING,
        payload: {}
    }
}