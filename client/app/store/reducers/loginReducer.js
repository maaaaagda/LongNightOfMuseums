import * as types from '../actions/actionsTypes';
import initialState from './initialState'

export default function loginReducer(state = initialState.admin, action) {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      let admin = {
        isLoggedIn: action.admin.success,
        name: 'Joe',
        surname: 'Doe',
        email: ''
      }
      return Object.assign({}, admin);
    default:
      return state;
  }
}
