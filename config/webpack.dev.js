const webpack = require('webpack');
const merge = require('webpack-merge');

const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  devtool: 'eval-source-map',

  mode: 'development',

  entry: {
    'app': [
      'webpack-hot-middleware/client?reload=true',
      './client/app/UploadImages.js'
    ]
  },
  
  output: {
    filename: 'js/[name].js',
    chunkFilename: '[id].chunk.js'
  },

  devServer: {
    inline: true,
    contentBase: './client/public',
    historyApiFallback: true,
    stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
  }
});
