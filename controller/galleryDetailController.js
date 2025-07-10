const GalleryImage = require("../model/galleryDetailModel");
const path = require("path");
const fs = require("fs").promises; // Use promise-based fs API
const sharp = require("sharp");

exports.addGalleryImage = async (req, res) => {
  const { projectId } = req.body;
  const files = req.files;
  const captions = req.body.captions; // Get captions array from request body

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "Images are required" });
  }

  try {
    const galleryImages = await Promise.all(
      files.map(async (file, index) => {
        const caption = captions && captions[index] ? captions[index] : '';
        
        // Generate unique filename to avoid conflicts
        const timestamp = Date.now();
        const fileExtension = path.extname(file.originalname);
        const uniqueFilename = `${timestamp}-${index}-${Math.random().toString(36).substring(7)}${fileExtension}`;
        
        const originalImagePath = path.join("uploads/gallery/galleryDetails/original", uniqueFilename);
        const thumbnailImagePath = path.join("uploads/gallery/galleryDetails/thumb", uniqueFilename);

        // Resize and save the thumbnail
        await sharp(file.path)
          .resize(400)
          .toFile(thumbnailImagePath);

        // Copy the file instead of renaming
        await fs.copyFile(file.path, originalImagePath);

        // Remove the original file after copying
        await fs.unlink(file.path);

        // Save image details to the database
        const newGalleryImage = new GalleryImage({
          projectId,
          // altText,
          // projectName,
          caption, // Save individual caption for this image
          originalImagePath,
          thumbnailImagePath,
        });
        return newGalleryImage.save();
      })
    );

    res.status(201).json(galleryImages);
  } catch (error) {
    console.error("Error saving gallery images:", error);
    res.status(500).json({ message: "Error saving gallery images", error });
  }
};



// Get all images for a project
exports.getGalleryImages = async (req, res) => {
  const { id } = req.params;
  try {
    const images = await GalleryImage.find({ projectId: id });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Error fetching gallery images", error });
  }
};

// Update a gallery image
exports.updateGalleryImage = async (req, res) => {
  const { id } = req.params;
  const {  caption } = req.body;

  // console.log('Update request body:', req.body); // Debug log
  // console.log('Caption value:', caption); // Debug log

  try {
    const updateData = {};
    // if (altText !== undefined) updateData.altText = altText;
    // if (projectName !== undefined) updateData.projectName = projectName;
    if (caption !== undefined) updateData.caption = caption;

    // console.log('Update data:', updateData); // Debug log

    const updatedImage = await GalleryImage.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    console.log('Updated image:', updatedImage); // Debug log
    res.json(updatedImage);
  } catch (error) {
    console.error('Error in updateGalleryImage:', error); // Debug log
    res.status(500).json({ message: "Error updating gallery image", error });
  }
};
// Delete a gallery image
exports.deleteGalleryImage = async (req, res) => {
  const { id } = req.params;

  try {
    const imageToDelete = await GalleryImage.findByIdAndDelete(id);

    if (!imageToDelete) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    // Get the paths of the original and thumbnail images
    const originalPath = path.resolve(imageToDelete.originalImagePath);
    const thumbnailPath = path.resolve(imageToDelete.thumbnailImagePath);

    // Function to delete a file and handle errors
    const deleteFile = (filePath) => {
      return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${filePath}:`, err);
            return reject(err);
          }
          resolve();
        });
      });
    };

    // Delete the original and thumbnail images
    await Promise.all([
      fs.existsSync(originalPath) ? deleteFile(originalPath) : Promise.resolve(),
      fs.existsSync(thumbnailPath) ? deleteFile(thumbnailPath) : Promise.resolve(),
    ]);

    res.json({ message: "Gallery image deleted successfully" });
  } catch (error) {
    console.error("Error deleting gallery image:", error); // Log the error for debugging
    res.status(500).json({ message: "Error deleting gallery image", error });
  }
};
// ...existing code...

// Update image priority
exports.updateGalleryImagePriority = async (req, res) => {
  const { id } = req.params;
  const { priority } = req.body;

  try {
    const updatedImage = await GalleryImage.findByIdAndUpdate(
      id,
      { priority },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    res.json({ message: "Priority updated", image: updatedImage });
  } catch (error) {
    res.status(500).json({ message: "Error updating priority", error });
  }
};
// ...existing code...
exports.toggleThumbnail = async (req, res) => {
  const { id } = req.params;

  try {
    const image = await GalleryImage.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Gallery image not found" });
    }

    // Check if we are setting the thumbnail
    const isCurrentlyThumbnail = image.isThumbnail;

    // If setting a new thumbnail, reset other images
    if (!isCurrentlyThumbnail) {
      // Reset any other image's isThumbnail to false
      await GalleryImage.updateMany(
        { isThumbnail: true },
        { $set: { isThumbnail: false } }
      );
    }

    // Toggle the isThumbnail field
    image.isThumbnail = !isCurrentlyThumbnail;
    const updatedImage = await image.save(); // Save and return the updated image

    res.json({ message: "Thumbnail status updated", image: updatedImage });
  } catch (error) {
    console.error("Error toggling thumbnail status:", error); // Log the error
    res.status(500).json({ message: "Error toggling thumbnail status", error });
  }
};
