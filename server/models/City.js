const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: String,
  institutions_count: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('City', CitySchema);
