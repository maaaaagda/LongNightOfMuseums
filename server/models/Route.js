const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  name: String,
  institutions: Array
});

module.exports = mongoose.model('Route', RouteSchema);
