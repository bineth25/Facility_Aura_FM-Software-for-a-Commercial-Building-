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

// Get a single approved task by MongoDB _id
router.get('/:id', getApprovedTaskById);

// Get all approved tasks by Technician_ID
router.get('/technician/:technicianId', getApprovedTasksByTechnician);

export default router;