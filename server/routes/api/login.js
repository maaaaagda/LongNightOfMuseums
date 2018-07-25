const User = require('../../models/Admin');
const JWTtoken = require('../../libs/auth');

module.exports = (app) => {
  app.post('/api/login', (req, res) => {
    let {email, password} = req.body;

    User.findOne({ email: email, password: password})
      .then((user) => (!user) ? Promise.reject("User not found.") : user)
      //.then((user) => user.comparePassword(password))
      //.then((user) => user.publicParse(user))
      .then((user) => {
        res.status(200)
          .json({
            success: true,
            token: JWTtoken.createJWToken({
              sessionData: user,
              maxAge: 3600
            })
          })
      })
      .catch((err) => {
        res.status(401)
          .json({
            message: err || "Validation failed. Given email and password aren't matching."
          })
      })
  })
}

//export default router
