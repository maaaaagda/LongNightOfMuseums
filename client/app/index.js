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
import Institutions from './components/Institutions/InstitutionsList';
import Home from './components/Home/Home'
import Login from './components/Admins/Login'
import RemindPassword from './components/Admins/RemindPassword';
import ResetPassword from './components/Admins/ResetPassword';
import Admins from './components/Admins/AdminsList'
import NewAdmin from './components/Admins/NewAdmin'
import './styles/styles.less';
import './helpers/delayPromise'
import history from './helpers/history';
import {restoreUserIfLogged} from "./store/actions/loginActions";
import NewInstitution from "./components/Institutions/NewInstitution";
import EditInstitution from './components/Institutions/EditInstitution';
import CitiesList from "./components/Cities/CitiesList";
import {load_cities} from "./store/actions/cityActions";
import Redirect from "react-router-dom/es/Redirect";
const store = configureStore();

store.dispatch(restoreUserIfLogged());
store.dispatch(load_cities());

render((
  <Provider store={store}>
    <Router history={history}>
      <App>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/institutions/new" render={() => (
            !store.getState().admin.isLoggedIn ? (
              <Redirect to="/login"/> ) : (<NewInstitution />
            ))}/>/>
          <Route path="/institutions/:institutionId" render={() => (
            !store.getState().admin.isLoggedIn ? (
              <Redirect to="/login"/> ) : (<EditInstitution />
            ))}/>
          <Route path="/institutions" render={() => (
            !store.getState().admin.isLoggedIn ? (
              <Redirect to="/login"/> ) : (<Institutions />
            ))}/>
          <Route path="/cities" render={() => (
            !store.getState().admin.isLoggedIn ? (
              <Redirect to="/login"/> ) : (<CitiesList />
            ))}/>
          <Route path="/login" component={Login}/>
          <Route path="/remindpassword" component={RemindPassword}/>
          <Route path="/resetpassword/:adminId/:recoveryString/" component={ResetPassword}/>
          <Route path="/admins/new" render={() => (
            !store.getState().admin.isLoggedIn ? (
              <Redirect to="/login"/> ) : (<NewAdmin />
            ))}/>
          <Route path="/admins" render={() => (
            !store.getState().admin.isLoggedIn ? (
              <Redirect to="/login"/> ) : (<Admins />
            ))}/>
          <Route component={NotFound}/>
        </Switch>
      </App>
    </Router>
  </Provider>
), document.getElementById('app'));

