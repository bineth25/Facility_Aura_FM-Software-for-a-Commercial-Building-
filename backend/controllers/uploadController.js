import multer from "multer";
import path from "path";
import Tasks from "../models/Task_Assign.js";

// Set up storage engine (save in 'uploads/' folder)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Save files in 'uploads/' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

// File filter (Only images allowed)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Not an image! Please upload an image."), false);
    }
};

// Upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit: 5MB
});

// Upload image and store task details
const uploadTask = async (req, res) => {
    try {
        const { Task_ID, Task_Type, Issue_Title, category, priority, Location, Technician_ID, Technician_Name, Assigned_Date, Description } = req.body;

        // Get image path
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

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
            Description,
            image: imageUrl // Store image path
        });

        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ message: "Error uploading image", error });
    }
};

//Get all tasks
export const getAllTasks = async (req, res) => {
    try{
        const tasks = await Tasks.find();
        res.json(tasks);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

// Get task by Task_ID
export const getTaskById = async (req, res) => {
    try {
        // Search for Task by Task_ID (not by default _id)
        const task = await Tasks.findOne({ Task_ID: req.params.id }); // Match Task_ID (e.g., T123)
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task); // Return the task
    } catch (error) {
        res.status(400).json({ message: 'Error fetching task', error: error.message });
    }
};

// Update task by Task_ID
export const updateTaskById = async (req, res) => {
    try {
        const { id } = req.params; // Task_ID from URL params

        // Find task by Task_ID
        let task = await Tasks.findOne({ Task_ID: id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Extract updated fields from request body
        const { Task_Type, Issue_Title, category, priority, Location, Technician_ID, Technician_Name, Assigned_Date, Description } = req.body;

        // Check if a new image is uploaded
        let imageUrl = task.image; // Keep existing image if no new file is uploaded
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`; // Update with new image path
        }

        // Update task details
        task = await Tasks.findOneAndUpdate(
            { Task_ID: id }, // Find by Task_ID
            {
                Task_Type,
                Issue_Title,
                category,
                priority,
                Location,
                Technician_ID,
                Technician_Name,
                Assigned_Date,
                Description,
                image: imageUrl
            },
            { new: true } // Return updated document
        );

        res.json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

// Delete task by Task_ID
export const deleteTaskById = async (req, res) => {
    try {
        const { id } = req.params; // Extract Task_ID from URL params

        // Find task by Task_ID
        const task = await Tasks.findOne({ Task_ID: id });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Delete task
        await Tasks.findOneAndDelete({ Task_ID: id });

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};


export { upload, uploadTask };
