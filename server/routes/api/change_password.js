const Admin = require('../../models/Admin');
const JWTtoken = require('../../libs/auth');
const mail = require('../../libs/send_email');
const config = require('../../libs/config');
const bcrypt = require('bcrypt');

const maxAge = 300;
const maxAgeInMinutes  = maxAge/60;

module.exports = (app) => {
  app.post('/api/remindpassword', (req, res) => {
    let {email} = req.body;
    Admin.findOne({ email: email})
      .then((admin) => (!admin) ? Promise.reject("Admininstrator not found.") : admin)
      .then((admin) => {
        let secret = admin.password + admin.createdAt;
        let token =  JWTtoken.createPasswordChangeJWToken({
          secret: secret,
          maxAge: maxAge
        });
        let link = `${config.APP_URL}resetpassword/${admin._id}/${token}/`;
        return mail.sendEmail(email,
          'Password recovery',
          `<p>Click <a href="${link}">here</a> to recover your password.<br/>Link will expire in ${maxAgeInMinutes} minutes</p>`)

      })
      .then(() => {
        res.status(200)
          .json({
            success: true
          })
      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Error"
          })
      })
  });

  app.post('/api/resetpassword', (req, res) => {

    let {password, adminId, recoveryString} = req.body;
    let token = recoveryString;
    Admin.findById(adminId)
      .then((admin) => (!admin) ? Promise.reject("Admininstrator not found.") : admin)
      .then((admin) => {
        let secret = admin.password + admin.createdAt;
        let hashedPassword = bcrypt.hash(password, config.BCRYPT_SALT)
        return Promise.all([JWTtoken.verifyPasswordChangeToken(token, secret), admin, hashedPassword])
      })
      .then((results) => {
         let admin = results[1];
         admin.password = results[2];
         return admin.save();

      })
      .then(() =>
        res.status(200)
          .json({
            success: true
          }))
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Error"
          })
      })
  });
};
