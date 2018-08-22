const Institution = require('../../models/Institution');
const City = require('../../models/City');


module.exports = (app) => {
  app.get('/api/institutions/:id', function (req, res) {
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

  app.delete('/api/institutions/:id', function (req, res) {
    Institution.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then((institution) => {
        if (institution) {
          return City.findById({_id: institution.city_id});
        } else {
          return Promise.reject('Institution not found')
        }

      })
      .then((city) => {
        city.institutions_count--;
        return city.save();
      })
      .then(() => {
        res.status(200)
          .json({
            success: true})
      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Could not delete institution"
          })
      });
  });

  app.post('/api/institutions', (req, res) => {
    let institution_data = req.body;
    institution_data['created_at'] = Date.now();
    let institution = new Institution(institution_data);
    institution.save()
      .then((institution) => {
        return City.findById({_id: institution.city_id});
      })
      .then((city) => {
        city.institutions_count++;
        return city.save();
      })
      .then(() => {
        res.status(200)
          .json({
            success: true
          });
      })
      .catch(function (err) {
        res.status(401)
          .json({
            message: err || "Could not create new institution."
          })
      });
  });

  app.put('/api/institutions/:id', function (req, res) {
    let oldCityId;
    let newCityId = req.body.city_id;
    Institution.findById(req.params.id)
      .exec()
      .then((institution) => {
        oldCityId = institution.city_id;
        institution.set(req.body);
        let oldCityPromise = City.findById({_id: oldCityId});
        let newCityPromise = City.findById({_id: newCityId});
        return Promise.all([institution.save(), oldCityPromise, newCityPromise]);
      })
      .then(results => {
        let updatedInstitution = results[0];
        let oldCity = results[1];
        let newCity = results[2];
        oldCity.institutions_count--;
        newCity.institutions_count++;
        return Promise.all([updatedInstitution, oldCity.save(), newCity.save()]);
      })
      .then(results => {
        let updatedInstitution = results[0];
        res.status(200)
          .json(updatedInstitution)
      })
      .catch(function (err) {
        res.status(401)
          .json({
            message: err || "Could not updateinstitution."
          })
      });
  });

};
