const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  image: { type: String, required: true },
  altText: { type: String, required: true },
  active: { type: Boolean, default: true }, // Field for active/inactive status
}, { timestamps: true }); // This will automatically add createdAt and updatedAt fields

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;
