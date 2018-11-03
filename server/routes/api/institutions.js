const Institution = require('../../models/Institution');
const mongoose = require('mongoose');
let photosController = require('../../controllers/photos_controller');
const _ = require('lodash');


const multer = require('multer');

const Storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname.replace('server/routes/api', '') + 'client/public/InstitutionsImages');
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "." + file.mimetype.split('image/').pop()) ;
  }
});

const upload = multer({
  storage: Storage
});



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
      .then(institution => {
        if (institution) {
          let photosIds = institution.photos.map(photo => {
            return photo.id
          });
          return photosController.deletePhotos(photosIds);
        } else {
          return Promise.reject('Institution not found')
        }
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

  app.post('/api/institutions', upload.array('InstitutionPhoto', 50), (req, res) => {
    let imagesLinks = req.files.map(image => {
      return {
        path: '/api/institutionsphotos/' + image.path.split('/').pop(),
        name: image.originalname,
        id: image.path.split('/').pop()
      };
    });
    let institution_data = req.body;
    let tags = [];
    try {
      let tagsList = JSON.parse(req.body.tags);
      tags = Array.isArray(tagsList) ? tagsList : []
    } catch (err) {

    }
    institution_data['tags'] = tags;
    institution_data['created_at'] = Date.now();
    institution_data.photos = imagesLinks;
    let institution = new Institution(institution_data);
    institution.save()
      .then((institution) => {
        let id = institution._id;
        return Institution
          .aggregate([
            { $match : { _id : mongoose.Types.ObjectId(id) } },
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
          ]).exec();
      })
      .then((institutions) => {
        let formatted = Object.assign({}, institutions[0]);
        formatted.latitude = parseFloat(formatted.latitude.toString());
        formatted.longitude = parseFloat(formatted.longitude.toString());
        formatted.city.latitude = parseFloat(formatted.city.latitude.toString());
        formatted.city.longitude = parseFloat(formatted.city.longitude.toString());
        res.json(formatted);
      })
      .catch(function (err) {
        res.status(401)
          .json({
            message: err || "Could not create new institution."
          })
      });
  });

  app.put('/api/institutions/:id', upload.array('InstitutionPhoto', 50), (req, res) => {
    let oldPhotos;
    let newPhotos;
    let imagesLinks = req.files.map(image => {
      return {
        path: '/api/institutionsphotos/' + image.path.split('/').pop(),
        name: image.originalname,
        id: image.path.split('/').pop()
      };
    });

    Institution.findById(req.params.id)
      .exec()
      .then((institution) => {
       if (institution) {
         oldPhotos = institution.photos;
         newPhotos = JSON.parse(req.body.photos);
         let institutionData = req.body;
         institutionData.photos = [...newPhotos, ...imagesLinks];
         let tags = [];
         try {
           let tagsList = JSON.parse(req.body.tags);
           tags = Array.isArray(tagsList) ? tagsList : []
         } catch (err) {

         }
         institutionData['tags'] = tags;
         return institution.set(institutionData).save();
        } else {
          return Promise.reject('Institution not found')
        }
      })
      .then(() => {
        let photosToDelete = _.differenceWith(oldPhotos, newPhotos, _.isEqual);
        let photosIds = photosToDelete.map(photo => {
          return photo.id
        });
        let institutionWithCity = Institution
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
          ]).exec();
        return Promise.all([institutionWithCity, photosController.deletePhotos(photosIds)]);
      })
      .then(([institutions, ]) => {
        let formatted = Object.assign({}, institutions[0]);
        formatted.latitude = parseFloat(formatted.latitude.toString());
        formatted.longitude = parseFloat(formatted.longitude.toString());
        formatted.city.latitude = parseFloat(formatted.city.latitude.toString());
        formatted.city.longitude = parseFloat(formatted.city.longitude.toString());
        res.json(formatted);
      })
      .catch(function (err) {
        console.log(err);
        res.status(401)
          .json({
            message: err || "Could not update institution."
          })
      });
  });

};
