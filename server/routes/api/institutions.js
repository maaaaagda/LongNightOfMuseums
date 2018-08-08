const Institution = require('../../models/Institution');

module.exports = (app) => {
  app.get('/api/institutions', (req, res, next) => {
    Institution.find()
      .exec()
      .then((institutions) => res.json(institutions))
      .catch((err) => next(err));
  });

  app.delete('/api/institutions/:id', function (req, res, next) {
    Institution.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then((institution) => {
        if (institution) {
          res.status(200)
            .json({
              success: true})
        } else {
          res.status(401)
            .json({
              message:  "Institution not found"
            })
        }

      })
      .catch((err) => next(err));
  });
};
