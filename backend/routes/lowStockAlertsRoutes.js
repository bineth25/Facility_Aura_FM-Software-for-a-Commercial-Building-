import express from 'express';
import { 
  createLowStockAlert, 
  getAllLowStockAlerts, 
  updateLowStockAlert, 
  deleteLowStockAlert 
} from '../controllers/lowStockAlertsController.js';

const router = express.Router();

// CREATE: Create low stock alert
router.post('/alert', createLowStockAlert);

// READ: Get all low stock alerts
router.get('/', getAllLowStockAlerts);

// UPDATE: Update a low stock alert
router.put('/update/:id', updateLowStockAlert);

// DELETE: Delete a low stock alert
router.delete('/delete/:id', deleteLowStockAlert);

export default router;
