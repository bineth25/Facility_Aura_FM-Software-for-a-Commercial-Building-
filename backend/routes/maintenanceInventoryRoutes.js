import express from 'express';
import { 
  addMaintenanceInventory, 
  getAllMaintenanceInventory, 
  getMaintenanceInventoryById, 
  updateMaintenanceInventory, 
  deleteMaintenanceInventory 
} from '../controllers/maintenanceInventoryController.js';

const router = express.Router();

// CREATE: Add a new maintenance inventory item
router.post('/add', addMaintenanceInventory);

// READ: Get all maintenance inventory items
router.get('/', getAllMaintenanceInventory);

// READ: Get a specific maintenance inventory item by ID
router.get('/:id', getMaintenanceInventoryById);

// UPDATE: Update maintenance inventory item
router.put('/update/:id', updateMaintenanceInventory);

// DELETE: Delete maintenance inventory item
router.delete('/delete/:id', deleteMaintenanceInventory);

export default router;
