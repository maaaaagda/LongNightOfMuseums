const fs = require('fs');
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
  app.post('/api/uploadinstitutionphotos', upload.array('InstitutionPhoto', 50), (req, res) => {
    let imagesLinks = req.files.map(image => {
      return {
        path: '/api/institutionsphotos/' + image.path.split('/').pop(),
        name: image.originalname,
        id: image.path.split('/').pop()
      };
    });
    res.json(imagesLinks);
  });

  app.put('/api/deleteinstitutionphotos', (req, res) => {
    let photosIds = req.body.photosIds;
    if(photosIds.length > 0) {
      let photosExistPromises = [];
      let photosPromises = [];
      photosIds.forEach(id => {
        let photoPath = "./client/public/InstitutionsImages/" + id;
        let photoExistsPromise = new Promise((resolve, reject) => {
          fs.access(photoPath, (err) => {
            if(err) {
              reject("At least on of the institution's photos does not exist")
            } else {
              resolve()
            }
          })
        });
        photosExistPromises.push(photoExistsPromise);
      });
      Promise.all(photosExistPromises)
        .then(() => {
          photosIds.forEach(id => {
            let photoPath = "./client/public/InstitutionsImages/" + id;
            let photoPromise = new Promise ((resolve, reject) => {
              fs.unlink(photoPath, (err) => {
                if(err) {
                  reject("Could not delete the photo")
                } else {
                  resolve()
                }
              })
            });
            photosPromises.push(photoPromise);
          });
          return Promise.all(photosPromises);
        })
        .then(() => {
          res.json({success: "true"})
        })
        .catch(err => {
          res.status(401).json({
            message: err || "Something went wrong"
          })
        })
    } else {
      res.json({success: "true"})
    }

  });

  app.get('/api/institutionsphotos/:id', function (req, res) {
    let photoPath = "./client/public/InstitutionsImages/" + req.params.id;
    fs.access(photoPath, (err) => {
      if(err) {
        res.status(401).json({
          message: "Institution photo does not exist"
        })
      } else {
        res.sendFile(photoPath, {root: __dirname + "../../../../"}, function (err) {
          if (err) {
            res.status(401).json({
              message: "Something went wrong"
            })
          }
        });
      }
    })
  });
};
