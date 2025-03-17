import mongoose from "mongoose";

const floorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  spaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Space" }],
});

const Floor = mongoose.model("Floor", floorSchema);
export default Floor;
