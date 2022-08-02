import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { App as AppLayout } from './layouts/App'
import {store} from './common/store';
import { Provider } from 'react-redux';
import { Home } from './feautures/Home';
import { ViewReport } from './feautures/ViewReport';
import { Monitor } from './feautures/Monitor';
import { Auth } from './layouts/Auth';
import { Login } from './feautures/Auth/view/Login';
import { DataSource } from './feautures/ConfigDataSource/view/Detail';
import { Plant } from './feautures/ConfigPlant/view/Detail';
import { User } from './feautures/Administrator/components/User';
import { ConfigReport } from './feautures/ConfigReport/view/Detail';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/' element={<Auth><Login /></Auth>} />
          <Route path='/home' element={<AppLayout><Home /></AppLayout>} />
          <Route path='/plant/:id' element={<AppLayout><ViewReport /></AppLayout>} />
          <Route path='/monitor' element={<AppLayout><Monitor /></AppLayout>} />
          <Route path='/config/data-source' element={<AppLayout><DataSource /></AppLayout>} />
          <Route path='/config/plant' element={<AppLayout><Plant/></AppLayout>} />
          <Route path='/config/report' element={<AppLayout><ConfigReport /></AppLayout>} />
          <Route path='/config/user' element={<AppLayout><User /></AppLayout>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
