import express from 'express';
import { 
  addMaintenanceInventory, 
  getAllMaintenanceInventory, 
  getMaintenanceInventoryById, 
  updateMaintenanceInventory, 
  deleteMaintenanceInventory 
} from '../controllers/maintenanceInventoryController.js';
import upload from '../config/upload.js'; 

const router = express.Router();

router.post('/add', upload.single('image'), addMaintenanceInventory);

router.get('/', getAllMaintenanceInventory);


router.get('/:id', getMaintenanceInventoryById);

router.put('/update/:id', upload.single('image'), updateMaintenanceInventory);

router.delete('/delete/:id', deleteMaintenanceInventory);

export default router;
