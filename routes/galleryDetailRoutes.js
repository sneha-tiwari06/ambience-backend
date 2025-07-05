// routes/galleryImageRoutes.js
const express = require("express");
const multer = require("multer");
const {
  addGalleryImage,
  getGalleryImages,
  updateGalleryImage,
  deleteGalleryImage,
  toggleThumbnail,
  updateGalleryImagePriority,
} = require("../controller/galleryDetailController");

const router = express.Router();
const upload = multer({ dest: 'uploads/gallery/temp/' }); // Temporary upload folder for original files

// Route for adding new gallery images
router.post('/:id', upload.array('images'), addGalleryImage);

// Route for fetching gallery images for a project
router.get('/:id', getGalleryImages);

// Route for updating a specific gallery image
router.put('/:id', updateGalleryImage);

// Route for deleting a specific gallery image
router.delete('/:id', deleteGalleryImage);
// router.put('/:id/toggle-thumbnail', toggleThumbnail);
router.put("/:id/priority", updateGalleryImagePriority);



module.exports = router;
