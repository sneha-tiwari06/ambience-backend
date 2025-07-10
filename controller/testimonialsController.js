const fs = require("fs");
const path = require("path");
const Testimonial = require("../model/testimonialsModel");
// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { logoAltText, imageAltText, content } = req.body;

    if (!req.files.logo) {
      return res.status(400).json({ message: "Please upload a logo." });
    }

    const logoPath = `/uploads/testimonials/${req.files.logo[0].filename}`;
    const imagePath = `/uploads/testimonials/${req.files.image[0].filename}`; 

    const newTestimonial = new Testimonial({
      logoAltText,
      imageAltText,
      content,
      logo: logoPath,
      image: imagePath,
    });

    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Other controller functions (getTestimonials, updateTestimonial, deleteTestimonial)...


// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Error fetching testimonials", error });
  }
};
// Get a testimonial by ID
exports.getTestimonialById = async (req, res) => {
    const { id } = req.params;

    try {
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }
        res.json(testimonial);
    } catch (error) {
        console.error("Error fetching testimonial by ID:", error);
        res.status(500).json({ message: "Error fetching testimonial", error });
    }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
    const { id } = req.params;

    try {
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        // Track whether an update occurred
        let updated = false;

        // Check for new logo file
        if (req.files && req.files.logo) {
            const oldLogoPath = path.join(__dirname, '..', testimonial.logo);
            if (fs.existsSync(oldLogoPath)) {
                fs.unlinkSync(oldLogoPath);
                console.log("Old logo deleted successfully.");
            }
            testimonial.logo = `/uploads/testimonials/${req.files.logo[0].filename}`;
            updated = true;
        }

        // Check for new image file
        if (req.files && req.files.image) {
            const oldImagePath = path.join(__dirname, '..', testimonial.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log("Old image deleted successfully.");
            }
            testimonial.image = `/uploads/testimonials/${req.files.image[0].filename}`;
            updated = true;
        }

        // Check for deletion of logo/image
        if (req.body.deleteLogo && testimonial.logo) {
            const oldLogoPath = path.join(__dirname, '..', testimonial.logo);
            if (fs.existsSync(oldLogoPath)) {
                fs.unlinkSync(oldLogoPath);
                console.log("Logo deleted successfully.");
            }
            testimonial.logo = ''; // Clear the logo field
            updated = true;
        }

        if (req.body.deleteImage && testimonial.image) {
            const oldImagePath = path.join(__dirname, '..', testimonial.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log("Image deleted successfully.");
            }
            testimonial.image = ''; // Clear the image field
            updated = true;
        }

        // Update other fields
        testimonial.logoAltText = req.body.logoAltText || testimonial.logoAltText;
        testimonial.imageAltText = req.body.imageAltText || testimonial.imageAltText;
        testimonial.content = req.body.content || testimonial.content;
        testimonial.isActive = req.body.isActive !== undefined ? req.body.isActive : testimonial.isActive;

        // Save the testimonial with all updates
        await testimonial.save();

        res.json(testimonial);
    } catch (error) {
        console.error("Error updating testimonial:", error);
        res.status(500).json({ message: "Error updating testimonial", error });
    }
};


// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
    const { id } = req.params;

    try {
        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return res.status(404).json({ message: "Testimonial not found" });
        }

        // Define absolute paths for logo and image
        const logoPath = path.join(__dirname, '..', testimonial.logo);
        const imagePath = path.join(__dirname, '..', testimonial.image);

        // Log paths for debugging
        // console.log("Deleting logo from:", logoPath);
        // console.log("Deleting image from:", imagePath);

        // Delete the logo file if it exists
        if (fs.existsSync(logoPath)) {
            fs.unlinkSync(logoPath);
            console.log("Logo deleted successfully.");
        } else {
            console.log("Logo file not found.");
        }

        // Delete the image file if it exists
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log("Image deleted successfully.");
        } else {
            console.log("Image file not found.");
        }

        // Delete the testimonial from the database
        await Testimonial.deleteOne({ _id: id });

        res.status(200).json({ message: "Testimonial deleted successfully!" });
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        res.status(500).json({ message: "Error deleting testimonial", error });
    }
};