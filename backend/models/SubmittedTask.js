import mongoose from 'mongoose';

const SubmittedTaskSchema = new mongoose.Schema({
    Task_ID: { type: Number, required: true },
    Issue_Title: { type: String, required: true },
    category: { type: String, required: true },
    Location: { type: String, required: true },
    Technician_ID: { type: String, required: true },
    Technician_Name: { type: String, required: true },
    Completion_Date: { type: String, required: true }, 
    Description: { type: String, required: true }
});

const SubmittedTask = mongoose.model('SubmittedTask', SubmittedTaskSchema, 'submitted_tasks');

export default SubmittedTask;