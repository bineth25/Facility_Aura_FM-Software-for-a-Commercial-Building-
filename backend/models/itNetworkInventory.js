import mongoose from "mongoose";

const itNetworkInventorySchema = new mongoose.Schema({
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
    min: 0,
  },
  stockLocation: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Available', 'Issued', 'Out of Stock'],
    default: 'Available',
  },
  reorderLevel: {
    type: Number,
    required: true,
    min: 0,
  },
});

const ITNetworkInventory = mongoose.model('ITNetworkInventory', itNetworkInventorySchema);

export default ITNetworkInventory;
