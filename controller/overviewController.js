// src/api/overviewController.js
const Overview = require('../model/overviewModel'); // Adjusted to use require

// Create Overview
const createOverview = async (req, res) => {
  const newOverview = new Overview(req.body);
  try {
    const savedOverview = await newOverview.save();
    res.status(201).json(savedOverview);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Read Overviews
const getOverviews = async (req, res) => {
  try {
    const overviews = await Overview.find();
    res.status(200).json(overviews);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get Overview by ID
const getOverviewById = async (req, res) => {
  try {
    const overview = await Overview.findById(req.params.id);
    if (!overview) {
      return res.status(404).json({ message: 'Overview not found' });
    }
    res.status(200).json(overview);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Update Overview
const updateOverview = async (req, res) => {
  try {
    const updatedOverview = await Overview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedOverview);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Delete Overview
const deleteOverview = async (req, res) => {
  try {
    await Overview.findByIdAndDelete(req.params.id);
    res.status(200).json('Overview deleted.');
  } catch (err) {
    res.status(500).json(err);
  }
};

// Exporting the functions
module.exports = {
  createOverview,
  getOverviews,
  getOverviewById,
  updateOverview,
  deleteOverview,
};
