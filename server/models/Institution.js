const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
  name: String,
  description: String,
  created_at: Date,
  visiting_plan: String,
  address: String,
  longitude: String,
  latitude: String,
  photos: Array,
  website: String,
  city_id: String
});


module.exports = mongoose.model('Institution', InstitutionSchema);
