const mongoose = require('mongoose');

const SpotlightSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  spotlightheading: {
    type: String,
    required: true,
  },
  spotlightcontent: { 
    type: String,
    required: false,
  },
  spotlightPointer1: { 
    type: String,
    required: false,
  },
  spotlightPointer2: { 
    type: String,
    required: false,
  },
  spotlightPointer3: { 
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Spotlight', SpotlightSchema);
