import express from 'express';
import {
    setCategoryLimit,
    getCategoryLimits,
    updateCategoryLimit,
    deleteCategoryLimit
} from '../controllers/CategoryLimitController.js';

import { addEnergyReading, getEnergyReadings, getExceededReadings } from '../controllers/EnergyControllers.js';

const router = express.Router();


router.post('/set', setCategoryLimit);


router.get('/', getCategoryLimits);


router.put('/update', updateCategoryLimit);  


router.delete('/delete', deleteCategoryLimit);  



// Route to get all exceeded energy readings
router.get('/exceeded', getExceededReadings);  

export default router;
