// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // DB connection function
import Tenants_Routes from './routes/Tenants_Routes.js';
import EnergyRoutes from './routes/EnergyRoutes.js';
import CategoryLimitRoutes from './routes/CategoryLimitRoutes.js';
import UserManagementRoutes from './controllers/UserController.js';

import bcrypt from 'bcrypt';
import User from './models/UserModel.js';

dotenv.config(); // Load environment variables

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
  await connectDB();
  await seedAdmin();         // .env admin
  await seedChandulaAdmin(); // chandula@example.com admin

  // API routes
  app.use('/api/tenants', Tenants_Routes);
  app.use('/api/energyReadings', EnergyRoutes);
  app.use('/api/categoryLimits', CategoryLimitRoutes);
  app.use('/api/users', UserManagementRoutes);

  // Default route
  app.get('/', (req, res) => {
    res.status(200).send('Hello World');
  });

  // Start server
  app.listen(port, () => {
    console.log(`🚀 Server running on port: ${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
