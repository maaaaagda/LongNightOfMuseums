const City = require('../../models/City');
const mongoose = require('mongoose');

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
        res.status(400)
          .json({
            message: err || "Something went wrong."
          })
      });
  });

  app.post('/api/cities', function (req, res) {
    let city = new City(req.body);
    city.save()
      .then((city) => {
        let formatted = Object.assign({}, city);
        formatted.institutions_count = 0;
        formatted.latitude = parseFloat(city.latitude.toString());
        formatted.longitude = parseFloat(city.longitude.toString());
        formatted.name = city.name.toString();
        res.send(formatted)
      })
      .catch((err) => {
        res.status(400)
          .json({
            message: err || "Something went wrong."
          })
      });
  });

  app.delete('/api/cities/:id', function (req, res) {
    City.aggregate([
      {$match: {_id: mongoose.Types.ObjectId(req.params.id)}},
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
          institutions_count: {$size: "$institutions"}
        }
      }
    ])
      .exec()
      .then((cities) => {
        if (cities[0]) {
          let city = cities[0];
          if (city.institutions_count === 0) {
            return City.deleteOne({_id: city._id})
          } else {
            return Promise.reject('Can not delete city assigned to at least one institution.')
          }
        } else {
          return Promise.reject("City not found")
        }
      })
      .then(() => {
        res.json({
            success: true
          })
      })
      .catch((err) => {
        res.status(400)
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
        city.set(req.body);
        return city.save()
      })
      .then((city) => {
       return City.aggregate([
         {$match: {_id: mongoose.Types.ObjectId(city._id)}},
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
      })
      .then((cities) => {
        let city = cities[0];
        let formatted = Object.assign({}, city);
        formatted.latitude = parseFloat(city.latitude.toString());
        formatted.longitude = parseFloat(city.longitude.toString());
        res.send(formatted);
      })
      .catch((err) => {
        res.status(400)
          .json({
            message: err || "Something went wrong."
          })
      });
  });
};
