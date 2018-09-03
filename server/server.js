const express = require('express');
const fs = require('fs');
const historyApiFallback = require('connect-history-api-fallback');
const mongoose = require('mongoose');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const morgan = require('morgan');
const server_config = require('./libs/config');
const webpackConfig = require('../webpack.config');
const JWTtoken = require('./libs/auth');
const configDb = require('../config/config');

const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || server_config.PORT;
process.env['JWT_SECRET'] = 'shhhuwebubifoewjnfiqio789715';

// Configuration
// ================================================================================================

// Set up Mongoose
mongoose.connect(isDev ? configDb.db_dev : configDb.db, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.all('/api/*', function(req, res, next) {
  if (req.url === '/api/'
    || req.url === '/api/login'
    || req.url === '/api/remindpassword'
    || req.url ==='/api/resetpassword'
    || (req.url === '/api/cities' && req.method === 'GET')) {
    return next();
  }
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  JWTtoken.verifyJWTToken(req.headers.authorization)
    .then(() => {
      next();
    })
    .catch(() => {
      return res.status(403).json({ error: 'Wrong credentials sent!' });
    })
});

// API routes
require('./routes/index')(app);

if (isDev) {
  const compiler = webpack(webpackConfig);

  app.use(historyApiFallback({
    verbose: false
  }));

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: path.resolve(__dirname, '../client/public'),
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    },
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
}
  }));

  app.use(webpackHotMiddleware(compiler, {
    'log': false, 
    'path': '/__webpack_hmr', 
    'heartbeat': 10 * 1000
  }));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('/*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
  });
}

app.listen(port, server_config.HOST, (err) => {
  if (err) {
    console.log(err);
  }

  console.info('>>> 🌎 Open '+ server_config.APP_URL + ' in your browser.');
});

module.exports = app;
