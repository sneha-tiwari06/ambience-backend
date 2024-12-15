const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  logo: { type: String, required: true },
  logoAltText: { type: String, required: true },
  image: { type: String, required: true },
  imageAltText: { type: String, required: true },
  content: { type: String, required: true },
  isActive: { type: Boolean, default: true }, 
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
module.exports = Testimonial;
