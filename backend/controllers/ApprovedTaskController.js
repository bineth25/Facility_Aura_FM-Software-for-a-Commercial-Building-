// controllers/ApprovedTaskController.js
import ApprovedTask from '../models/ApprovedTask.js';

// Get all approved tasks
export const getAllApprovedTasks = async (req, res) => {
  try {
    const approvedTasks = await ApprovedTask.find();
    res.status(200).json(approvedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In ApprovedTaskController.js
export const getApprovedTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Option 1: Query by Task_ID (number) instead of _id
    const approvedTask = await ApprovedTask.findOne({ Task_ID: Number(id) });
    
    // Option 2: Keep using _id but with proper validation
    // const approvedTask = await ApprovedTask.findById(id);
    
    if (!approvedTask) {
      return res.status(404).json({ message: 'Approved task not found' });
    }
    
    res.status(200).json(approvedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get approved tasks by Technician_ID
export const getApprovedTasksByTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;
    
    // Find all tasks with matching Technician_ID
    const approvedTasks = await ApprovedTask.find({ Technician_ID: technicianId });
    
    if (!approvedTasks || approvedTasks.length === 0) {
      return res.status(404).json({ 
        message: 'No approved tasks found for this technician' 
      });
    }
    
    res.status(200).json(approvedTasks);
  } catch (error) {
    res.status(500).json({ 
      message: error.message || 'Error fetching tasks by technician' 
    });
  }
};



