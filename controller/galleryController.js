// server/controllers/galleryController.js
const fs = require('fs');
const path = require('path');
const Gallery = require('../model/galleryModel'); // Import the model

const uploadPath = path.join(__dirname, '../uploads/gallery');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Create a new gallery item
exports.createGalleryItem = async (req, res) => {
  try {
    const { projectName, location, metaTitle, metaKeywords, metaDescription  } = req.body;
    const file = req.file;

    // console.log("File received:", file);
    // console.log("Body received:", req.body);

    if (!file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Define the destination path for the uploaded file
    const destinationPath = path.join(uploadPath, file.filename);

    // Move the uploaded file to the destination path
    fs.renameSync(file.path, destinationPath);
    // console.log("File moved to:", destinationPath);

    // Relative path to store in MongoDB
    const relativeImagePath = path.join('/uploads/gallery', file.filename);

    // Save to MongoDB
    const newItem = new Gallery({
      projectName,
      location,
      metaTitle,
      metaKeywords,
      metaDescription,
      image: relativeImagePath, // Store relative path only
    });

    await newItem.save();
    res.status(201).json({ message: 'Gallery item created', data: newItem });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({ message: 'Error creating gallery item', error: error.message || error });
  }
};

// READ - Fetch all gallery items
exports.getGalleryItems = async (req, res) => {
  try {
    const galleryItems = await Gallery.find();
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching gallery items', error });
  }
};

// UPDATE - Update a gallery item
exports.updateGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectName, location, metaTitle, metaKeywords, metaDescription  } = req.body;

    const updatedItem = await Gallery.findByIdAndUpdate(
      id,
      { projectName, location, metaTitle, metaKeywords, metaDescription },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.json({ message: 'Gallery item updated', data: updatedItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating gallery item', error });
  }
};
// GET - Fetch a single gallery item by ID
exports.getGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the gallery item by ID
    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    res.status(200).json({ message: 'Gallery item retrieved', data: galleryItem });
  } catch (error) {
    console.error("Error fetching gallery item by ID:", error);
    res.status(500).json({ message: 'Error fetching gallery item by ID', error });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the item in the database (replace with your actual DB logic)
    const galleryItem = await Gallery.findById(id); // Assuming you're using Mongoose

    if (!galleryItem) {
      return res.status(404).json({ message: "Gallery item not found." });
    }

    const filePath = path.join(__dirname, '../uploads/gallery', galleryItem.image); // Adjust to your file structure

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file
    } else {
      console.warn(`File not found: ${filePath}`); // Log the warning
    }

    await Gallery.findByIdAndDelete(id); // Delete the item from the database
    res.status(200).json({ message: "Gallery item deleted successfully." });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    res.status(500).json({ message: "Error deleting gallery item." });
  }
};