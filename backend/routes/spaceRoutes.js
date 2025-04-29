import express from 'express';
import { addSpace, getAllSpaces, updateSpace, deleteSpace, findSpaceById, getSpaceAnalysis, updateSpaceAvailability} from '../controllers/spaceController.js';

const router = express.Router();


router.post('/', addSpace);
router.get('/', getAllSpaces);
router.put('/:id', updateSpace);
router.delete('/:id', deleteSpace);
router.get('/analysis', getSpaceAnalysis);
router.get('/:id', findSpaceById);

// Route to update space availability by spaceId
router.put('/availability/:spaceId', updateSpaceAvailability);

export default router;
