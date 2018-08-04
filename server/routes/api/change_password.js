const Admin = require('../../models/Admin');
const JWTtoken = require('../../libs/auth');
const maxAge = 300;

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
        let id = admin._id;
        res.status(200)
          .json({
            success: true,
            link: `localhost:8080/resetpassword/${id}/${token}/`
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
        return Promise.all([JWTtoken.verifyPasswordChangeToken(token, secret), admin])
      })
      .then((results) => {
         let admin = results[1];
         admin.password = password;
         return admin.save()

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
