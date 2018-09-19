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

exports.deletePhotos = function (photosIds) {
    if(photosIds.length > 0) {
      let photosPromises = [];
      photosIds.forEach(id => {
        let photoPath = "./client/public/InstitutionsImages/" + id;
        let photoPromise = new Promise ((resolve, reject) => {
          fs.unlink(photoPath, (err) => {
            if(err && err.code == 'ENOENT') {
              resolve();
            } else if (err) {
              reject("Could not delete the photo")
            } else {
              resolve()
            }
          })
        });
        photosPromises.push(photoPromise);
      });
      return Promise.all(photosPromises)
    } else {
      return Promise.resolve()
    }
  };
