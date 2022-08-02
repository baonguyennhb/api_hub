import * as CONSTANTS from './constants'
import axios from 'axios'

export function fetchPlantsOverview(plantId) {
    return dispatch => {
        dispatch(fetchPlantsOverviewLoadingAction())
        // dispatch(() => {
            axios.get(`http://localhost:4000/api/v1/plant/list`)
                .then(data => {
                    dispatch(fetchPlantsOverviewAction(data))
                })
        //})
    }
}

export function fetchPlantDetail(plantId) {
    return dispatch => {
        dispatch(fetchPlantsDetailLoadingAction)
        // dispatch(() => {
            axios.get(`http://localhost:4000/api/v1/plant/1060`)
                .then(data => {
                    dispatch(fetchPlantsDetailAction(data))
                })
        //})
    }
}

function fetchPlantsOverviewLoadingAction() {
    return {
        type: CONSTANTS.FETCH_PLANT_OVERVIEW_LOADING_ACTION,
        payload: null
    }
}
function fetchPlantsOverviewAction(response) {
    return {
        type: CONSTANTS.FETCH_PLANT_OVERVIEW_ACTION,
        payload: response.data
    }
}

function fetchPlantsDetailLoadingAction() {
    return {
        type: CONSTANTS.PLANT_DETAIL_LOADING,
        payload: null
    }
}
function fetchPlantsDetailAction(response) {
    return {
        type: CONSTANTS.PLANT_DETAIL,
        payload: response.data
    }
}