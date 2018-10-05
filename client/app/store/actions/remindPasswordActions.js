import axios from 'axios';

export function remind_password(email) {
  return dispatch => {
    return axios.post('/api/remindpassword', email)
      .then(res => {
      })
      .catch(err => {
        throw err;
      })
  }
}
