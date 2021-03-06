import * as types from './actionsTypes';
import axios from 'axios';
import {load_cities} from "./cityActions";

export function create_institution(institutionData) {
  return dispatch => {
    return axios.post('/api/institutions', institutionData)
      .then((res) => {
        dispatch(create_institution_success(res.data));
        dispatch(load_cities())
    })
      .catch(err => {
        throw err;
      });
  }
}

export function create_institution_success(institution) {
  return {type:  types.CREATE_INSTITUTION_SUCCESS, payload: institution}
}

export function load_institutions() {
  return dispatch => {
    return axios.get('/api/institutions')
      .then((res) => {
        dispatch(load_institutions_success(res.data))
      })
      .catch(err => {
        throw err;
      })
  }
}

export function load_institutions_success(institutions) {
  return {type:  types.LOAD_INSTITUTIONS_SUCCESS, payload: institutions}
}

export function load_institution(id) {
  return dispatch => {
    return axios.get(`/api/institutions/${id}`)
      .then()
      .catch(err => {
        throw err;
      })
  }
}


export function delete_institution(id) {
  return dispatch => {
    return axios.delete(`/api/institutions/${id}`)
      .then(() => {
        dispatch(delete_institution_success(id));
        dispatch(load_cities())
      })
      .catch(err => {
        throw err;
      })
  }
}

export function delete_institution_success(id) {
  return {type:  types.DELETE_INSTITUTION_SUCCESS, payload: id}
}


export function update_institution(id, institutionData) {
  return dispatch => {
    return axios.put(`/api/institutions/${id}`, institutionData)
      .then((res) => {
        dispatch(update_institution_success(res.data));
        dispatch(load_cities())
      })
      .catch(err => {
        throw err;
      })
  }
}

export function update_institution_success(institution) {
  return {type:  types.UPDATE_INSTITUTION_SUCCESS, payload: institution}
}
