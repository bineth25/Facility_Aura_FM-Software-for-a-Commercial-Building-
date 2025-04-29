// controllers/RejectedTaskController.js
import RejectedTask from '../models/RejectedTask.js';

// Get all rejected tasks
export const getAllRejectedTasks = async (req, res) => {
  try {
    const rejectedTasks = await RejectedTask.find();
    res.status(200).json(rejectedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get rejected task by ID
export const getRejectedTaskById = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id); // Convert to number
    const rejectedTask = await RejectedTask.findOne({ Task_ID: taskId });
    
    if (!rejectedTask) {
      return res.status(404).json({ message: 'Rejected task not found' });
    }
    
    res.status(200).json(rejectedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get rejected tasks by Technician_ID
export const getRejectedTasksByTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;
    console.log('Fetching rejected tasks for technician:', technicianId);
    
    // Find all tasks with matching Technician_ID - case insensitive search
    const rejectedTasks = await RejectedTask.find({ 
      Technician_ID: { $regex: new RegExp('^' + technicianId + '$', 'i') } 
    });
    
    console.log(`Found ${rejectedTasks.length} rejected tasks for technician ${technicianId}`);
    
    if (!rejectedTasks || rejectedTasks.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }
    
    res.status(200).json(rejectedTasks);
  } catch (error) {
    console.error('Error fetching rejected tasks by technician:', error);
    res.status(500).json({ message: error.message });
  }
};