import {combineReducers} from 'redux';
import institutions from './institutionReducer';
import login from './loginReducer';

const rootReducer = combineReducers({
  institutions: institutions,
  admin: login
});

export default rootReducer;

