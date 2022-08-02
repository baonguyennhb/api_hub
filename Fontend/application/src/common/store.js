import {createStore, applyMiddleware} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';


// NOTE: Do not change middleares delaration pattern since rekit plugins may register middlewares to it.
const middlewares = [thunk];

let devToolsExtension = f => f;

/* istanbul ignore if  */
if (process.env.NODE_ENV === 'development') {
    const {createLogger} = require('redux-logger');

    const logger = createLogger({
        collapsed: true,
    });
    //middlewares.push(logger);

    if (window.__REDUX_DEVTOOLS_EXTENSION__) {
        devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__();
    }
}

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))

