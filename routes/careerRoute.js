// routes/careerRoutes.js
const express = require('express');
const router = express.Router();
const careerController = require('../controller/careerController');

router.post('/', careerController.createCareer);
router.get('/', careerController.getAllCareers);
router.get('/:id', careerController.getCareerById);
router.put('/:id', careerController.updateCareer);
router.delete('/:id', careerController.deleteCareer);

module.exports = router;
