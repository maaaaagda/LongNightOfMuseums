import * as types from '../actions/actionsTypes';

export default function institutionReducer(state = [], action) {
  switch (action.type) {
    case types.CREATE_INSTITUTION:
      return [...state, Object.assign({}, action.institution)];
    default:
      return state;
  }
}
