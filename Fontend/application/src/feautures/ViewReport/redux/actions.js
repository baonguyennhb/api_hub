import * as CONSTANTS from './constants'
import axios from 'axios'

export function fetchDataReport(params) {
    return dispatch => {
        dispatch(fetchDataReportLoadingAction())
        // dispatch(() => {
            axios.get(`http://localhost:4000/api/v1/report`, params = {params})
                .then(data => {
                    dispatch(fetchDataReportAction(data))
                })
        //})
    }
}

function fetchDataReportLoadingAction() {
    return {
        type: CONSTANTS.FETCH_DATA_REPORT_LOADING_ACTION,
        payload: null
    }
}
function fetchDataReportAction(response) {
    return {
        type: CONSTANTS.FETCH_DATA_REPORT_ACTION,
        payload: response.data
    }
}