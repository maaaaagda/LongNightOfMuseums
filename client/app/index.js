import React from 'react';
import { render } from 'react-dom';
import 'semantic-ui-less/semantic.less';
import "react-image-gallery/styles/css/image-gallery.css";
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
import Admins from './components/Admins/AdminsList';
import UserRoute from './components/Routes/Route';
import NewAdmin from './components/Admins/NewAdmin';
import './styles/styles.less';
import './helpers/delayPromise';
import history from './helpers/history';
import {restoreUserIfLogged} from "./store/actions/loginActions";
import NewInstitution from "./components/Institutions/NewInstitution";
import EditInstitution from './components/Institutions/EditInstitution';
import InstitutionDetail from './components/Institutions/InstitutionDetail';
import CitiesList from "./components/Cities/CitiesList";
import Redirect from "react-router-dom/es/Redirect";
import {load_institutions} from "./store/actions/institutionActions";
import ScrollToTop from "./components/Helpers/ScrollToTop";
import {load_cities} from "./store/actions/cityActions";
const store = configureStore();

store.dispatch(restoreUserIfLogged());
store.dispatch(load_cities());
store.dispatch(load_institutions());

render((
  <Provider store={store}>
    <Router history={history}>
      <ScrollToTop>
        <App>
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/remindpassword" component={RemindPassword}/>
            <Route path="/resetpassword/:adminId/:recoveryString/" render={(props) => (<ResetPassword {...props}/>)}/>
            <Route path="/institutions/:institutionId" component={InstitutionDetail}/>
            <Route path="/institutions" component={Institutions}/>
            <Route path="/routes/:routeId" component={UserRoute}/>
            <Route path="/admin/institutions/new" render={() => (
              !store.getState().admin.isLoggedIn ? (
                <Redirect to="/login"/>) : (<NewInstitution/>
              ))}/>/>
            <Route path="/admin/institutions/:institutionId" render={(props) => (
              !store.getState().admin.isLoggedIn ? (
                <Redirect to="/login"/>) : (<EditInstitution {...props} />
              ))}/>
            <Route path="/admin/institutions" render={() => (
              !store.getState().admin.isLoggedIn ? (
                <Redirect to="/login"/>) : (<Institutions/>
              ))}/>
            <Route path="/admin/cities" render={() => (
              !store.getState().admin.isLoggedIn ? (
                <Redirect to="/login"/>) : (<CitiesList/>
              ))}/>
            <Route path="/admin/admins/new" render={() => (
              !store.getState().admin.isLoggedIn ? (
                <Redirect to="/login"/>) : (<NewAdmin/>
              ))}/>
            <Route path="/admin/admins" render={() => (
              !store.getState().admin.isLoggedIn ? (
                <Redirect to="/login"/>) : (<Admins/>
              ))}/>
            <Route component={NotFound}/>
          </Switch>
        </App>
      </ScrollToTop>
    </Router>
  </Provider>
), document.getElementById('app'));

