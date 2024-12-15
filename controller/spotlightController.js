const Spotlight = require("../model/spotlightModel");
const path = require("path");
const fs = require("fs");

exports.createSpotlight = async (req, res) => {
    try {
        const { spotlightheading, spotlightcontent, spotlightPointer1, spotlightPointer2, spotlightPointer3 } = req.body;
        const videoFile = req.file;
console.log(req.file);
console.log(req.body);
        if (!videoFile) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const videoUrl = `/uploads/videos/${videoFile.filename}`;
        const newSpotlight = new Spotlight({
            videoUrl,
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
        const spotlightVideo = await Spotlight.find();
        res.status(200).json(spotlightVideo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.getSpotlightById = async (req, res) => {
    try {
        const spotlightVideo = await Spotlight.findById(req.params.id);
        if (!spotlightVideo) {
            return res.status(404).json({ message: "Spotlight not found." });
        }
        res.status(200).json(spotlightVideo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

exports.updateSpotlight = async (req, res) => {
    try {
        const { spotlightheading, spotlightcontent, spotlightPointer1, spotlightPointer2, spotlightPointer3 } = req.body;
        const spotlightVideo = await Spotlight.findById(req.params.id);

        if (!spotlightVideo) {
            return res.status(404).json({ message: "Spotlight not found." });
        }

        if (req.file) {
            // Delete old video file if a new one is uploaded
            const oldVideoPath = path.resolve(process.cwd(), 'uploads/videos', path.basename(spotlightVideo.videoUrl));
            
            if (fs.existsSync(oldVideoPath)) {
                fs.unlinkSync(oldVideoPath);
                console.log('Old video deleted from filesystem.');
            } else {
                console.warn('Old video file not found at path:', oldVideoPath);
            }
            spotlightVideo.videoUrl = `/uploads/videos/${req.file.filename}`;
        }

        spotlightVideo.spotlightheading = spotlightheading || spotlightVideo.spotlightheading;
        spotlightVideo.spotlightcontent = spotlightcontent || spotlightVideo.spotlightcontent;
        spotlightVideo.spotlightPointer1 = spotlightPointer1 || spotlightVideo.spotlightPointer1;
        spotlightVideo.spotlightPointer2 = spotlightPointer2 || spotlightVideo.spotlightPointer2;
        spotlightVideo.spotlightPointer3 = spotlightPointer3 || spotlightVideo.spotlightPointer3;

        await spotlightVideo.save();

        res.status(200).json({
            message: "Spotlight updated successfully.",
            data: spotlightVideo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};

exports.deleteSpotlight = async (req, res) => {
    try {
        const spotlightVideo = await Spotlight.findById(req.params.id);

        if (!spotlightVideo) {
            return res.status(404).json({ message: "Spotlight not found." });
        }

        // Delete video file from filesystem
        const videoPath = path.resolve(process.cwd(), 'uploads/videos', path.basename(spotlightVideo.videoUrl));
        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath); 
            console.log('Video deleted from filesystem.');
        } else {
            console.warn('Video file not found at path:', videoPath);
        }

        await Spotlight.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: "Spotlight deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
};
