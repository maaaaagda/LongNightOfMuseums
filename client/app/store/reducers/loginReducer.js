import * as types from '../actions/actionsTypes';
import initialState from './initialState'

export default function loginReducer(state = initialState.admin, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      let adminLoginSuccess = {
        isLoggedIn: true,
        name: action.payload.sub.name,
        role: action.payload.sub.role
      };
      return Object.assign({}, adminLoginSuccess);
    case types.LOG_OUT_SUCCESS:
      let adminLogout = {
        isLoggedIn: false,
        name: '',
        role: ''
      };
      return Object.assign({}, adminLogout);
    default:
      return state;
  }
}
