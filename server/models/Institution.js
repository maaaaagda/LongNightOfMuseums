const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
  name: String,
  description: String,
  created_at: Date,
  visiting_plan: String,
  address: String,
  longitude: mongoose.Schema.Types.Decimal128,
  latitude: mongoose.Schema.Types.Decimal128,
  photos: Array,
  website: String,
  city_id: mongoose.Schema.ObjectId
});


module.exports = mongoose.model('Institution', InstitutionSchema);
