const Institution = require('../../models/Institution');

module.exports = (app) => {
  app.get('/api/institutions/:id', function (req, res, next) {
    Institution.findById(req.params.id)
      .exec()
      .then((institution) => {
        res.status(200)
          .json(institution)
      })
      .catch((err) => res.status(401)
        .json({
          message:  err || "Institution not found"
        }));
  });

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

  app.post('/api/institutions', (req, res) => {
    let institution_data = req.body;
    institution_data['created_at'] = Date.now();
    let institution = new Institution(institution_data);
    institution.save()
    .then(function() {
      res.status(200)
        .json({
          success: true})
    })
    .catch(function(err){
      res.status(401)
        .json({
          message: err || "Could not create new institution."
        })
    });
  });

  app.put('/api/institutions/:id', function (req, res, next) {
    Institution.findById(req.params.id)
      .exec()
      .then((institution) => {
        institution.set(req.body);
        return institution.save();
      })
      .then(function(updatedInstitution) {
          res.status(200)
            .json(updatedInstitution )
        })
      .catch(function(err){
        res.status(401)
          .json({
            message: err || "Could not create new institution."
          })
      });
  });

};
