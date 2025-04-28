import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import bcrypt from 'bcrypt';

import { errorLogger, errorResponder } from './middleware/errorMiddleware.js';
import { checkRequiredEnvVars } from './config/envConfig.js';
import { initializeEmailService } from './config/emailSender.js';

import Tenants_Routes from './routes/Tenants_Routes.js';
import spaceRoutes from './routes/spaceRoutes.js';
import EnergyRoutes from './routes/EnergyRoutes.js';
import CategoryLimitRoutes from './routes/CategoryLimitRoutes.js';
import UserManagementRoutes from './controllers/UserController.js';
import User from './models/UserModel.js';


dotenv.config(); 

// Check environment variables immediately
checkRequiredEnvVars();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Admin seeding from .env
async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const exists = await User.findOne({ email: ADMIN_EMAIL });
    if (!exists) {
      const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await User.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: ADMIN_EMAIL,
        password: hashed,
        role: 'admin',
        verified: true,
      });
      console.log(`✅ Seeded initial admin: ${ADMIN_EMAIL}`);
    }
  }
}

// ✅ Always seed or update chandula@example.com with admin role and password '123'
async function seedChandulaAdmin() {
  const email = 'chandula@example.com';
  const password = '123'; // ✅ New required password
  const hashed = await bcrypt.hash(password, 10);

  const existing = await User.findOne({ email });

  if (existing) {
    existing.password = hashed;
    existing.role = 'admin'; // Ensure role is admin
    existing.verified = true;
    await existing.save();
    console.log(`🔐 Updated admin password and role for: ${email}`);
  } else {
    await User.create({
      firstName: 'Chandula',
      lastName: 'Admin',
      email,
      password: hashed,
      role: 'admin',
      verified: true,
    });
    console.log(`✅ Created admin user: ${email} with default password`);
  }
}

// 🚀 Start Server
async function startServer() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB successfully');
    
    await seedAdmin();         // .env admin
    await seedChandulaAdmin(); // chandula@example.com admin

    // Initialize email service
    initializeEmailService();

    // API routes
    app.use("/api/spaces", spaceRoutes);
    app.use('/api/tenants', Tenants_Routes);
    app.use('/api/energyReadings', EnergyRoutes);
    app.use('/api/categoryLimits', CategoryLimitRoutes);
    app.use('/api/users', UserManagementRoutes);

    // Error handling middleware (must be after routes)
    app.use(errorLogger);
    app.use(errorResponder);

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on port: ${port}`);
    });
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();