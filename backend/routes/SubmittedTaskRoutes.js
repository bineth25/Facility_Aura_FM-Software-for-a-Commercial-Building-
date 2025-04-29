import express from 'express';
import { getTaskDetails, getAllTasks, approveTask, rejectTask } from '../controllers/SubmittedTaskController.js';

const router = express.Router();

router.get('/:Task_ID', getTaskDetails);
router.get('/', getAllTasks);
router.post('/approve/:taskId', approveTask);
router.post('/reject/:taskId', rejectTask);

export default router;