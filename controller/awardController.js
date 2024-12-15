const Award = require('../model/awardModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Setup storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/awards');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp and extension
  },
});

const upload = multer({ storage });

// Create a new award
exports.createAward = async (req, res) => {
  const { altText} = req.body; // Get alt text and status from the body
  const imageFile = req.file; // Get uploaded file

  if (!imageFile) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    const awardData = {
      image: path.join('uploads/awards', imageFile.filename), // Store the path to the uploaded file
      altText,
     
    };
    
    const newAward = new Award(awardData);
    await newAward.save();
    res.status(201).json(newAward);
  } catch (error) {
    res.status(500).json({ message: "Error saving award", error: error.message });
  }
};

// Read all awards
exports.getAwards = async (req, res) => {
  try {
    const awards = await Award.find();
    res.status(200).json(awards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single award by ID
exports.getAwardById = async (req, res) => {
  const { id } = req.params;

  try {
    const award = await Award.findById(id);
    if (!award) return res.status(404).json({ message: 'Award not found' });
    res.status(200).json(award);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.toggleAwardStatus = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the award and toggle the isActive field
      const award = await Award.findById(id);
      if (!award) return res.status(404).json({ message: 'Award not found' });
  
      award.isActive = !award.isActive; // Toggle the value
      const updatedAward = await award.save();
  
      res.status(200).json(updatedAward);
    } catch (error) {
      res.status(500).json({ message: "Error updating award status", error: error.message });
    }
  };
  
  
// Update an award
exports.updateAward = async (req, res) => {
  const { id } = req.params;
  const { altText } = req.body;

  try {
    const award = await Award.findById(id);
    if (!award) return res.status(404).json({ message: 'Award not found' });

    // Handle image deletion if a new image is uploaded
    if (req.file) {
      const oldImagePath = path.resolve(process.cwd(), award.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      award.image = path.join('uploads/awards', req.file.filename);
    }

    award.altText = altText;
       const updatedAward = await award.save();
    res.status(200).json(updatedAward);
  } catch (error) {
    res.status(500).json({ message: "Error updating award", error: error.message });
  }
};
exports.deleteAward = async (req, res) => {
  const { id } = req.params;

  try {
    const award = await Award.findById(id);
    if (!award) return res.status(404).json({ message: 'Award not found' });

    // Delete the image from the filesystem
    const imagePath = path.resolve(process.cwd(), award.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Award.deleteOne({ _id: id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting award", error: error.message });
  }
};

// Export the multer upload middleware
exports.upload = upload.single('image');
