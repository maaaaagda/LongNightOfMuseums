const Institution = require('../../models/Institution');
const multer = require('multer');

const Storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname.replace('server/routes/api', '') + 'client/public/InstitutionsImages');
  },
  filename: function(req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});

const upload = multer({
  storage: Storage
})

module.exports = (app) => {
  app.post('/api/uploadinstitutionphotos', upload.array('InstitutionPhoto', 10), (req, res) => {
    let imagesLinks = req.files.map(image => {
      return image.destination;
    });
    res.json(imagesLinks);
  });
};
