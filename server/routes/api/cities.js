const City = require('../../models/City');

module.exports = (app) => {
  app.get('/api/cities', (req, res) => {
    City.find()
      .exec()
      .then((cities) => {
        let citiesWithInstitutionsCount = cities.map((city, i) => {
          let cityWithInstitutionCount =  Object.assign(city._doc, {
            institutions_count: i*i});
          return cityWithInstitutionCount
          });
        res.json(citiesWithInstitutionsCount);
        })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Something went wrong."
          })
      });
  });

  app.post('/api/cities', function (req, res) {
    const city = new City({name: req.body.name});

    city.save()
      .then(() => res.json(city))
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Something went wrong."
          })
      });
  });

  app.delete('/api/cities/:id', function (req, res, next) {
    City.findOneAndRemove({ _id: req.params.id })
      .exec()
      .then((city) => {
        if (city) {
          res.status(200)
            .json({
              success: true})
        } else {
          res.status(401)
            .json({
              message: "City not found"
            })
        }
      })
      .catch((err) => next(err));
  });

  app.put('/api/cities/:id/increment', (req, res) => {
    City.findById(req.params.id)
      .exec()
      .then((city) => {
        city.name = req.body.name;
        city.save()
          .then((city) => res.json(city))
          .catch(() => {
            return Promise.reject('Could not save city into database')
          });
      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Something went wrong."
          })
      });
  });
};
