import * as types from '../actions/actionsTypes';
import initialState from './initialState'

export default function loginReducer(state = initialState.admin, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      let adminLoginSuccess = {
        isLoggedIn: true,
        email: action.payload
      };
      return Object.assign({}, adminLoginSuccess);
    case types.LOG_OUT_SUCCESS:
      let adminLogout = {
        isLoggedIn: false,
        email: ''
      };
      return Object.assign({}, adminLogout);
    default:
      return state;
  }
}
