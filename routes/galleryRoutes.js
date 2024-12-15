// server/routes/galleryRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const galleryController = require('../controller/galleryController');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/gallery'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Define routes for the gallery CRUD operations
router.post('/', upload.single('image'), galleryController.createGalleryItem);
router.get('/', galleryController.getGalleryItems);
router.get('/:id', galleryController.getGalleryItemById);
router.put('/:id', upload.single('image'), galleryController.updateGalleryItem);
router.delete('/:id', galleryController.deleteGalleryItem);

module.exports = router;
