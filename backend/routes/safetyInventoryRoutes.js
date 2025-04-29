import express from 'express';
import {
  addSafetyInventory,
  getAllSafetyInventory,
  getSafetyInventoryById,
  updateSafetyInventory,
  deleteSafetyInventory,
} from '../controllers/safetyInventoryController.js';
import upload from '../config/upload.js'; 

const router = express.Router();

router.post('/add', upload.single('image'), addSafetyInventory);


router.get('/', getAllSafetyInventory);

router.get('/:id', getSafetyInventoryById);

router.put('/update/:id', upload.single('image'), updateSafetyInventory);


router.delete('/delete/:id', deleteSafetyInventory);

export default router;