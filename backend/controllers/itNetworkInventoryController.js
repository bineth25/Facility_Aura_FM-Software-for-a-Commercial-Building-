import ITNetworkInventory from '../models/itNetworkInventory.js';

// CREATE: Add a new IT & Network inventory item
export const addITNetworkInventory = async (req, res) => {
  const { item_ID, name, category, quantity, stockLocation, description, reorderLevel } = req.body;

  try {
    const newItem = new ITNetworkInventory({ item_ID, name, category, quantity, stockLocation, description, reorderLevel });
    await newItem.save();
    res.status(201).json({ message: 'IT & Network Item Added', newItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get all IT & Network inventory items
export const getAllITNetworkInventory = async (req, res) => {
  try {
    const items = await ITNetworkInventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get a specific IT & Network inventory item by ID
export const getITNetworkInventoryById = async (req, res) => {
  try {
    const item = await ITNetworkInventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Update IT & Network inventory item
export const updateITNetworkInventory = async (req, res) => {
  try {
    const updatedItem = await ITNetworkInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Delete IT & Network inventory item
export const deleteITNetworkInventory = async (req, res) => {
  try {
    const deletedItem = await ITNetworkInventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'IT & Network Item Deleted', deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
