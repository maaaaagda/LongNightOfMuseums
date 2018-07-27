import * as types from './actionsTypes';
import axios from 'axios';


export function loginSuccess(admin) {
   if(admin.token) {
     console.log('setting ax')
      axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
     console.log(axios.defaults.headers)
    } else {
      delete axios.defaults.headers.common['authorization'];
    }
  return {type:  types.LOGIN_SUCCESS, admin}
}

export function login(loginData) {
  return dispatch => {
    return axios.post('/api/login', loginData)
      .then(res => {
        dispatch(loginSuccess(res.data))
        return res;
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token)
      })
     .catch(err => {
        throw err;
      })
  }
}
