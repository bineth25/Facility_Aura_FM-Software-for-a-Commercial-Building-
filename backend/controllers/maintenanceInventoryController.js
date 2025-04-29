import MaintenanceInventory from '../models/maintenanceInventory.js';

export const addMaintenanceInventory = async (req, res) => {
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
    const newItem = new MaintenanceInventory({
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
    res.status(201).json({ message: 'Maintenance Item Added', newItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getAllMaintenanceInventory = async (req, res) => {
  try {
    const items = await MaintenanceInventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMaintenanceInventoryById = async (req, res) => {
  try {
    const item = await MaintenanceInventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateMaintenanceInventory = async (req, res) => {
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
    const updatedItem = await MaintenanceInventory.findByIdAndUpdate(
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


export const deleteMaintenanceInventory = async (req, res) => {
  try {
    const deletedItem = await MaintenanceInventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Maintenance Item Deleted', deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
