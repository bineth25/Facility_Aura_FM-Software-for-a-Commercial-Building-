import Space from "../models/Space.js";

// Get spaces by floor
export const getSpacesByFloor = async (req, res) => {
  try {
    const spaces = await Space.find({ floorId: req.params.floorId });
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new space
export const addSpace = async (req, res) => {
  try {
    const newSpace = new Space(req.body);
    await newSpace.save();
    res.json(newSpace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
