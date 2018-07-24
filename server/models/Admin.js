const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('User', AdminSchema);
