import {combineReducers} from 'redux';
import institutions from './institutionReducer';

const rootReducer = combineReducers({
  institutions
});

export default rootReducer;

