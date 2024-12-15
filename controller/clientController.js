const Client = require('../model/clientModel');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Setup storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/clients');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp and extension
  },
});

const upload = multer({ storage });

// Create a new client
exports.createClient = async (req, res) => {
  const { altText } = req.body; // Get alt text from the body
  const imageFile = req.file; // Get uploaded file

  // Check if image file is uploaded
  if (!imageFile) {
    return res.status(400).json({ message: "Image is required" });
  }

  try {
    const clientData = {
      image: path.join('uploads/clients', imageFile.filename), // Store the path to the uploaded file
      altText,
      active: true // Default to active when creating a new client
    };
    
    const newClient = new Client(clientData);
    await newClient.save();
    res.status(201).json(newClient); // Return the created client data
  } catch (error) {
    res.status(500).json({ message: "Error saving client", error: error.message });
  }
};

// Read all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients); // Return all clients
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single client by ID
exports.getClientById = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.status(200).json(client); // Return the found client
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  const { id } = req.params;
  const { altText, active } = req.body; // Add active field

  try {
    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    // Handle image deletion if a new image is uploaded
    if (req.file) {
      const oldImagePath = path.resolve(process.cwd(), client.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete old image from filesystem
      }
      client.image = path.join('uploads/clients', req.file.filename); // Update the image path
    }
    
    client.altText = altText; // Update other fields
    client.active = active !== undefined ? active : client.active; // Update active status if provided
    const updatedClient = await client.save();
    res.status(200).json(updatedClient); // Return the updated client data
  } catch (error) {
    res.status(500).json({ message: "Error updating client", error: error.message });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findById(id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    // Delete the image from the filesystem
    const imagePath = path.resolve(process.cwd(), client.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Remove image from filesystem
    }

    await Client.deleteOne({ _id: id });
    res.status(204).send(); // Send a no content response
  } catch (error) {
    res.status(500).json({ message: "Error deleting client", error: error.message });
  }
};

// Export the multer upload middleware
exports.upload = upload.single('image');
