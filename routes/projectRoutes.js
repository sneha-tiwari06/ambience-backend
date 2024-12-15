const express = require("express");
const multer = require("multer");
const projectController = require("../controller/projectController");
const path = require('path');
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/projects'); // Destination folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  }
});
const upload = multer({ storage });

// Create a new project
router.post("/add", upload.single("image"), projectController.addProject);

// Get all projects
router.get("/", projectController.getAllProjects);

// Get a single project
router.get("/:id", projectController.getProjectById);

// Update a project
router.put("/:id", upload.single("image"), projectController.updateProject);

// Delete a project
router.delete("/:id", projectController.deleteProject);

module.exports = router;
