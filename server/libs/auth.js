const jwt = require('jsonwebtoken');

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
};

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
    data: details.sessionData
  }, process.env.JWT_SECRET, {
    expiresIn: details.maxAge,
    algorithm: 'HS256'
  });

  return token
};

const createPasswordChangeJWToken = function (details)
{
  if (typeof details !== 'object')
  {
    details = {}
  }

  if (!details.maxAge || typeof details.maxAge !== 'number')
  {
    details.maxAge = 300
  }

  let token = jwt.sign({}, details.secret, {
    expiresIn: details.maxAge,
    algorithm: 'HS256'
  });

  return token
};

const verifyPasswordChangeToken = function (token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decodedToken) =>
    {
      if (err || !decodedToken)
      {
        return reject(err)
      }

      resolve(decodedToken)
    });
  return reject(err);
  })
};


module.exports = {
  verifyJWTToken: verifyJWTToken,
  createJWToken: createJWToken,
  createPasswordChangeJWToken: createPasswordChangeJWToken,
  verifyPasswordChangeToken: verifyPasswordChangeToken
};
