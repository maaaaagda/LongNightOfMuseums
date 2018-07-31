import * as types from '../actions/actionsTypes';
import initialState from './initialState'


export default function adminReducer(state = initialState.admins, action) {
  switch (action.type) {
    case types.LOAD_ADMINS_SUCCESS:

      return [...state, ...Object.assign([], action.payload)];

    case types.CREATE_ADMIN_SUCCESS:

      return [...state, Object.assign({}, action.payload)];
    default:
      return state;
  }
}

