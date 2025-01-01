
app.post('/api/submit', upload.single('car_resume'), async (req, res) => {
    try {
      console.log(req.file);
  
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
  app.get('/', async (req, res) => {
    try {
      const queries = await FormData.find();  // Fetch all career form submissions
      res.status(200).json(queries);  // Return the queries
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong while fetching queries' });
    }
  });