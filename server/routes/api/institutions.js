const Institution = require('../../models/Institution');
const City = require('../../models/City');
const mongoose = require('mongoose');

module.exports = (app) => {
  app.get('/api/institutions/:id', function (req, res) {
    Institution
      .aggregate([
        { $match : { _id : mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "cities",
            localField: "city_id",
            foreignField: "_id",
            as: "city"
          }
        },
        {
          $unwind: "$city"
        }
      ])
      .exec()
      .then((institutions) => {
        let formatted = institutions.map(institution => {
          institution.latitude = parseFloat(institution.latitude.toString());
          institution.longitude = parseFloat(institution.longitude.toString());
          institution.city.latitude = parseFloat(institution.city.latitude.toString());
          institution.city.longitude = parseFloat(institution.city.longitude.toString());
          return institution;
        });
        res.send(formatted[0])
      })
      .catch(() => res.status(401)
        .json({
          message: "Institution not found"
        }));
  });

  app.get('/api/institutions', (req, res, next) => {
    Institution.aggregate([
      {
        $lookup:{
          from: "cities",
          localField: "city_id",
          foreignField: "_id",
          as: "city"
        }
      },
      {
        $unwind:"$city"
      }
    ]).exec()
      .then((institutions) => {
        let formatted = institutions.map(institution => {
          institution.latitude = parseFloat(institution.latitude.toString());
          institution.longitude = parseFloat(institution.longitude.toString());
          institution.city.latitude = parseFloat(institution.city.latitude.toString());
          institution.city.longitude = parseFloat(institution.city.longitude.toString());
          return institution;
        });
        res.send(formatted)
      })
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
        if(oldCityId !== newCityId) {
          let oldCityPromise = City.findById({_id: oldCityId});
          let newCityPromise = City.findById({_id: newCityId});
          return Promise.all([institution.save(), oldCityPromise, newCityPromise]);
        } else {
          return institution.save()
        }
      })
      .then(results => {
        if (Array.isArray(results)) {
          let updatedInstitution = results[0];
          let oldCity = results[1];
          let newCity = results[2];
          oldCity.institutions_count--;
          newCity.institutions_count++;
          return Promise.all([updatedInstitution, oldCity.save(), newCity.save()]);
        } else {
          return results
        }
      })
      .then(results => {
        let updatedInstitution;
        if (Array.isArray(results)) {
          updatedInstitution = results[0];
        } else {
          updatedInstitution = results;
        }
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
