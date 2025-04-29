
import mongoose from 'mongoose';

const erpAlertLogSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  currentStock: { type: Number, required: true },
  reorderLevel: { type: Number, required: true },
  alertType: { type: String, default: "Low Stock Alert" },
  notifiedAt: { type: Date, default: Date.now },
  deliveryStatus: { type: String, enum: ['Success', 'Failed'], default: 'Success' },
  deliveryChannel: { type: String, enum: ['Email', 'Slack', 'Webhook'], default: 'Email' },
  failureReason: { type: String, default: null }
}, { timestamps: true });

const ErpAlertLog = mongoose.model('ErpAlertLog', erpAlertLogSchema);

export default ErpAlertLog;
