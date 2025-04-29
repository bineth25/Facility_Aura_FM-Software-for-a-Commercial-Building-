// routes/ApprovedTaskRoutes.js
import express from 'express';
import { 
  getAllApprovedTasks, 
  getApprovedTaskById,
  getApprovedTasksByTechnician 
} from '../controllers/ApprovedTaskController.js';

const router = express.Router();

// Get all approved tasks
router.get('/', getAllApprovedTasks);

// Get all approved tasks by Technician_ID
router.get('/technician/:technicianId', getApprovedTasksByTechnician);

// Get a single approved task by MongoDB _id
router.get('/:id', getApprovedTaskById);



export default router;