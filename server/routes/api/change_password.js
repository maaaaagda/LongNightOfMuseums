const Admin = require('../../models/Admin');

module.exports = (app) => {
  app.post('/api/remindpassword', (req, res) => {
    let {email} = req.body;
    Admin.findOne({ email: email})
      .then((admin) => (!admin) ? Promise.reject("Admininstrator not found.") : admin)
      .then(() => {
        res.status(200)
          .json({
            success: true
          })
      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Error"
          })
      })
  });
};
