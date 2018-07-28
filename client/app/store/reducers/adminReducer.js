import * as types from '../actions/actionsTypes';
import initialState from './initialState'
import {LOAD_ADMINS_SUCCESS} from "../actions/actionsTypes";

export default function loginReducer(state = initialState.admins, action) {
  switch (action.type) {
    case types.LOAD_ADMINS_SUCCESS:
      return [...state, Object.assign({}, action.payload)];
    default:
      return state;
  }
}
