const express = require('express');
const {
  createTestimonial,
  getAllTestimonials,
  updateTestimonial,
  getTestimonialById,
  deleteTestimonial,
} = require('../controller/testimonialsController'); // Ensure this path is correct
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/testimonials'); // Directory where files will be stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Append timestamp to avoid filename conflicts
  }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Define the routes
router.post('/', upload.fields([{ name: 'logo' }, { name: 'image' }]), createTestimonial);
router.get('/', getAllTestimonials); // This must have a valid callback function
router.put('/:id', upload.fields([{ name: 'logo' }, { name: 'image' }]), updateTestimonial);
router.get('/:id', getTestimonialById);
router.delete('/:id', deleteTestimonial);

module.exports = router;
