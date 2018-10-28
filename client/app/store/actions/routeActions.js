import * as types from './actionsTypes';
import axios from "axios";

export function get_routes() {
  return dispatch => {
    let routes = localStorage.getItem('sightseeingPath');
    if(routes) {
      try {
        let routesIds = JSON.parse(routes);
        if(Array.isArray(routesIds)) {
          dispatch(get_routes_from_database(routesIds))
        } else {
          localStorage.removeItem('sightseeingPath');
          dispatch(get_routes_success(null));
        }
      } catch (e) {
        console.log(e);
        localStorage.removeItem('sightseeingPath');
        dispatch(get_routes_success(null));
      }
    } else {
      dispatch(get_routes_success(null));
    }
  }
}

export function get_routes_success(routes) {
  return {type:  types.GET_ROUTES_SUCCESS, payload: routes}
}

export function get_routes_from_database(routesIds) {
  return dispatch => {
    if(routesIds.length === 0 ) {
      dispatch(get_routes_success(null));
      return []
    }
    return axios.put('/api/routes', {routesIds: routesIds})
      .then((res) => {
        dispatch(get_routes_success(res.data));
        return res.data
      })
      .catch(err => {
        throw err;
      })
  }
}

export function get_single_route_from_database(routeId) {
  return dispatch => {
    return axios.put('/api/routes', {routesIds: [routeId]})
      .then((res) => {
        return res.data
      })
      .catch(err => {
        throw err;
      })
  }
}


export function create_route(routeData) {
  return dispatch => {
    return axios.post('/api/routes', routeData)
      .then((res) => {
        dispatch(create_route_success(res.data));
        return res;
      })
      .catch(err => {
        throw err;
      })
  }
}

export function create_route_success(route) {
  return {type:  types.CREATE_ROUTE_SUCCESS, payload: route}
}

export function delete_route(routeId) {
  return dispatch => {
    return axios.delete('/api/routes/' + routeId)
      .then(() => {
        dispatch(delete_route_success(routeId));
      })
      .catch(err => {
        throw err;
      })
  }
}

export function delete_route_success(routeId) {
  return {type:  types.DELETE_ROUTE_SUCCESS, payload: routeId}
}
