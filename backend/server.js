import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Tenants_Routes from './routes/Tenants_Routes.js';
import spaceRoutes from './routes/spaceRoutes.js';

// App configuration
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// API Routes
app.use("/api/spaces", spaceRoutes);
app.use('/api/tenants', Tenants_Routes);

// Test route
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
