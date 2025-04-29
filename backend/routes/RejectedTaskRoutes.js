import express from 'express';
import { 
  getAllRejectedTasks, 
  getRejectedTaskById,
  getRejectedTasksByTechnician 
} from '../controllers/RejectedTaskController.js';

const router = express.Router();

// GET all rejected tasks
router.get('/', getAllRejectedTasks);

// GET rejected tasks by Technician_ID
router.get('/technician/:technicianId', getRejectedTasksByTechnician);

// GET rejected task by ID
router.get('/:id', getRejectedTaskById);



export default router;