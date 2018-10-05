import * as types from '../actions/actionsTypes';
import initialState from './initialState'

export default function cityReducer(state = initialState.cities, action) {
  switch (action.type) {
    case types.CREATE_CITY_SUCCESS:
      return [...state, Object.assign({}, action.payload)];

    case types.UPDATE_CITY_SUCCESS:
      return  state.map(city => {
        if (city._id === action.payload._id) {
          return action.payload
        } else {
          return city;
        }
      });

    case types.LOAD_CITIES_SUCCESS:
      return JSON.parse(JSON.stringify(action.payload));

    case types.DELETE_CITY_SUCCESS:
      return state.filter(city => city._id !== action.payload);

    default:
      return state;
  }
}
