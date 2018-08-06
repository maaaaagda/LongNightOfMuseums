import * as types from './actionsTypes';
import axios from 'axios';


export function load_admins() {
  return dispatch => {
    return axios.get('/api/admins')
      .then((res) => {
        dispatch(load_admins_success(res.data))
      })
      .catch(err => {
        throw err;
      })
  }
}


export function load_admins_success(admins) {
  return {type:  types.LOAD_ADMINS_SUCCESS, payload: admins}
}


export function create_admin(admin_data) {
  return dispatch => {
    return axios.post('/api/admins', admin_data)
      .then(() => {
        dispatch(create_admin_success(admin_data))
      })
      .catch(err => {
        throw err;
      })
  }
}

export function create_admin_success(admin) {
  return {type:  types.CREATE_ADMIN_SUCCESS, payload: admin}
}


export function delete_admin(id) {
  return dispatch => {
    return axios.delete(`/api/admins/${id}`)
      .then(() => {
        dispatch(delete_admin_success(id))
      })
      .catch(err => {
        throw err;
      })
  }
}

export function delete_admin_success(id) {
  return {type:  types.DELETE_ADMIN_SUCCESS, payload: id}
}
