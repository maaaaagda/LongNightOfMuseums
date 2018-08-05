const Admin = require('../../models/Admin');
const bcrypt = require('bcrypt');
const config = require('../../libs/config');
const generator = require('generate-password');
const JWTtoken = require("../../libs/auth");
const mail = require('../../libs/send_email')

const passwordLength = 7;
const maxAge = 108000;

module.exports = (app) => {

  app.get('/api/admins', (req, res, next) => {
    Admin.find()
      .exec()
      .then((admins) => res.json(admins))
      .catch((err) => next(err));
  });

  app.get('/api/admins/:id', (req, res, next) => {
    Admin.findById(req.params.id)
      .exec()
      .then((admin) => res.json(admin))
      .catch((err) => next(err));
  });

  app.post('/api/admins', (req, res) => {
    Admin.findOne({ email: req.body.email})
      .then((admin) => {
        if(admin) {
          return Promise.reject("Admininstrator with given email already exists")
        } else {
          let password = generator.generate({
            length: passwordLength,
            numbers: true
          });
          return bcrypt.hash(password, config.BCRYPT_SALT)

        }
      })
      .then(function(hashedPassword) {
        let admin_data = {
          email: req.body.email,
          password: hashedPassword,
          name: req.body.name,
          last_name: req.body.last_name,
          created_at: Date.now()
        };

        let admin = new Admin(admin_data);
        return Promise.all([admin.save(), admin])
      })
      .then((results) => {
        let admin = results[1];
        let secret = admin.password + admin.createdAt;
        let email = admin.email;
        let token =  JWTtoken.createPasswordChangeJWToken({
          secret: secret,
          maxAge: maxAge
        });
        let link = `${config.APP_URL}${admin._id}/${token}/`;
        return mail.sendEmail(email,
          'Long Night Of Museums Registration',
          `<p>Click <a href="${link}">here</a> to start using your account.<br/>As a first step you will be asked to change your password</p>`)


      })
      .then(function() {
        res.status(200)
          .json({
            success: true})
      })
      .catch(function(err){
        res.status(401)
          .json({
            message: err || "Validation failed. Given email and password aren't matching."
          })
      });
  });
};
