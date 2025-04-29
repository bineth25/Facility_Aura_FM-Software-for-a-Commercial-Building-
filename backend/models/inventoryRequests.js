import mongoose from 'mongoose';

const inventoryRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  issuedAt: { type: Date, default: Date.now },
  issuedQuantity: { type: Number },
  currentStockQuantity: { type: Number },
  restQuantity: { type: Number },
  reorderLevel: { type: Number }, // ✅ added reorder level field
}, { timestamps: true });

const InventoryRequest = mongoose.model('InventoryRequest', inventoryRequestSchema);

export default InventoryRequest;
