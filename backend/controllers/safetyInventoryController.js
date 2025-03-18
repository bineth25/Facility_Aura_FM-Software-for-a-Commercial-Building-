import SafetyInventory from '../models/safetyInventory.js';

// CREATE: Add a new safety inventory item
export const addSafetyInventory = async (req, res) => {
  const { item_ID, name, category, quantity, stockLocation, description, reorderLevel } = req.body;

  try {
    const newItem = new SafetyInventory({ item_ID, name, category, quantity, stockLocation, description, reorderLevel });
    await newItem.save();
    res.status(201).json({ message: 'Safety Item Added', newItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get all safety inventory items
export const getAllSafetyInventory = async (req, res) => {
  try {
    const items = await SafetyInventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get a specific safety inventory item by ID
export const getSafetyInventoryById = async (req, res) => {
  try {
    const item = await SafetyInventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Update safety inventory item
export const updateSafetyInventory = async (req, res) => {
  try {
    const updatedItem = await SafetyInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Delete safety inventory item
export const deleteSafetyInventory = async (req, res) => {
  try {
    const deletedItem = await SafetyInventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Safety Item Deleted', deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
