import * as types from '../actions/actionsTypes';
import initialState from './initialState'

export default function routeReducer(state = initialState.routes, action) {
  switch (action.type) {
    case types.GET_ROUTES_SUCCESS:
      return [...JSON.parse(JSON.stringify(action.payload))];

    default:
      return state;
  }
}
