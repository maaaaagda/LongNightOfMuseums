import {combineReducers} from 'redux';
import institutions from './institutionReducer';
import login from './loginReducer';
import admins from './adminReducer';
import cityReducer from './cityReducer';
import routeReducer from './routeReducer'

const rootReducer = combineReducers({
  institutions: institutions,
  admin: login,
  admins: admins,
  cities: cityReducer,
  routes: routeReducer
});

export default rootReducer;

