import * as CONSTANTS from './constants'
import initState from './initState'

export function reducer(state = initState, action) {
    let payload = action.payload
    switch (action.type) {
        case CONSTANTS.FETCH_PLANT_OVERVIEW_LOADING_ACTION:
            return {
                ...state,
                overview: {
                    ...state.overview,
                    loading: true
                }
            }
        case CONSTANTS.FETCH_PLANT_OVERVIEW_ACTION:
            return {
                ...state,
                overview: {
                    ...state.overview,
                    loading: false,
                    total: payload.total,
                    reports: payload.totalReports,
                    plants: payload.plants
                }
            }
        case CONSTANTS.PLANT_DETAIL_LOADING:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    loading: true
                }
            }
        case CONSTANTS.PLANT_DETAIL:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    loading: false,
                    reports: payload.data,
                    plant: payload.plantName
                }
            }
        default:
            return state;
    }
}