const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const bannerImageRoutes = require('./routes/bannerRoutes');
const pointerRoutes = require('./routes/pointerRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const clientRoutes = require('./routes/clientRoutes');
const overviewRoutes = require('./routes/overviewRoutes'); 
const awardRoutes = require('./routes/awardRoutes');
const testimonialRoutes = require("./routes/testimonialRoutes");
const careerRoutes = require('./routes/careerRoute');
const galleryRoutes = require('./routes/galleryRoutes');
const galleryImageRoutes = require('./routes/galleryDetailRoutes');
const spotlightRoutes = require('./routes/spotlightRoutes');
dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
const corsOptions = {
    origin: function (origin, callback) {
      callback(null, origin);
    },
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.error("Error connecting to MongoDB:", err));
app.use('/api/users', userRoutes);
app.use('/api/banner-images', bannerImageRoutes);
app.use('/api/pointers', pointerRoutes);
app.use("/api/projects", projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/overview', overviewRoutes);
app.use('/api/awards', awardRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/gallery-image', galleryImageRoutes);
app.use('/api/spotlights', spotlightRoutes);

// ----query
const formSchema = new mongoose.Schema({
  car_name: String,
  car_email: String,
  car_mobile: String,
  car_location: String,
  car_role: String,
  car_resume: String,
});
const FormData = mongoose.model('FormData', formSchema);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Unique file name
  },
});

const upload = multer({ storage });

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devfreelance23m@gmail.com',
    pass: 'qdmg mskl rupy eolm',
  },
});

app.post('/api/submit', upload.single('car_resume'), async (req, res) => {
  try {
    // console.log(req.file);

    const { car_name, car_email, car_mobile, car_location, car_role } = req.body;
    const filePath = req.file ? path.join('uploads', req.file.filename) : '';
    const formData = new FormData({
      car_name,
      car_email,
      car_mobile,
      car_location,
      car_role,
      car_resume: filePath,
    });

    await formData.save();
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: car_email,
      subject: `Application Received: ${car_name}`,
      text: `Hello ${car_name},\n\nThank you for applying for the role: ${car_role}.\n\nDetails:\nName: ${car_name}\nEmail: ${car_email}\nMobile: ${car_mobile}\nLocation: ${car_location}\n\nBest regards,\nYour Company`,
      attachments: req.file
        ? [
            {
              filename: req.file.originalname,
              path: path.resolve(req.file.path),
            },
          ]
        : [],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Form submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Something went wrong!' });
  }
});
// Add this after your POST route
app.get('/api/career-queries', async (req, res) => {
  try {
    const formDataList = await FormData.find(); // Fetch all form data from the database
    res.status(200).json(formDataList); // Send the retrieved data as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Something went wrong while fetching data!' });
  }
});
app.get('/api/career-queries/count', async (req, res) => {
  try {
    const count = await FormData.countDocuments(); // Assuming you use FormData for storing career queries
    res.json({ count }); // Send the count as a response
  } catch (error) {
    console.error('Error fetching count:', error);
    res.status(500).send({ error: 'Something went wrong!' });
  }
});
// ----Contact-us----
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  message: String,
});
const ContactFormSchema = mongoose.model('ContactFormSchema', ContactSchema);

app.post('/api/contact-us', async (req, res) => {
  try {
    console.log(req.file);

    const { name, email, mobile, message} = req.body;
    const ContactData = new ContactFormSchema({
      name,
      email,
      mobile,
      message,
    });

    await ContactData.save();
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: `Application Received: ${name}`,
      text: `Hello ${name},\n\nThank you for applying for the role: ${mobile}.\n\nDetails:\nName: ${mobile}\nEmail: ${message}\nMobile: ${message}\nLocation: ${message}\n\nBest regards,\nYour Company`,
     
    };

    await transporter.sendMail(mailOptions);

    res.status(200).send({ message: 'Contact US Form submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Something went wrong!' });
  }
});

app.get('/api/contact-us', async (req, res) => {
  try {
    const contactDataList = await ContactFormSchema.find(); // Fetch all form data from the database
    res.status(200).json(contactDataList); // Send the retrieved data as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Something went wrong while fetching data!' });
  }
});
app.get('/api/contact-us/count', async (req, res) => {
  try {
    const count = await ContactFormSchema.countDocuments(); 
    res.json({ count });
  } catch (error) {
    console.error('Error fetching count:', error);
    res.status(500).send({ error: 'Something went wrong!' });
  }
});
// ----Contact-us----
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
