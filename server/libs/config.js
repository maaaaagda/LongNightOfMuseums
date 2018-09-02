switch (process.env.NODE_ENV) {
  case 'prod':
  case 'production':
    module.exports = {
      BCRYPT_SALT: 12,
      PORT: 80,
      HOST: '0.0.0.0',
      APP_URL: 'https://longnightofmuseums.herokuapp.com/'
    };

    break;

  case 'dev':
  case 'development':
  default:
    module.exports = {
      BCRYPT_SALT: 12,
      PORT: 8080,
      HOST: '0.0.0.0',
      APP_URL: 'http://0.0.0.0:8080/'
    };
}
