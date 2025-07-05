const Project = require("../model/projectModel");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../uploads/projects");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
exports.addProject = (req, res) => {
  const { projectName, areas, altText, workBy, locations, category } = req.body;
  const imageFile = req.file;
  console.log("Raw locations:", req.body.locations);

  if (!imageFile) {
    return res.status(400).json({ message: "Image is required" });
  }

  const imagePath = path.join("uploads/projects", imageFile.filename);

  let parsedAreas;
  try {
    parsedAreas = JSON.parse(areas).map(Number);
    if (parsedAreas.some(isNaN)) {
      return res.status(400).json({ message: "All areas must be valid numbers." });
    }
  } catch (error) {
    return res.status(400).json({ message: "Invalid areas format.", error });
  }

  let parsedLocations = [];
  try {
    if (!req.body.locations || req.body.locations.trim() === "") {
      throw new Error("Locations field is missing or empty.");
    }
    parsedLocations = JSON.parse(req.body.locations).map((loc) => loc.trim());
    if (parsedLocations.some((loc) => loc === "")) {
      throw new Error("All locations must be valid non-empty strings.");
    }
    console.log("Parsed locations:", parsedLocations);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid locations format.",
      error: error.message || error,
    });
  }
  
  const newProject = new Project({
    projectName,
    imagePath,
    areas: parsedAreas,
    altText,
    workBy,
    locations: parsedLocations,
    category,
  });

  newProject
    .save()
    .then(() => res.status(201).json({ message: "Project added successfully!" }))
    .catch((err) => res.status(500).json({ message: "Error saving project", error: err }));
};

exports.getAllProjects = (req, res) => {
  Project.find()
    .then(projects => res.json(projects))
    .catch(err => res.status(500).json({ message: "Error fetching projects", error: err }));
};

exports.getProjectById = (req, res) => {
  const { id } = req.params;

  Project.findById(id)
    .then(project => {
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    })
    .catch(err => res.status(500).json({ message: "Error fetching project", error: err }));
};
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { projectName, areas, altText, workBy, locations, isActive, showOnHomePage, category } = req.body;
  let imagePath;

  // console.log("Received body:", req.body); 

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.file) {
      const oldImagePath = path.resolve(process.cwd(), project.imagePath);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
        console.log("Old image deleted from filesystem.");
      }
      imagePath = path.join("uploads/projects", req.file.filename);
    }

    // Validate and process `areas`
    let validatedAreas = project.areas; // Default to existing areas
    if (areas !== undefined) {
      if (typeof areas === "string") {
        try {
          validatedAreas = JSON.parse(areas).map(Number);
        } catch (error) {
          return res.status(400).json({ message: "Invalid areas format." });
        }
      } else if (Array.isArray(areas)) {
        validatedAreas = areas.map(Number);
      } else {
        return res.status(400).json({ message: "Areas must be an array or JSON string." });
      }

      // Check for invalid numbers
      if (validatedAreas.some(isNaN)) {
        return res.status(400).json({ message: "All areas must be valid numbers." });
      }
    }

    // Validate and process `locations`
    let validatedLocations = project.locations; // Default to existing locations
    if (locations !== undefined) {
      if (typeof locations === "string") {
        try {
          validatedLocations = JSON.parse(locations).map((loc) => loc.trim());
        } catch (error) {
          return res.status(400).json({ message: "Invalid locations format." });
        }
      } else if (Array.isArray(locations)) {
        validatedLocations = locations.map((loc) => loc.trim());
      } else {
        return res.status(400).json({ message: "Locations must be an array or JSON string." });
      }

      // Check for empty strings
      if (validatedLocations.some((loc) => loc === "")) {
        return res.status(400).json({ message: "All locations must be valid non-empty strings." });
      }
    }

    // Update project fields
    if (projectName !== undefined) project.projectName = projectName;
    project.areas = validatedAreas;
    if (altText !== undefined) project.altText = altText;
    if (workBy !== undefined) project.workBy = workBy;
    project.locations = validatedLocations;
    if (isActive !== undefined) project.isActive = isActive;
    if (showOnHomePage !== undefined) project.showOnHomePage = showOnHomePage;
    if (category !== undefined) project.category = category;
    if (imagePath) {
      project.imagePath = imagePath;
    }

    const updatedProject = await project.save();
    res.json({ message: "Project updated successfully!", updatedProject });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ message: "Error updating project", error: err });
  }
};
exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const imagePath = path.resolve(process.cwd(), project.imagePath);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("Image deleted from filesystem.");
    }

    await Project.deleteOne({ _id: id });
    res.status(200).json({ message: "Project deleted successfully!" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ message: "Error deleting project", error: err });
  }
};