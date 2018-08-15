const City = require('../../models/City');

module.exports = (app) => {
  app.get('/api/cities', (req, res) => {
    City.find()
      .exec()
      .then((cities) => {
        res.json(cities);
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
        res.json(city)
      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Something went wrong."
          })
      });
  });

  app.delete('/api/cities/:id', function (req, res) {
    City.findById(req.params.id)
      .exec()
      .then((city) => {
        if (city) {
          if (city.institutions_count === 0) {
            return City.deleteOne({_id: city._id})
          } else {
            return Promise.reject('Can not delete city assigned to at least one institution.')
          }
        } else {
          return Promise.reject("City not found")
        }
      })
      .then(() =>  {
        res.status(200)
          .json({
            success: true})
      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Something went wrong..."
          })
      });
  });

  app.put('/api/cities/:id', (req, res) => {
    City.findById(req.params.id)
      .exec()
      .then((city) => {
        city.name = req.body.name;
        return city.save()
      })
      .then((city) => {
        res.json(city);
      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Something went wrong."
          })
      });
  });
};
