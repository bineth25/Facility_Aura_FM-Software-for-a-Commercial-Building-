import express from 'express';
import { 
    addEnergyReading, 
    getEnergyReadings, 
    updateEnergyReading, 
    deleteEnergyReadingById,
    getAvgMonthlyConsumption
} from '../controllers/EnergyControllers.js';

const energyRouter = express.Router();


energyRouter.post('/add', addEnergyReading);
energyRouter.get('/', getEnergyReadings); 

//route for average monthly consumption
energyRouter.get('/avg', getAvgMonthlyConsumption);

energyRouter.put('/update/:id', updateEnergyReading);
energyRouter.delete('/delete/:id', deleteEnergyReadingById);

export default energyRouter;
