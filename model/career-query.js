const mongoose = require('mongoose');
const formSchema = new mongoose.Schema({
  car_name: String,
  car_email: String,
  car_mobile: String,
  car_location: String,
  car_role: String,
  car_resume: String,
});
const FormData = mongoose.model('FormData', formSchema);
module.exports = FormData;