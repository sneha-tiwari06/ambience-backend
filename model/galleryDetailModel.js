// models/galleryDetailModel.js
const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  // altText: { type: String, required: true },
  // projectName: { type: String, required: true },
  originalImagePath: { type: String, required: true },
  thumbnailImagePath: { type: String, required: true },
  isThumbnail: { type: Boolean, default: false },
  caption: { type: String, default: '' },
  priority: {
  type: Number,
},
}, { timestamps: true });

const GalleryImage = mongoose.model('GalleryImage', galleryImageSchema);

module.exports = GalleryImage;
