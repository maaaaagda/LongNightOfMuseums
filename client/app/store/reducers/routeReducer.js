import * as types from '../actions/actionsTypes';
import initialState from './initialState'

export default function routeReducer(state = initialState.routes, action) {
  switch (action.type) {
    case types.GET_ROUTES_SUCCESS:
      if(!action.payload || action.payload.length === 0 ) {
        return null
      }
      return [...JSON.parse(JSON.stringify(action.payload))];
    case types.CREATE_ROUTE_SUCCESS:
      if(state) {
        return [...state, action.payload];
      }
      return [action.payload];

    default:
      return state;
  }
}
