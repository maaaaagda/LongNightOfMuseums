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
import './styles/styles.less';
import './helpers/delayPromise'
import history from './helpers/history';
import {restoreUserIfLogged} from "./store/actions/loginActions";
import {load_admins} from "./store/actions/adminActions";

const store = configureStore();

store.dispatch(restoreUserIfLogged())
store.dispatch(load_admins())

render((
  <Provider store={store}>
    <Router history={history}>
      <App>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/institutions" component={Institutions}/>
          <Route path="/counter" component={Counter}/>
          <Route path="/login" component={Login}/>
          <Route component={NotFound}/>
        </Switch>
      </App>
    </Router>
  </Provider>
), document.getElementById('app'));

