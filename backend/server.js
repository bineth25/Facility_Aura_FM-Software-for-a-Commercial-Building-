// Import necessary modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // MongoDB connection config
// Importing routes for different inventory models
import maintenanceInventoryRoutes from './routes/maintenanceInventoryRoutes.js';
import safetyInventoryRoutes from './routes/safetyInventoryRoutes.js';
import itNetworkInventoryRoutes from './routes/itNetworkInventoryRoutes.js';
import inventoryRequestsRoutes from './routes/inventoryRequestsRoutes.js';
import lowStockAlertsRoutes from './routes/lowStockAlertsRoutes.js';

// Initialize dotenv to access environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Set up the port, use 4000 as default if not defined in .env
const port = process.env.PORT || 4000;

// Middleware setup
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Request Sharing

// Database connection
connectDB(); // Connect to MongoDB using the connectDB function

// API Routes - Add routes for the different inventory models
app.use('/api/maintenance-inventory', maintenanceInventoryRoutes); // Route for Maintenance Inventory
app.use('/api/safety-inventory', safetyInventoryRoutes); // Route for Safety Inventory
app.use('/api/it-network-inventory', itNetworkInventoryRoutes); // Route for IT & Network Inventory
app.use('/api/inventory-requests', inventoryRequestsRoutes); // Route for Inventory Issuing Requests
app.use('/api/low-stock-alerts', lowStockAlertsRoutes); // Route for Low Stock Alerts

// Default route to test the server
app.get('/', (req, res) => {
  res.status(200).send('Hello World'); // Responds with "Hello World"
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`); // Logs when the server starts
});
