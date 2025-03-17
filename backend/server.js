import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Tenants_Routes from './routes/Tenants_Routes.js';
import floorRoutes from './routes/floorRoutes.js';
import spaceRoutes from './routes/spaceRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';

// App configuration
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// ✅ Fix CORS issue: Allow multiple origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// Database connection
connectDB();

// API Routes
app.use("/api/floors", floorRoutes);
app.use("/api/spaces", spaceRoutes);
app.use('/api/tenants', Tenants_Routes);

// Error handling middleware
app.use(errorHandler);

// Test route
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
