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
