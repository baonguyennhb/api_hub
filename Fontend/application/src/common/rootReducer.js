import { combineReducers } from "redux";
import { reducer as PlantReducer  } from "../feautures/Home/redux/reducer";
import { reducer as ReportReducer } from "../feautures/ViewReport/redux/reducer";
import {reducer as ConfigPlant } from "../feautures/ConfigPlant/redux/reducer"
import { reducer as ConfigDataSource } from "../feautures/ConfigDataSource/redux/reducer";
import { reducer as ConfigReport } from "../feautures/ConfigReport/redux/reducer";
import { reducer as Auth } from "../feautures/Auth/redux/reducer";
const rootReducer = combineReducers({
    auth: Auth,
    plant: PlantReducer,
    report: ReportReducer,
    configPlant: ConfigPlant,
    configDataSource: ConfigDataSource,
    configReport: ConfigReport
})

export default rootReducer
