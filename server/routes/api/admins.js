const Admin = require('../../models/Admin');
const bcrypt = require('bcrypt');

var BCRYPT_SALT = 12;


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

    let password = req.body.password;

    bcrypt.hash(password, BCRYPT_SALT)
      .then(function(hashedPassword) {
        let admin_data = {
          email: req.body.email,
          password: hashedPassword,
          name: req.body.name,
          last_name: req.body.last_name,
          created_at: Date.now()
        };

        let admin = new Admin(admin_data);

        return admin.save()

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
}
