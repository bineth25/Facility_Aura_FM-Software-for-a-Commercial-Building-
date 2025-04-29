import Space from '../models/Space.js';

// Add a new space
export const addSpace = async (req, res) => {
  const { floorId, spaceId, area, spaceType, description, isAvailable } = req.body;

  try {
    const newSpace = new Space({
      floorId,
      spaceId,
      area,
      spaceType,
      description,
      isAvailable,
    });

    const savedSpace = await newSpace.save();
    res.status(201).json(savedSpace);
  } catch (error) {
    res.status(500).json({ message: 'Error adding space', error });
  }
};

// Get all spaces
export const getAllSpaces = async (req, res) => {
  try {
    const spaces = await Space.find();
    res.status(200).json(spaces);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving spaces', error });
  }
};

// Update space by ID
export const updateSpace = async (req, res) => {
  const { id } = req.params;
  const { floorId, spaceId, area, spaceType, description, isAvailable } = req.body;

  try {
    const updatedSpace = await Space.findByIdAndUpdate(
      id,
      {
        floorId,
        spaceId,
        area,
        spaceType,
        description,
        isAvailable,
      },
      { new: true }
    );

    if (!updatedSpace) {
      return res.status(404).json({ message: 'Space not found' });
    }

    res.status(200).json(updatedSpace);
  } catch (error) {
    res.status(500).json({ message: 'Error updating space', error });
  }
};

// Delete space by ID
export const deleteSpace = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSpace = await Space.findByIdAndDelete(id);

    if (!deletedSpace) {
      return res.status(404).json({ message: 'Space not found' });
    }

    res.status(200).json({ message: 'Space deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting space', error });
  }
};


// Find space by ID
export const findSpaceById = async (req, res) => {
  const { id } = req.params;

  try {
    const space = await Space.findById(id);

    if (!space) {
      return res.status(404).json({ message: 'Space not found' });
    }

    res.status(200).json(space);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving space by ID', error });
  }
};

export const getSpaceAnalysis = async (req, res) => {
  try {
    const spaces = await Space.find();

    if (!spaces || spaces.length === 0) {
      return res.status(404).json({ message: "No space data found" });
    }

    // Group spaces by floorId and calculate available/occupied percentages
    const floorData = {};

    spaces.forEach(space => {
      if (!floorData[space.floorId]) {
        floorData[space.floorId] = { total: 0, available: 0 };
      }
      floorData[space.floorId].total += 1;
      if (space.isAvailable) {
        floorData[space.floorId].available += 1;
      }
    });

    // Convert to array format for frontend
    const analysisData = Object.keys(floorData).map(floorId => ({
      floorId,
      totalSpaces: floorData[floorId].total,
      availableSpaces: floorData[floorId].available,
      occupiedSpaces: floorData[floorId].total - floorData[floorId].available,
      availablePercentage: (floorData[floorId].available / floorData[floorId].total) * 100,
      occupiedPercentage: ((floorData[floorId].total - floorData[floorId].available) / floorData[floorId].total) * 100,
    }));

    res.status(200).json(analysisData);
  } catch (error) {
    console.error("Error retrieving space analysis:", error);
    res.status(500).json({ message: "Error retrieving space analysis", error });
  }
};

// Update space availability by spaceId
export const updateSpaceAvailability = async (req, res) => {
  const { spaceId } = req.params;
  const { isAvailable } = req.body;

  try {
    const updatedSpace = await Space.findOneAndUpdate(
      { spaceId }, 
      { isAvailable }, 
      { new: true } 
    );

    if (!updatedSpace) {
      return res.status(404).json({ message: 'Space not found' });
    }

    res.status(200).json(updatedSpace);
  } catch (error) {
    res.status(500).json({ message: 'Error updating space availability', error });
  }
};