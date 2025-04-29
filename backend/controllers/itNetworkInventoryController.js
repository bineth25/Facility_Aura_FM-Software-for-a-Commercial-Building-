import ITNetworkInventory from '../models/itNetworkInventory.js';

export const addITNetworkInventory = async (req, res) => {
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
    const newItem = new ITNetworkInventory({
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
    res.status(201).json({ message: 'IT and Network Inventory Item Added', newItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllITNetworkInventory = async (req, res) => {
  try {
    const items = await ITNetworkInventory.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getITNetworkInventoryById = async (req, res) => {
  try {
    const item = await ITNetworkInventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateITNetworkInventory = async (req, res) => {
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
    const updatedItem = await ITNetworkInventory.findByIdAndUpdate(
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


export const deleteITNetworkInventory = async (req, res) => {
  try {
    const deletedItem = await ITNetworkInventory.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'IT and Network Inventory Item Deleted', deletedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};