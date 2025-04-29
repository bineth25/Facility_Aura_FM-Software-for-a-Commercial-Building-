import express from 'express';
import {
  addITNetworkInventory,
  getAllITNetworkInventory,
  getITNetworkInventoryById,
  updateITNetworkInventory,
  deleteITNetworkInventory,
} from '../controllers/itNetworkInventoryController.js';
import upload from '../config/upload.js'; 

const router = express.Router();

router.post('/add', upload.single('image'), addITNetworkInventory);

router.get('/', getAllITNetworkInventory);

router.get('/:id', getITNetworkInventoryById);


router.put('/update/:id', upload.single('image'), updateITNetworkInventory);

router.delete('/delete/:id', deleteITNetworkInventory);

export default router;