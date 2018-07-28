const jwt = require('jsonwebtoken');
const _  = require('lodash');

const verifyJWTToken = function (bearer_token)
{
  return new Promise((resolve, reject) =>
  {
    var parts = bearer_token.split(' ');
    if (parts.length === 2) {
      var scheme = parts[0];
      var credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        const token = credentials;

        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) =>
        {
          if (err || !decodedToken)
          {
            return reject(err)
          }

          resolve(decodedToken)
        })
      }
      return reject(err);
    }

  })
}

const createJWToken = function (details)
{
  if (typeof details !== 'object')
  {
    details = {}
  }

  if (!details.maxAge || typeof details.maxAge !== 'number')
  {
    details.maxAge = 3600
  }

  let token = jwt.sign({
    sub: details.sessionData.email
  }, process.env.JWT_SECRET, {
    expiresIn: details.maxAge,
    algorithm: 'HS256'
  })

  return token
}

module.exports = {
  verifyJWTToken: verifyJWTToken,
  createJWToken: createJWToken
}
