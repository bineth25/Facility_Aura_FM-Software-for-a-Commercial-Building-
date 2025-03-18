import mongoose from "mongoose";

const inventoryIssuingRequestSchema = new mongoose.Schema({
  request_ID: {
    type: String,
    required: true,
    unique: true,
  },
  item_ID: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  requestedQuantity: {
    type: Number,
    required: true,
    min: 1,
  },
  requestedBy: {
    type: String,
    required: true,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  approvalDate: {
    type: Date,
  },
  issuedQuantity: {
    type: Number,
    min: 0,
    default: 0,
  },
});

const InventoryIssuingRequest = mongoose.model('InventoryIssuingRequest', inventoryIssuingRequestSchema);

export default InventoryIssuingRequest;
