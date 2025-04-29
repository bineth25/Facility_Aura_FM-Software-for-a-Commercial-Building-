import mongoose from "mongoose";

const SubmittedTaskSchema = new mongoose.Schema({
    Task_ID: Number, 
    Issue_Title: String,
    category: String,
    Location: String,
    Technician_ID: String,
    Technician_Name: String,
    Completion_Date: String,
    Description: String
    
});

const SubmittedTask = mongoose.model('submitted_tasks', SubmittedTaskSchema);

export default SubmittedTask;