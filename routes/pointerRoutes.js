// routes/careerRoutes.js
const express = require('express');
const router = express.Router();
const pointerController = require('../controller/pointerController');

router.post('/', pointerController.createPointers);
router.get('/', pointerController.getAllPointers);
router.get('/:id', pointerController.getPointersById);
router.put('/:id', pointerController.updatePointers);
router.delete('/:id', pointerController.deletePointers);

module.exports = router;
