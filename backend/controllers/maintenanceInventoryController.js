import MaintenanceInventory from '../models/maintenanceInventory.js';

// CREATE: Add a new inventory item
export const addMaintenanceInventory = async (req, res) => {
  const { item_ID, name, category, quantity, stockLocation, description, reorderLevel } = req.body;
  
  try {
    const newItem = new MaintenanceInventory({ item_ID, name, category, quantity, stockLocation, description, reorderLevel });
    await newItem.save();
    res.status(201).json({ message: 'Maintenance Item Added', newItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get all maintenance inventory items
export const getAllMaintenanceInventory = async (req, res) => {
  try {
    const items = await MaintenanceInventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get a specific maintenance inventory item by ID
export const getMaintenanceInventoryById = async (req, res) => {
  try {
    const item = await MaintenanceInventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Update maintenance inventory item
export const updateMaintenanceInventory = async (req, res) => {
  try {
    const updatedItem = await MaintenanceInventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Delete maintenance inventory item
export const deleteMaintenanceInventory = async (req, res) => {
  try {
    const deletedItem = await MaintenanceInventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Maintenance Item Deleted', deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
