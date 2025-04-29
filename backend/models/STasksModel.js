import mongoose from "mongoose";

const STaskSchema = new mongoose.Schema({
    Task_ID: { type: mongoose.Schema.Types.Mixed }, // Can be string or number
    Task_Type: String,
    Issue_Title: String,
    category: String,
    priority: String,
    Location: String,
    Technician_ID: String,
    Technician_Name: String,
    Assigned_Date: String,
    Description: String,
    //image: String
});

const STask = mongoose.model('task_details', STaskSchema);

export default STask;