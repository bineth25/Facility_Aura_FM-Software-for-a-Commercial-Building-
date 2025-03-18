import express from 'express';
import { 
  addSafetyInventory, 
  getAllSafetyInventory, 
  getSafetyInventoryById, 
  updateSafetyInventory, 
  deleteSafetyInventory 
} from '../controllers/safetyInventoryController.js';

const router = express.Router();

// CREATE: Add a new safety inventory item
router.post('/add', addSafetyInventory);

// READ: Get all safety inventory items
router.get('/', getAllSafetyInventory);

// READ: Get a specific safety inventory item by ID
router.get('/:id', getSafetyInventoryById);

// UPDATE: Update safety inventory item
router.put('/update/:id', updateSafetyInventory);

// DELETE: Delete safety inventory item
router.delete('/delete/:id', deleteSafetyInventory);

export default router;
