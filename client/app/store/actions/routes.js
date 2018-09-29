import * as types from './actionsTypes';

export function get_routes() {
  return dispatch => {
    let routes = localStorage.getItem('sightseeingPath');
    if(routes) {
      try {
        let parsedRoutes = JSON.parse(routes);
        if(Array.isArray(parsedRoutes)) {
          dispatch(get_routes_success(parsedRoutes))
        } else {
          localStorage.removeItem('sightseeingPath')
        }
      } catch (e) {
        localStorage.removeItem('sightseeingPath')
      }
    }
  }
}

export function get_routes_success(routes) {
  return {type:  types.GET_ROUTES_SUCCESS, payload: routes}
}
