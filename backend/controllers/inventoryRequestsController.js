import InventoryRequest from '../models/inventoryRequests.js';

// CREATE: Create a new inventory issuing request
export const createInventoryRequest = async (req, res) => {
  const { request_ID, item_ID, itemName, requestedQuantity, requestedBy } = req.body;

  try {
    const newRequest = new InventoryRequest({
      request_ID,
      item_ID,
      itemName,
      requestedQuantity,
      requestedBy,
    });

    await newRequest.save();
    res.status(201).json({ message: 'Inventory Issuing Request Created', newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ: Get all inventory issuing requests
export const getAllInventoryRequests = async (req, res) => {
  try {
    const requests = await InventoryRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE: Update an inventory request
export const updateInventoryRequest = async (req, res) => {
  try {
    const updatedRequest = await InventoryRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Delete an inventory request
export const deleteInventoryRequest = async (req, res) => {
  try {
    const deletedRequest = await InventoryRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Inventory Issuing Request Deleted', deletedRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
