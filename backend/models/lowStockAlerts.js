import mongoose from 'mongoose';

const lowStockAlertSchema = new mongoose.Schema({
  item_ID: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  reorderLevel: {
    type: Number,
    required: true,
    min: 0,
  },
  alertGeneratedAt: {
    type: Date,
    default: Date.now,
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
});

const LowStockAlert = mongoose.model('LowStockAlert', lowStockAlertSchema);

export default LowStockAlert;
