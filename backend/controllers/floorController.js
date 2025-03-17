import Floor from "../models/Floor.js";

// Get all floors
export const getFloors = async (req, res) => {
  try {
    const floors = await Floor.find().populate("spaces");
    res.json(floors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new floor
export const addFloor = async (req, res) => {
  try {
    const newFloor = new Floor(req.body);
    await newFloor.save();
    res.json(newFloor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
