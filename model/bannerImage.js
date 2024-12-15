const mongoose = require('mongoose');

const BannerImageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  mobileImageUrl: {
    type: String, 
    required: false,
  },
  tabImageUrl: {
    type: String,
    required: false, 
  },
  altText: {
    type: String,
    required: true,
  },
  bannerText: { 
    type: String,
    required: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('BannerImage', BannerImageSchema);
