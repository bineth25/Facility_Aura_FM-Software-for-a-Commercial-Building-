import express from 'express';
import {
    setCategoryLimit,
    getCategoryLimits,
    updateCategoryLimit,
    deleteCategoryLimit
} from '../controllers/CategoryLimitController.js';

import { addEnergyReading, getEnergyReadings, getExceededReadings } from '../controllers/EnergyControllers.js';

const router = express.Router();

// Route to set or update the max consumption limit for a category
router.post('/set', setCategoryLimit);

// Route to get all the configured category limits
router.get('/', getCategoryLimits);

// Route to update an existing category limit
router.put('/update', updateCategoryLimit);  // Update route

// Route to delete a category limit
router.delete('/delete', deleteCategoryLimit);  // Delete route

// Route to add an energy reading
router.post('/add', addEnergyReading);

// Route to get all exceeded energy readings
router.get('/exceeded', getExceededReadings);  // Fetch the exceeded readings

export default router;
