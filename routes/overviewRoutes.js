// src/api/overviewRoutes.js
const express = require('express');
const {
  createOverview,
  getOverviews,
  getOverviewById,
  updateOverview,
  deleteOverview,
} = require('../controller/overviewController'); // Adjusted to use require

const router = express.Router();

router.post('/', createOverview);
router.get('/', getOverviews);
router.get('/:id', getOverviewById); // New route to get overview by ID
router.put('/:id', updateOverview);
router.delete('/:id', deleteOverview);

module.exports = router; // Use module.exports instead of export default
