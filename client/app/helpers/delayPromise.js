import axios from "axios";

const DELAY_TIME = 500;
axios.interceptors.response.use(function (response) {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(response);
    }, DELAY_TIME);
  })
}, function (error) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(error);
    }, DELAY_TIME);
  })
});
