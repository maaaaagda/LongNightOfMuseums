const jwt = require('jsonwebtoken');
const _  = require('lodash');

const verifyJWTToken = function (token)
{
  return new Promise((resolve, reject) =>
  {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) =>
    {
      if (err || !decodedToken)
      {
        return reject(err)
      }

      resolve(decodedToken)
    })
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

  details.sessionData = _.reduce(details.sessionData || {}, (memo, val, key) =>
  {
    if (typeof val !== "function" && key !== "password")
    {
      memo[key] = val
    }
    return memo
  }, {})

  let token = jwt.sign({
    data: details.sessionData
  }, 'shhhh', {
    expiresIn: details.maxAge,
    algorithm: 'HS256'
  })

  return token
}

module.exports = {
  verifyJWTToken: verifyJWTToken,
  createJWToken: createJWToken
}
