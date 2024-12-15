// routes/awardRoutes.js
const express = require('express');
const { createAward, getAwards, getAwardById, updateAward, deleteAward, upload } = require('../controller/awardController');
const router = express.Router();
const awardController = require('../controller/awardController');

router.post('/', upload, createAward); // Create award
router.get('/', getAwards); // Get all awards
router.get('/:id', getAwardById); // Get award by ID
router.put('/:id', upload, updateAward); // Update award
router.delete('/:id', deleteAward); // Delete award
router.patch('/:id/toggle-status', awardController.toggleAwardStatus);
module.exports = router;
