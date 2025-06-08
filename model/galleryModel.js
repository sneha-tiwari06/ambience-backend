// server/models/Gallery.js
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({

  metaTitle: { type: String, required: true },
  metaKeywords: { type: String, required: true },
  metaDescription: { type: String, required: true },
   projectName: { type: String, required: true, trim: true, },
   priority: { type: Number, required: true, trim: true, },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', gallerySchema);
