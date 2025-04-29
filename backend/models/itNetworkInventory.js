import mongoose from 'mongoose';

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
  status: {
    type: String,
    enum: ['Available', 'Low Stock', 'Out of Stock'],
    default: 'Available',
  },
  addedDate: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String, // Stores image path
    required: false,
  },
});

const ITNetworkInventory = mongoose.model('ITNetworkInventory', itNetworkInventorySchema);

export default ITNetworkInventory;