const Institution = require('../../models/Institution');

module.exports = (app) => {
  app.get('/api/institutions', (req, res, next) => {
    Institution.find()
      .exec()
      .then((institutions) => res.json(institutions))
      .catch((err) => next(err));
  });
}
