const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  role: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Career', careerSchema);
