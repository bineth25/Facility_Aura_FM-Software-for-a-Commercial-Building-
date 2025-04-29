import mongoose from 'mongoose';

const RejectedTaskSchema = new mongoose.Schema({
    Task_ID: { type: Number, required: true },
    Issue_Title: { type: String, required: true },
    category: { type: String, required: true },
    Location: { type: String, required: true },
    Technician_ID: { type: String, required: true },
    Technician_Name: { type: String, required: true },
    Completion_Date: { type: String, required: true }, 
    Description: { type: String, required: true },
    Rejected_Date: { type: Date, default: Date.now },
    Rejection_Reason: { type: String, default: 'No reason provided' }
});

const RejectedTask = mongoose.model('RejectedTask', RejectedTaskSchema, 'rejected_tasks');

export default RejectedTask;