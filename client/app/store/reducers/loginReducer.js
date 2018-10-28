import * as types from '../actions/actionsTypes';
import initialState from './initialState'

export default function loginReducer(state = initialState.admin, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      let adminData = action.payload.data;
      let adminLoginSuccess = {
        isLoggedIn: true,
        name: adminData.name,
        role: adminData.role
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
