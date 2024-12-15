const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  imagePath: { type: String, required: true },
  areas: [{ type: Number, required: true }], 
  altText: { type: String, required: true },
  workBy: { type: String, required: true },
  locations: { type: [String], required: true },
  category: {
    type: String,
    enum: ['ongoing', 'completed'],
    default: '',
},
  isActive: { type: Boolean, default: true },     
  showOnHomePage: { type: Boolean, default: false }, 
}, { timestamps: true });

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
