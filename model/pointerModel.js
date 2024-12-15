const mongoose = require('mongoose');

const pointerSchema = new mongoose.Schema({
  pointer1: { type: String, required: true },
  pointer2: { type: String, required: true },
  pointer3: { type: String, required: true },
  pointer4: { type: String, required: true },
});

module.exports = mongoose.model('Pointers', pointerSchema);
