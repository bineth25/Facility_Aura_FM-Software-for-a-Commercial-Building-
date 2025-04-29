import Tasks from "../models/Task_Assign.js";

const uploadTask = async (req, res) => {
    try {
        const { Task_ID, Task_Type, Issue_Title, category, priority, Location, Technician_ID, Technician_Name, Assigned_Date, Description } = req.body;

        const newTask = new Tasks({
            Task_ID,
            Task_Type,
            Issue_Title,
            category,
            priority,
            Location,
            Technician_ID,
            Technician_Name,
            Assigned_Date,
            Description
        });

        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error });
    }
};

export const getAllTasks = async (req, res) => {
    try{
        const tasks = await Tasks.find();
        res.json(tasks);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Tasks.findOne({ Task_ID: req.params.id }); 
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task); 
    } catch (error) {
        res.status(400).json({ message: 'Error fetching task', error: error.message });
    }
};

export const updateTaskById = async (req, res) => {
    try {
        const { id } = req.params; 
        
        let task = await Tasks.findOne({ Task_ID: id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
 
        const { Task_Type, Issue_Title, category, priority, Location, Technician_ID, Technician_Name, Assigned_Date, Description } = req.body;
  
        task = await Tasks.findOneAndUpdate(
            { Task_ID: id }, 
            {
                Task_Type,
                Issue_Title,
                category,
                priority,
                Location,
                Technician_ID,
                Technician_Name,
                Assigned_Date,
                Description
            },
            { new: true } 
        );

        res.json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

export const deleteTaskById = async (req, res) => {
    try {
        const { id } = req.params;   
        const task = await Tasks.findOne({ Task_ID: id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
 
        await Tasks.findOneAndDelete({ Task_ID: id });

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

export { uploadTask };