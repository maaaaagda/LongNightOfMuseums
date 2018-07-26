import {combineReducers} from 'redux';
import institutions from './institutionReducer';
import login from './loginReducer';

const rootReducer = combineReducers({
  institutions,
  login
});

export default rootReducer;

