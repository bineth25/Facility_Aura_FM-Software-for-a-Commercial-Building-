import STask from '../models/STasksModel.js';
import SubmittedTask from '../models/SubmittedTasksModel.js';

export const getTasksByTechnicianId = async (req, res) => {
    try {
        const { technicianId } = req.params;
        const tasks = await STask.find({ Technician_ID: technicianId });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const submitTask = async (req, res) => {
    try {
        const { Task_ID, Issue_Title, category, Location, Technician_ID, Technician_Name, Completion_Date, Description } = req.body;

        
        const existingTask = await SubmittedTask.findOne({ Task_ID: parseInt(Task_ID, 10) });
        if (existingTask) {
            return res.status(400).json({ message: 'Task already submitted', task: existingTask });
        }

        const newSubmittedTask = new SubmittedTask({
            Task_ID: parseInt(Task_ID, 10),
            Issue_Title,
            category,
            Location,
            Technician_ID,
            Technician_Name,
            Completion_Date,
            Description
        });

        await newSubmittedTask.save();

        res.status(201).json({ message: 'Task submitted successfully', task: newSubmittedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getSubmittedTasksByTechnicianId = async (req, res) => {
    try {
        const { technicianId } = req.params;
        const tasks = await SubmittedTask.find({ Technician_ID: technicianId });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSubmittedTask = async (req, res) => {
    try {
        const { technicianId, taskId } = req.params;
        const updateData = req.body;

        const updatedTask = await SubmittedTask.findOneAndUpdate(
            { Technician_ID: technicianId, Task_ID: taskId },
            updateData,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteSubmittedTask = async (req, res) => {
    try {
        const { technicianId, taskId } = req.params;

        const deletedTask = await SubmittedTask.findOneAndDelete({ Technician_ID: technicianId, Task_ID: taskId });

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Updated function to delete a task from task_details collection by Task_ID
export const deleteTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        // Try to find and delete with string Task_ID first
        let deletedTask = await STask.findOneAndDelete({ Task_ID: taskId });
        
        // If not found, try with numeric Task_ID
        if (!deletedTask) {
            deletedTask = await STask.findOneAndDelete({ Task_ID: parseInt(taskId, 10) });
        }

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};