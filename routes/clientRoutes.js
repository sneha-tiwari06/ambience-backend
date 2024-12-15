const express = require('express');
const multer = require('multer');
const path = require('path');
const clientController = require('../controller/clientController');
const router = express.Router();

// Setup storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/clients'); // Destination folder for client images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Create a new client
router.post('/', upload.single('image'), clientController.createClient);

// Get all clients
router.get('/', clientController.getClients);

router.get('/:id', clientController.getClientById);
// Update a client
router.put('/:id', upload.single('image'), clientController.updateClient);

// Delete a client
router.delete('/:id', clientController.deleteClient);

module.exports = router;
