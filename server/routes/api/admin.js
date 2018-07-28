const Admin = require('../../models/Admin');

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
}
