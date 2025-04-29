
import express from 'express';
import {
  createLowStockAlert,
  manualCreateAlert,
  getAllLowStockAlerts,
  deleteLowStockAlert,
  updateLowStockAlert
} from '../controllers/lowStockAlertsController.js';

const router = express.Router();

router.post('/', manualCreateAlert);
router.get('/', getAllLowStockAlerts);
router.put('/:id', updateLowStockAlert);
router.delete('/:id', deleteLowStockAlert);

export default router;
