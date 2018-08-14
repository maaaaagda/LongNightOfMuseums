const City = require('../../models/City');
const Institution = require('../../models/Institution')

module.exports = (app) => {
  app.get('/api/cities', (req, res) => {
    City.find()
      .exec()
      .then((cities) => {
        let citiesWithInstitutionsCount = cities.map((city, i) => {
          let cityWithInstitutionCount = Object.assign(city._doc, {
            institutions_count: i * i
          });
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
      .then((city) => {
        let cityWithInstitutionCount =  Object.assign(city._doc, {
          institutions_count: 0});
        res.json(cityWithInstitutionCount)
      })
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

  app.put('/api/cities/:id', (req, res) => {
    City.findById(req.params.id)
      .exec()
      .then((city) => {
        city.name = req.body.name;
        return city.save()
      })
      .then((city) => {
        return Promise.all([city, Institution.find({city_id: city._id})]);
      })
      .then((results) => {
        let city = results[0];
        let institutionsInCity = results[1];
        let cityWithInstitutionCount =  Object.assign(city._doc, {
          institutions_count: institutionsInCity.length});
        res.json(cityWithInstitutionCount);
      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Something went wrong."
          })
      });
  });
};
