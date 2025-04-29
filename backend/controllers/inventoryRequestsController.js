import InventoryIssuingRequest from '../models/inventoryRequests.js';
import InventoryItem from '../models/inventoryItem.js';
import { sendLowStockEmail } from '../config/email.js';
import { createLowStockAlert } from './lowStockAlertsController.js'; // For Bell Icon Notifications

// ➡ Create Request
export const createInventoryRequest = async (req, res) => {
  const { requestId, itemId, requestedBy, quantity, reason } = req.body;

  try {
    const item = await InventoryItem.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const newRequest = new InventoryIssuingRequest({
      requestId,
      itemId,
      requestedBy,
      quantity,
      reason,
      status: 'Pending',
      issuedAt: new Date(),
      currentStockQuantity: item.currentStock,
      restQuantity: item.currentStock,
      reorderLevel: item.reorderLevel, // ✅ store reorder level from InventoryItem
    });

    await newRequest.save();
    res.status(201).json({ message: 'Inventory Issuing Request Created', newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➡ Get All Requests
export const getAllInventoryRequests = async (req, res) => {
  try {
    const requests = await InventoryIssuingRequest.find().populate('itemId requestedBy issuedBy');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➡ Get Request by ID
export const getInventoryRequestById = async (req, res) => {
  try {
    const request = await InventoryIssuingRequest.findById(req.params.id).populate('itemId requestedBy issuedBy');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➡ Update Inventory Request (Status / Issuance)
export const updateInventoryRequest = async (req, res) => {
  const { status, issuedBy, issuedQuantity, issuedAt } = req.body;

  try {
    const request = await InventoryIssuingRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    request.issuedBy = issuedBy;
    request.issuedQuantity = issuedQuantity;
    request.issuedAt = issuedAt ? new Date(issuedAt) : new Date();

    if (status === 'Approved') {
      const item = await InventoryItem.findById(request.itemId);
      if (!item) return res.status(404).json({ message: 'Item not found' });

      if (issuedQuantity > item.currentStock) {
        return res.status(400).json({ message: 'Issued quantity exceeds available stock!' });
      }

      item.currentStock -= issuedQuantity; // Decrease stock
      await item.save();

      request.currentStockQuantity = item.currentStock;
      request.restQuantity = item.currentStock;

      // ✅ Update reorder level too (in case item record updated)
      request.reorderLevel = item.reorderLevel;

      // ➡ Low Stock Checking for Remaining Quantity
      if (request.restQuantity <= request.reorderLevel) {
        const msg = `Low stock alert for ${item.name}. Current stock: ${item.currentStock}, Reorder level: ${item.reorderLevel}`;

        // Send email alert
        await sendLowStockEmail("erp@example.com", "Low Stock Alert", msg);

        // Create Bell Icon Notification
        await createLowStockAlert(item._id); // Log for notification display
      }
    }

    await request.save();
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➡ Delete Request
export const deleteInventoryRequest = async (req, res) => {
  try {
    const deleted = await InventoryIssuingRequest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Request not found' });
    res.status(200).json({ message: 'Deleted successfully', deleted });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
