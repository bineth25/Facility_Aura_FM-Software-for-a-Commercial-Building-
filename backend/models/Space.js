import mongoose from "mongoose";

const spaceSchema = new mongoose.Schema({
  floorId: { type: mongoose.Schema.Types.ObjectId, ref: "Floor", required: true },
  name: { type: String, required: true },
  position: { x: Number, y: Number, width: Number, height: Number },
  tenantId: { type: String, default: null },
  tenantName: { type: String, default: null },
  nic: { type: String, default: null },
  email: { type: String, default: null },
  contact: { type: String, default: null },
  leaseDuration: { type: String, default: null },
});

const Space = mongoose.model("Space", spaceSchema);
export default Space;
