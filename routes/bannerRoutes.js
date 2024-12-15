const express = require('express');
const multer = require('multer');
const bannerImageController = require('../controller/bannerController');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/banner-image'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

router.post('/upload', upload.fields([
  { name: 'image', maxCount: 1 },       
  { name: 'mobileImage', maxCount: 1 },   
  { name: 'tabImage', maxCount: 1 },    
]), bannerImageController.createBannerImage);

router.get('/', bannerImageController.getAllBannerImages);

router.get('/:id', bannerImageController.getBannerImageById);

router.put('/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'mobileImage', maxCount: 1 },
  { name: 'tabImage', maxCount: 1 },
]), bannerImageController.updateBannerImage);

router.delete('/:id', bannerImageController.deleteBannerImage);

module.exports = router;
