import express from 'express';
import { 
  addITNetworkInventory, 
  getAllITNetworkInventory, 
  getITNetworkInventoryById, 
  updateITNetworkInventory, 
  deleteITNetworkInventory 
} from '../controllers/itNetworkInventoryController.js';

const router = express.Router();

// CREATE: Add a new IT & Network inventory item
router.post('/add', addITNetworkInventory);

// READ: Get all IT & Network inventory items
router.get('/', getAllITNetworkInventory);

// READ: Get a specific IT & Network inventory item by ID
router.get('/:id', getITNetworkInventoryById);

// UPDATE: Update IT & Network inventory item
router.put('/update/:id', updateITNetworkInventory);

// DELETE: Delete IT & Network inventory item
router.delete('/delete/:id', deleteITNetworkInventory);

export default router;
