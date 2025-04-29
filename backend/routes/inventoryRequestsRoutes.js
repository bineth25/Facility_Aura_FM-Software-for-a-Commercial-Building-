
import express from 'express';
import {
  createInventoryRequest,
  getAllInventoryRequests,
  getInventoryRequestById,
  updateInventoryRequest,
  deleteInventoryRequest
} from '../controllers/inventoryRequestsController.js';

const router = express.Router();

router.post('/request', createInventoryRequest);
router.get('/', getAllInventoryRequests);
router.get('/:id', getInventoryRequestById);
router.put('/update/:id', updateInventoryRequest);
router.delete('/delete/:id', deleteInventoryRequest);

export default router;
