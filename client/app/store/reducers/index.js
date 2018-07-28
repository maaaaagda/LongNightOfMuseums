import {combineReducers} from 'redux';
import institutions from './institutionReducer';
import login from './loginReducer';
import admins from './adminReducer';

const rootReducer = combineReducers({
  institutions: institutions,
  admin: login,
  admins: admins
});

export default rootReducer;

