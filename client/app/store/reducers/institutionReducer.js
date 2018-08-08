import * as types from '../actions/actionsTypes';
import initialState from './initialState'

export default function institutionReducer(state = initialState.institutions, action) {
  switch (action.type) {
    case types.CREATE_INSTITUTION:
      return [...state, Object.assign({}, action.institution)];
    case types.LOAD_INSTITUTIONS_SUCCESS:
      return Object.assign([], action.payload);
    case types.DELETE_INSTITUTION_SUCCESS:
      return state.filter(institution => institution._id !== action.payload);
    default:
      return state;
  }
}
