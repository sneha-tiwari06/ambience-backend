
const Pointers = require('../model/pointerModel');

exports.createPointers = async (req, res) => {
  try {
    const pointers = new Pointers(req.body);
    await pointers.save();
    res.status(201).json(pointers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAllPointers = async (req, res) => {
  try {
    const pointers = await Pointers.find();
    res.status(200).json(pointers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPointersById = async (req, res) => {
  try {
    const pointers = await Pointers.findById(req.params.id);
    if (!pointers) return res.status(404).json({ error: 'Pointer not found' });
    res.status(200).json(pointers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePointers = async (req, res) => {
  try {
    const pointers = await Pointers.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pointers) return res.status(404).json({ error: 'Pointers not found' });
    res.status(200).json(pointers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePointers = async (req, res) => {
  try {
    const pointers = await Pointers.findByIdAndDelete(req.params.id);
    if (!pointers) return res.status(404).json({ error: 'Pointers not found' });
    res.status(200).json({ message: 'Pointers deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
