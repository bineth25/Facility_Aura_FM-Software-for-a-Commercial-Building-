import SafetyInventory from '../models/safetyInventory.js';


export const addSafetyInventory = async (req, res) => {
  const { item_ID, name, category, quantity, stockLocation, description, reorderLevel } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  
  let status = 'Available';
  if (quantity <= reorderLevel) {
    status = 'Low Stock';
  }
  if (quantity === 0) {
    status = 'Out of Stock';
  }

  try {
    const newItem = new SafetyInventory({
      item_ID,
      name,
      category,
      quantity,
      stockLocation,
      description,
      reorderLevel,
      image,
      status,
      addedDate: new Date(),
    });

    await newItem.save();
    res.status(201).json({ message: 'Safety Equipment Added', newItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSafetyInventory = async (req, res) => {
  try {
    const items = await SafetyInventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getSafetyInventoryById = async (req, res) => {
  try {
    const item = await SafetyInventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSafetyInventory = async (req, res) => {
  const { item_ID, name, category, quantity, stockLocation, description, reorderLevel } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

 
  let status = 'Available';
  if (quantity <= reorderLevel) {
    status = 'Low Stock';
  }
  if (quantity === 0) {
    status = 'Out of Stock';
  }

  try {
    const updatedItem = await SafetyInventory.findByIdAndUpdate(
      req.params.id,
      { item_ID, name, category, quantity, stockLocation, description, reorderLevel, image, status },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSafetyInventory = async (req, res) => {
  try {
    const deletedItem = await SafetyInventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Safety Equipment Deleted', deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};