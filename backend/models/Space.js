import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema({
  floorId: {
    type: String,
    required: true
  },
  spaceId: {
    type: String,
    required: true,
    unique: true
  },
  area: {
    type: Number,
    required: true,
  },
  spaceType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant_Detail', 
    default: null
  }

});

const Space = mongoose.models.Space || mongoose.model("Space", spaceSchema);
export default Space;
