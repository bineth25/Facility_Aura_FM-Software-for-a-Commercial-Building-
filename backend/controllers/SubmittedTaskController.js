import SubmittedTask from '../models/SubmittedTask.js';
import ApprovedTask from '../models/ApprovedTask.js';
import RejectedTask from '../models/RejectedTask.js';

export const getTaskDetails = async (req, res) => {
    try {
        const { Task_ID } = req.params;
        const taskDetails = await SubmittedTask.findOne({ Task_ID: Number(Task_ID) });

        if (!taskDetails) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(taskDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await SubmittedTask.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const approveTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        // Find the task in submitted_tasks collection
        const task = await SubmittedTask.findOne({ Task_ID: Number(taskId) });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Create a new approved task
        const approvedTask = new ApprovedTask({
            Task_ID: task.Task_ID,
            Issue_Title: task.Issue_Title,
            category: task.category,
            Location: task.Location,
            Technician_ID: task.Technician_ID,
            Technician_Name: task.Technician_Name,
            Completion_Date: task.Completion_Date,
            Description: task.Description
        });
        
        // Save to approved_tasks collection
        await approvedTask.save();
        
        // Remove from submitted_tasks collection
        await SubmittedTask.deleteOne({ Task_ID: Number(taskId) });
        
        res.status(200).json({ message: 'Task approved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { rejectionReason } = req.body;
        
        // Find the task in submitted_tasks collection
        const task = await SubmittedTask.findOne({ Task_ID: Number(taskId) });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Create a new rejected task
        const rejectedTask = new RejectedTask({
            Task_ID: task.Task_ID,
            Issue_Title: task.Issue_Title,
            category: task.category,
            Location: task.Location,
            Technician_ID: task.Technician_ID,
            Technician_Name: task.Technician_Name,
            Completion_Date: task.Completion_Date,
            Description: task.Description,
            Rejection_Reason: rejectionReason || 'No reason provided'
        });
        
        // Save to rejected_tasks collection
        await rejectedTask.save();
        
        // Remove from submitted_tasks collection
        await SubmittedTask.deleteOne({ Task_ID: Number(taskId) });
        
        res.status(200).json({ message: 'Task rejected successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};