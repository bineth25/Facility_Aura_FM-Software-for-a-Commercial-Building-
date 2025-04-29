import mongoose from 'mongoose';

const safetyInventorySchema = new mongoose.Schema({
  item_ID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  stockLocation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  reorderLevel: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const SafetyInventory = mongoose.model('SafetyInventory', safetyInventorySchema);

export default SafetyInventory;
