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
})//.array("selectedFile", 10);

module.exports = (app) => {
  app.post('/api/Upload', upload.array('selectedFile', 10), (req, res) => {
    console.log(req.files, req.body);
    res.send();
  });
};
