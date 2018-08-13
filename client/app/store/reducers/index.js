import {combineReducers} from 'redux';
import institutions from './institutionReducer';
import login from './loginReducer';
import admins from './adminReducer';
import cityReducer from "./cityReducer";

const rootReducer = combineReducers({
  institutions: institutions,
  admin: login,
  admins: admins,
  cities: cityReducer
});

export default rootReducer;

