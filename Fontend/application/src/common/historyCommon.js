import {createBrowserHistory} from 'history';

// A singleton history object for easy API navigation
const historyCommon = createBrowserHistory();
//const history = createBrowserHistory({ basename: '/admin });
export default historyCommon;