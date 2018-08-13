import * as types from './actionsTypes';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import moment from  'moment';

export function loginSuccess(admin) {
   if(admin.token) {
     axios.defaults.headers.common['Authorization'] = `Bearer ${admin.token}`;
    } else {
      delete axios.defaults.headers.common['authorization'];
    }
  return {type:  types.LOGIN_SUCCESS, payload: admin}
}

export function login(loginData) {
  return dispatch => {
    return axios.post('/api/login', loginData)
      .then(res => {
        let rawToken = res.data.token;
        let decodedToken = jwtDecode(rawToken);
        decodedToken['token'] = rawToken;
        dispatch(loginSuccess(decodedToken));
        return res;
      })
      .then((res) => {
        localStorage.setItem('token', res.data.token);
      })
     .catch(err => {
        throw err;
      })
  }
}

export function restoreUserIfLogged () {
  return dispatch => {
    let rawToken = localStorage.getItem('token');
    if (rawToken) {
      let decodedToken = jwtDecode(rawToken);
      decodedToken['token'] = rawToken;
      let expirationTime = decodedToken['exp'];
      let timeNow = moment().format('X');
      if (timeNow <= expirationTime) {
        dispatch(loginSuccess(decodedToken))
        //history.push('/')
      } else {
        console.log('Session  expired')
        //history.push('/login')
      }
    }
  }
}
