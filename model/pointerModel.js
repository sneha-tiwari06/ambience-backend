const mongoose = require('mongoose');

const pointerSchema = new mongoose.Schema({
  pointer1: { type: String, required: true },
  pointer1Detail: { type: String},
  pointer2: { type: String, required: true },
  pointer2Detail: { type: String},
  pointer3: { type: String, required: true },
  pointer3Detail: { type: String },
  pointer4: { type: String, required: true },
  pointer4Detail: { type: String},
});

module.exports = mongoose.model('Pointers', pointerSchema);