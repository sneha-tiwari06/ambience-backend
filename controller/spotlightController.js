const Spotlight = require("../model/spotlightModel");
const path = require("path");
const fs = require("fs");

exports.createSpotlight = async (req, res) => {
    try {
        const { spotlightheading, spotlightcontent, spotlightPointer1, spotlightPointer2, spotlightPointer3 } = req.body;
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const imageUrl = `uploads/images/${imageFile.filename}`;
        const newSpotlight = new Spotlight({
            imageUrl,
            spotlightheading,
            spotlightcontent,
            spotlightPointer1,
            spotlightPointer2,
            spotlightPointer3
        });
        await newSpotlight.save();
        res.status(201).json({
            message: "Spotlight created successfully.",
            data: newSpotlight,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

exports.getAllSpotlights = async (req, res) => {
    try {
        const spotlights = await Spotlight.find();
        res.status(200).json(spotlights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getSpotlightById = async (req, res) => {
    try {
        const spotlight = await Spotlight.findById(req.params.id);
        if (!spotlight) {
            return res.status(404).json({ message: "Spotlight not found." });
        }
        res.status(200).json(spotlight);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

exports.updateSpotlight = async (req, res) => {
    try {
        const { spotlightheading, spotlightcontent, spotlightPointer1, spotlightPointer2, spotlightPointer3 } = req.body;
        const spotlight = await Spotlight.findById(req.params.id);

        if (!spotlight) {
            return res.status(404).json({ message: "Spotlight not found." });
        }

        if (req.file) {
            // Delete old image file if a new one is uploaded
            const oldImagePath = path.resolve(process.cwd(), 'uploads/images', path.basename(spotlight.imageUrl));
            
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log('Old image deleted from filesystem.');
            } else {
                console.warn('Old image file not found at path:', oldImagePath);
            }
            spotlight.imageUrl = `/uploads/images/${req.file.filename}`;
        }

        // Update text fields
        spotlight.spotlightheading = spotlightheading || spotlight.spotlightheading;
        spotlight.spotlightcontent = spotlightcontent || spotlight.spotlightcontent;
        spotlight.spotlightPointer1 = spotlightPointer1 || spotlight.spotlightPointer1;
        spotlight.spotlightPointer2 = spotlightPointer2 || spotlight.spotlightPointer2;
        spotlight.spotlightPointer3 = spotlightPointer3 || spotlight.spotlightPointer3;

        await spotlight.save();

        res.status(200).json({
            message: "Spotlight updated successfully.",
            data: spotlight,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

exports.deleteSpotlight = async (req, res) => {
    try {
        const spotlight = await Spotlight.findById(req.params.id);

        if (!spotlight) {
            return res.status(404).json({ message: "Spotlight not found." });
        }

        // Delete image file from filesystem
        const imagePath = path.resolve(process.cwd(), 'uploads/images', path.basename(spotlight.imageUrl));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); 
            console.log('Image deleted from filesystem.');
        } else {
            console.warn('Image file not found at path:', imagePath);
        }

        await Spotlight.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Spotlight deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};