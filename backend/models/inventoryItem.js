import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  currentStock: { type: Number, required: true },
  reorderLevel: { type: Number, required: true },
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
export default InventoryItem;
