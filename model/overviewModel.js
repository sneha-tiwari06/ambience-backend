// src/models/Overview.js
const mongoose = require('mongoose'); // Adjusted to use require

const OverviewSchema = new mongoose.Schema({
  area: { type: String, required: true },
  deliveredProjects: { type: String, required: true },
  happyCustomers: { type: String, required: true },
  content: { type: String, required: true },
});

const Overview = mongoose.model('Overview', OverviewSchema);
module.exports = Overview; // Use module.exports instead of export default
