const fs = require('fs');
const multer = require('multer');
const Institution = require('../../models/Institution');

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
        path: image.path,
        name: image.originalname,
        id: image.path.split('/').pop()
      };
    });
    res.json(imagesLinks);
  });

  app.put('/api/deleteinstitutionphotos', (req, res) => {
    let photoPath = "./client/public/InstitutionsImages/" + req.body.photoId; //req.body.photoId;
    fs.unlink(photoPath, (err) => {
      if(err) {
        res.status(401).json({
          message: "Could not delete photos"
        })
      } else {
        res.json({success: "true"})
      }
    })
  })
};
