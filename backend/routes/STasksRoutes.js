import express from 'express';
import { 
    getTasksByTechnicianId, 
    submitTask, 
    getSubmittedTasksByTechnicianId, 
    updateSubmittedTask, 
    deleteSubmittedTask,
    deleteTaskById 
} from '../controllers/STasksController.js';

const sTasksRouter = express.Router();

sTasksRouter.get('/tasks/technician/:technicianId', getTasksByTechnicianId);
sTasksRouter.post('/tasks/submit', submitTask);
sTasksRouter.get('/submitted-tasks/technician/:technicianId', getSubmittedTasksByTechnicianId);
sTasksRouter.put('/submitted-tasks/technician/:technicianId/task/:taskId', updateSubmittedTask);
sTasksRouter.delete('/submitted-tasks/technician/:technicianId/task/:taskId', deleteSubmittedTask);

// New route to delete a task by Task_ID
sTasksRouter.delete('/tasks/:taskId', deleteTaskById);

export default sTasksRouter;