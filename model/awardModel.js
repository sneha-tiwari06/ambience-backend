// models/awardModel.js
const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  image: { type: String, required: true },
  altText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false } // Add the status field
});

const Award = mongoose.model('Award', awardSchema);
module.exports = Award;
