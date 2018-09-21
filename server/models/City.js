const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: String,
  longitude: mongoose.Schema.Types.Decimal128,
  latitude: mongoose.Schema.Types.Decimal128
});

module.exports = mongoose.model('City', CitySchema);
