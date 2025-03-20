import express from 'express';
import { addSpace, getAllSpaces, updateSpace, deleteSpace, findSpaceById, getSpaceAnalysis } from '../controllers/spaceController.js';

const router = express.Router();

// Route to add a new space
router.post('/', addSpace);

// Route to get all spaces
router.get('/', getAllSpaces);

// Route to update space by ID
router.put('/:id', updateSpace);

// Route to delete space by ID
router.delete('/:id', deleteSpace);

// Route to get space by ID
router.get('/analysis', getSpaceAnalysis);
router.get('/:id', findSpaceById);



export default router;
