import express from 'express';
import { 
    addEnergyReading, 
    getEnergyReadings, 
    updateEnergyReading, 
    deleteEnergyReadingById 
} from '../controllers/EnergyControllers.js';

const energyRouter = express.Router();

// Define routes and link them to the controller functions
energyRouter.post('/add', addEnergyReading);
energyRouter.get('/', getEnergyReadings); // This will allow for query parameter filtering

energyRouter.put('/update/:id', updateEnergyReading);
energyRouter.delete('/delete/:id', deleteEnergyReadingById);

export default energyRouter;
