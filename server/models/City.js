const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  name: String,
  institutions_count: {
    type: Number,
    default: 0
  },
  longitude: mongoose.Schema.Types.Decimal128,
  latitude: mongoose.Schema.Types.Decimal128
});


CitySchema.set('toJSON', {
  getters: true,
  transform: (doc, res) => {
    if (res.latitude) {
      res.latitude = parseFloat(res.latitude.toString());
    }
    if (res.longitude) {
      res.longitude = parseFloat(res.longitude.toString());
    }
    delete res.__v;
    return res;
  },
});
module.exports = mongoose.model('City', CitySchema);
