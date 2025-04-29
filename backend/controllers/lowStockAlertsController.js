
import LowStockAlert from '../models/lowStockAlerts.js';
import ErpAlertLog from '../models/erpAlertLog.js';
import InventoryItem from '../models/inventoryItem.js';
import { sendLowStockEmail } from '../config/email.js';
import { sendSlackWebhook } from '../config/webhook.js';




const buildMessage = (item) => `
🔔 LOW STOCK ALERT

📦 Item Name: ${item.name || item.itemName}
🆔 Item ID: ${item._id || item.itemId}
📉 Current Quantity: ${item.currentStock || item.currentQuantity}
🔁 Reorder Level: ${item.reorderLevel}
⏰ Time: ${new Date().toLocaleString()}

Please reorder this item through ERP.
`;

const logAlertStatus = async (item, type, status, error = '') => {
  await ErpAlertLog.create({
    itemId: item.itemId || item._id,
    itemName: item.itemName || item.name,
    reorderLevel: item.reorderLevel,
    currentQuantity: item.currentQuantity || item.currentStock,
    notificationType: type,
    status,
    errorMessage: error
  });
};


export const createLowStockAlert = async (itemId) => {
  try {
    const item = await InventoryItem.findById(itemId);
    if (!item) return;

    const alreadyAlerted = await LowStockAlert.findOne({ item: itemId });
    if (alreadyAlerted || item.currentStock > item.reorderLevel) return;

    const alert = new LowStockAlert({
      item: itemId,
      currentStock: item.currentStock,
      reorderLevel: item.reorderLevel
    });

    await alert.save();

    const msg = buildMessage(item);

    try {
      await sendLowStockEmail(process.env.ERP_EMAIL, "Low Stock Alert", msg);
      await logAlertStatus(item, 'email', 'success');
    } catch (emailErr) {
      await logAlertStatus(item, 'email', 'failed', emailErr.message);
    }

    try {
      await sendSlackWebhook(msg);
      await logAlertStatus(item, 'webhook', 'success');
    } catch (webhookErr) {
      await logAlertStatus(item, 'webhook', 'failed', webhookErr.message);
    }

  } catch (err) {
    console.error("Low stock alert error:", err.message);
  }
};


export const manualCreateAlert = async (req, res) => {
  try {
    const { itemId, itemName, reorderLevel, currentQuantity, date, time } = req.body;

    if (!itemId || !itemName || !reorderLevel || !currentQuantity || !date || !time) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const alert = new LowStockAlert({ itemId, itemName, reorderLevel, currentQuantity, date, time });
    await alert.save();

    const message = buildMessage(req.body);

    try {
      await sendLowStockEmail(process.env.ERP_EMAIL, 'Low Stock Alert', message);
      await logAlertStatus(req.body, 'email', 'success');
    } catch (err) {
      await logAlertStatus(req.body, 'email', 'failed', err.message);
    }

    try {
      await sendSlackWebhook(message);
      await logAlertStatus(req.body, 'webhook', 'success');
    } catch (err) {
      await logAlertStatus(req.body, 'webhook', 'failed', err.message);
    }

    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getAllLowStockAlerts = async (req, res) => {
  try {
    const alerts = await LowStockAlert.find().populate('item');
    res.status(200).json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch alerts.", error: err.message });
  }
};

export const deleteLowStockAlert = async (req, res) => {
  try {
    const alert = await LowStockAlert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.status(200).json({ message: "Alert deleted", alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLowStockAlert = async (req, res) => {
  try {
    const alert = await LowStockAlert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.status(200).json(alert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
