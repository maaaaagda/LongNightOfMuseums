import React from 'react';
import { render } from 'react-dom';
import 'semantic-ui-less/semantic.less';
import configureStore from './store/store/configureStore';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import App from './components/App/App';
import NotFound from './components/App/NotFound';

import Counter from './components/Home/Counter';

import Institutions from './components/Institutions/InstitutionsList';
import Home from './components/Home/Home'
import './styles/styles.less';

const store = configureStore();

render((
  <Provider store={store}>
    <Router>
      <App>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/institutions" component={Institutions}/>
          <Route path="/counter" component={Counter}/>
          <Route component={NotFound}/>
        </Switch>
      </App>
    </Router>
  </Provider>
), document.getElementById('app'));

