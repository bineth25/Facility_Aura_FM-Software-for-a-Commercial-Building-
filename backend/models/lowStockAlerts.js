import mongoose from 'mongoose';

const lowStockAlertSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'InventoryItem' }, 
  itemId: { type: String },            
  itemName: { type: String },          
  reorderLevel: { type: Number, required: true },
  currentQuantity: { type: Number, required: true },
  date: { type: String },             
  time: { type: String },              
  alertedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('LowStockAlert', lowStockAlertSchema);
