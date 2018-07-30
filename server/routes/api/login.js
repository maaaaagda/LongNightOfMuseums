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
        let is_password_valid = compare_password(password, admin.password);
        return (!is_password_valid) ? Promise.reject() : admin;

      })
      //.then((admin) => { sendPublicAdminData } )
      .then((admin) => {
        res.status(200)
          .json({
            success: true,
            token: JWTtoken.createJWToken({
              sessionData: admin,
              maxAge: maxAge
            }),
            expirationTime: moment().add(maxAge, 'ms')
          })
      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Validation failed. Given email and password aren't matching."
          })
      })
  });
};


function compare_password(password, password_to_compare) {
  bcrypt.compare(password, password_to_compare)
    .then((is_password_valid) => {
      return is_password_valid;
    })
}
