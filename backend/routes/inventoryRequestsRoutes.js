import express from 'express';
import { 
  createInventoryRequest, 
  getAllInventoryRequests, 
  updateInventoryRequest, 
  deleteInventoryRequest 
} from '../controllers/inventoryRequestsController.js';

const router = express.Router();

// CREATE: Create a new inventory issuing request
router.post('/request', createInventoryRequest);

// READ: Get all inventory issuing requests
router.get('/', getAllInventoryRequests);

// UPDATE: Update an inventory request
router.put('/update/:id', updateInventoryRequest);

// DELETE: Delete an inventory request
router.delete('/delete/:id', deleteInventoryRequest);

export default router;
