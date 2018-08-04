import axios from 'axios';

export function reset_password(recoveryData) {
  return dispatch => {
    return axios.post('/api/resetpassword', recoveryData)
          .then(res => {
            console.log(res.data)
          })
          .catch(err => {
            throw err;
          })
      }
}
