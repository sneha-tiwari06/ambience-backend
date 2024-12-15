const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
