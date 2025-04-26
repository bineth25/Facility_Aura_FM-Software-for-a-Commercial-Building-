import express from 'express';
import { addSpace, getAllSpaces, updateSpace, deleteSpace, findSpaceById, getSpaceAnalysis, updateSpaceAvailability} from '../controllers/spaceController.js';

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

// Route to update space availability by spaceId
router.put('/availability/:spaceId', updateSpaceAvailability);

export default router;
