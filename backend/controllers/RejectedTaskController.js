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

// In RejectedTaskController.js
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
    const technicianId = req.params.technicianId;
    const rejectedTasks = await RejectedTask.find({ Technician_ID: technicianId });
    
    if (!rejectedTasks || rejectedTasks.length === 0) {
      return res.status(404).json({ 
        message: 'No rejected tasks found for this technician' 
      });
    }
    
    res.status(200).json(rejectedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



