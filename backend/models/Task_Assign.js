import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    Task_ID: {
        type: String,
        required: true
    },
    Task_Type: {
        type: String,
        required: true
    },
    Issue_Title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    Technician_ID: {
        type: String,
        required: true
    },
    Technician_Name: {
        type: String,
        required: true
    },
    Assigned_Date: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: false
    }
});

const Tasks = mongoose.models.Tasks || mongoose.model('Task_Detail', taskSchema);
export default Tasks;