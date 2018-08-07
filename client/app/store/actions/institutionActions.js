import * as types from './actionsTypes';
import axios from 'axios';

export function create_institution(institution) {
  return {type:  types.CREATE_INSTITUTION, institution}
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

export function load_institutions_success(admins) {
  return {type:  types.LOAD_INSTITUTIONS_SUCCESS, payload: admins}
}
