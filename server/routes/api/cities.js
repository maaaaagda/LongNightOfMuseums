const City = require('../../models/City');
const Institution = require('../../models/Institution');

module.exports = (app) => {
  app.get('/api/cities', (req, res) => {

  City.aggregate([
      {
        $lookup: {
          from: "institutions",
          localField: "_id",
          foreignField: "city_id",
          as: "institutions"
        }
      },
    {
      $project: {
        name: 1,
        longitude: 1,
        latitude: 1,
        institutions_count: { $size:"$institutions" }}
    }
    ])
    .exec()
      .then((cities) => {
        let formatted = cities.map(city => {
          city.latitude = parseFloat(city.latitude.toString());
          city.longitude = parseFloat(city.longitude.toString());
          return city;
        });
        res.send(formatted);
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

  app.put('/api/cities/namecheck', (req, res) => {
    let cityName = req.body.name;
    City.findOne({name: cityName})
      .exec()
      .then((city) => {
        if (!city) {
          return Promise.resolve();
        } else {
          return Promise.reject("City name already used")
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
