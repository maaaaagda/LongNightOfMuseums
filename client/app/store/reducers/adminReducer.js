import * as types from '../actions/actionsTypes';
import initialState from './initialState'


export default function adminReducer(state = initialState.admins, action) {
  switch (action.type) {
    case types.LOAD_ADMINS_SUCCESS:
      return [...state, ...Object.assign([], action.payload)];

    case types.CREATE_ADMIN_SUCCESS:
      return [...state, Object.assign({}, action.payload)];

    case types.DELETE_ADMIN_SUCCESS:
      return state.filter(admin => admin._id !== action.payload);

    case types.EDIT_ADMIN_SUCCESS:
      return  state.map(admin => {
        if (admin._id === action.payload._id) {
          return action.payload
        } else {
          return admin;
        }
      });
    default:
      return state;
  }
}

