import axios from 'axios';

export function remind_password(email) {
  return dispatch => {
    return axios.post('/api/remindpassword', email)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        throw err;
      })
  }
}
