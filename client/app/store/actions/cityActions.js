import * as types from './actionsTypes';
import axios from 'axios';

export function create_city(cityName) {
  return dispatch => {
    return axios.post('/api/cities', {name: cityName})
      .then((res) => {
        dispatch(create_city_success(res.data))
      })
      .catch(err => {
        throw err;
      })
  }
}

export function create_city_success(city) {
  return {type:  types.CREATE_CITY_SUCCESS, payload: city}
}

export function load_cities() {
  return dispatch => {
    return axios.get('/api/cities')
      .then((res) => {
        dispatch(load_cities_success(res.data))
      })
      .catch(err => {
        throw err;
      })
  }
}

export function load_cities_success(cities) {
  return {type:  types.LOAD_CITIES_SUCCESS, payload: cities}
}

export function delete_city(id) {
  return dispatch => {
    return axios.delete(`/api/cities/${id}`)
      .then(() => {
        dispatch(delete_city_success(id))
      })
      .catch(err => {
        throw err;
      })
  }
}

export function delete_city_success(id) {
  return {type:  types.DELETE_CITY_SUCCESS, payload: id}
}


export function update_city(id, cityName) {
  return dispatch => {
    return axios.put(`/api/cities/${id}`, {name: cityName})
      .then((res) => {
        dispatch(update_city_success(res.data))
      })
      .catch(err => {
        throw err;
      })
  }
}

export function update_city_success(id) {
  return {type:  types.UPDATE_CITY_SUCCESS, payload: id}
}
