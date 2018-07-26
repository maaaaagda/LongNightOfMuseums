import * as types from './actionsTypes';
import 'whatwg-fetch';

export function loginSuccess(user) {
  return {type:  types.LOGIN_SUCCESS, user}
}

export function login(loginData) {
  return dispatch => {
    return fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin"})
      .then(res => res.json())
      .then(json => dispatch(loginSuccess(json)))
      .catch(err => {
        throw err;
      })
  }
}
