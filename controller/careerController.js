// controllers/careerController.js
const Career = require('../model/career');

// Create a new career entry
exports.createCareer = async (req, res) => {
  try {
    const career = new Career(req.body);
    await career.save();
    res.status(201).json(career);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all career entries
exports.getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find();
    res.status(200).json(careers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single career entry by ID
exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ error: 'Career not found' });
    res.status(200).json(career);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a career entry
exports.updateCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!career) return res.status(404).json({ error: 'Career not found' });
    res.status(200).json(career);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a career entry
exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findByIdAndDelete(req.params.id);
    if (!career) return res.status(404).json({ error: 'Career not found' });
    res.status(200).json({ message: 'Career deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
