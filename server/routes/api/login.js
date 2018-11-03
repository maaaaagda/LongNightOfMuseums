const Admin = require('../../models/Admin');
const JWTtoken = require('../../libs/auth');
const moment = require('moment');
const bcrypt = require('bcrypt');
const maxAge = 36000;

module.exports = (app) => {
  app.post('/api/login', (req, res) => {
    let {email, password} = req.body;
    Admin.findOne({ email: email})
      .then((admin) => (!admin) ? Promise.reject("Admininstrator not found.") : admin)
      .then((admin) => {
        return Promise.all([bcrypt.compare(password, admin.password), admin])})
      .then((results) => {
        let validPassword = results[0];
        let admin = results[1];
        let data = {name: admin.name, role: admin.role};
        if(validPassword){
          res.status(200)
            .json({
              success: true,
              token: JWTtoken.createJWToken({
                sessionData: data,
                maxAge: maxAge
              }),
              expirationTime: moment().add(maxAge, 'ms')
            });
        } else {
          return Promise.reject('Validation failed.')
        }

      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Validation failed. Given email and password aren't matching."
          })
      })
  });
};
