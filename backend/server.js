import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import uploadRoutes from "./routes/uploadRoutes.js";
import connectDB  from './config/db.js'
import Tenants_Routes from'./routes/Tenants_Routes.js'


//app config
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true}));

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

//db connection
connectDB();

//api routes
app.use('/api/tenants', Tenants_Routes);
app.use("/api/tasks", uploadRoutes);



app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

//start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
