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
  const imageFile = req.files?.image;  // Get uploaded file
  const certificateImageFile = req.files?.certificateImage; // Get uploaded certificate image file
  console.log('Uploaded  image:', imageFile); // Log the certificate image file

  console.log('Uploaded certificate image:', certificateImageFile); // Log the certificate image file

  if (!imageFile && !certificateImageFile) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  try {
    // Check if the filenames exist in the arrays
    if (imageFile && !imageFile[0]?.filename) {
      return res.status(400).json({ message: "Image file not found" });
    }

    if (certificateImageFile && !certificateImageFile[0]?.filename) {
      return res.status(400).json({ message: "Certificate image file not found" });
    }

    // Safely construct the file paths
    const imagePath = imageFile ? path.join('uploads/awards', imageFile[0].filename) : undefined;
    const certificateImagePath = certificateImageFile ? path.join('uploads/awards', certificateImageFile[0].filename) : undefined;

    // Log the constructed paths for debugging
    console.log("Image path:", imagePath);
    console.log("Certificate image path:", certificateImagePath);
    // Create the award data
    const awardData = {
      image: imagePath,
      certificateImage: certificateImagePath,
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
    if (!award) {
      return res.status(404).json({ message: 'Award not found' });
    }

    // Handle image deletion if a new image is uploaded
    if (req.files?.image) {
      const oldImagePath = path.resolve(process.cwd(), award.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete the old image from the filesystem
      }
      award.image = path.join('uploads/awards', req.files.image[0].filename); // Update image path
    }

    // Handle certificate image deletion if a new certificate image is uploaded
    if (req.files?.certificateImage) {
      const oldCertificateImagePath = path.resolve(process.cwd(), award.certificateImage);
      if (fs.existsSync(oldCertificateImagePath)) {
        fs.unlinkSync(oldCertificateImagePath); // Delete the old certificate image
      }
      award.certificateImage = path.join('uploads/awards', req.files.certificateImage[0].filename); // Update certificate image path
    }

    // Update the award's altText (or any other data fields you may want to update)
    award.altText = altText;

    // Save the updated award
    const updatedAward = await award.save();
    res.status(200).json(updatedAward);
  } catch (error) {
    console.error("Error updating award:", error); // Log the full error for debugging
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
    const certificateImagePath = path.resolve(process.cwd(), award.certificateImage);
    if (fs.existsSync(certificateImagePath)) {
      fs.unlinkSync(certificateImagePath);
    }

    await Award.deleteOne({ _id: id });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting award", error: error.message });
  }
};

// Export the multer upload middleware
exports.upload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'certificateImage', maxCount: 1 },
]);
