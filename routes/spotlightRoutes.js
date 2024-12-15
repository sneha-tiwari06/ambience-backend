const express = require('express');
const multer = require('multer');
const spotlightController = require('../controller/spotlightController');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Make sure the 'uploads/videos' folder exists or create it if necessary
    cb(null, path.join(__dirname, '../uploads/videos'));
  },
  filename: (req, file, cb) => {
    // Use current timestamp to avoid name conflicts for videos
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer with the defined storage configuration
const upload = multer({ storage });

// Route to upload a video and create a new Spotlight
router.post('/upload', upload.single('videoUpload'), spotlightController.createSpotlight);

// Route to get all Spotlights
router.get('/', spotlightController.getAllSpotlights);

// Route to get a Spotlight by ID
router.get('/:id', spotlightController.getSpotlightById);

// Route to update a Spotlight by ID (with optional video upload)
router.put('/:id', upload.single('video'), spotlightController.updateSpotlight);

// Route to delete a Spotlight by ID (removes associated video as well)
router.delete('/:id', spotlightController.deleteSpotlight);

module.exports = router;
