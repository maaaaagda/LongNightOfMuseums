import * as types from '../actions/actionsTypes';
import initialState from './initialState'

export default function institutionReducer(state = initialState.institutions, action) {
  switch (action.type) {
    case types.CREATE_INSTITUTION_SUCCESS:
      return [...state, Object.assign({}, action.payload)];

    case types.LOAD_INSTITUTIONS_SUCCESS:
      return Object.assign([], action.payload);

    case types.DELETE_INSTITUTION_SUCCESS:
      return state.filter(institution => institution._id !== action.payload);

    default:
      return state;
  }
}
