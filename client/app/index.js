import React from 'react';
import { render } from 'react-dom';
import 'semantic-ui-less/semantic.less';
import configureStore from './store/store/configureStore';
import { Provider } from 'react-redux';
import {
  Router,
  Route,
  Switch
} from 'react-router-dom';
import App from './components/App/App';
import NotFound from './components/App/NotFound';
import Counter from './components/Home/Counter';
import Institutions from './components/Institutions/InstitutionsList';
import Home from './components/Home/Home'
import Login from './components/Admin/Login'
import RemindPassword from './components/Admin/RemindPassword';
import ResetPassword from './components/Admin/ResetPassword';
import Admins from './components/Admin/AdminsList'
import NewAdmin from './components/Admin/NewAdmin'
import './styles/styles.less';
import './helpers/delayPromise'
import history from './helpers/history';
import {restoreUserIfLogged} from "./store/actions/loginActions";
import NewInstitution from "./components/Institutions/NewInstitution";

const store = configureStore();

store.dispatch(restoreUserIfLogged());

render((
  <Provider store={store}>
    <Router history={history}>
      <App>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/institutions/new" component={NewInstitution}/>
          <Route path="/institutions" component={Institutions}/>
          <Route path="/counter" component={Counter}/>
          <Route path="/login" component={Login}/>
          <Route path="/remindpassword" component={RemindPassword}/>
          <Route path="/resetpassword/:adminId/:recoveryString/" component={ResetPassword}/>
          <Route path="/admins/new" component={NewAdmin}/>
          <Route path="/admins" component={Admins}/>
          <Route component={NotFound}/>
        </Switch>
      </App>
    </Router>
  </Provider>
), document.getElementById('app'));

