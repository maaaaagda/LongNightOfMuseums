const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: {
    type: String,
    default: ''
  },
  last_name: {
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('User', AdminSchema);
