import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // DB connection function
import Tenants_Routes from './routes/Tenants_Routes.js'; // Tenants routes
import EnergyRoutes from './routes/EnergyRoutes.js'; // Import the Energy routes
import CategoryLimitRoutes from './routes/CategoryLimitRoutes.js'; // CategoryLimit routes

dotenv.config(); // Load environment variables
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API routes
app.use('/api/tenants', Tenants_Routes); // Existing tenants route
app.use('/api/energyReadings', EnergyRoutes); // Added energy routes
app.use('/api/categoryLimits', CategoryLimitRoutes); // Category limit routes


// Default route
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
