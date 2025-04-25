// backend/controllers/UserController.js
import express from 'express';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

console.log('🔐 JWT_SECRET loaded?', !!JWT_SECRET);

// ------------------- MIDDLEWARES -------------------

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.warn('❌ Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    console.warn('⚠️ Access denied for non-admin:', req.user.email);
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

// ------------------- ROUTES -------------------

/**
 * POST /api/users/register
 */
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn('⚠️ Registration failed: Email already exists →', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'user',
      verified: false,
    });

    await newUser.save();
    console.log('✅ Registered user:', email);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('❌ Failed to register user:', error);
    return res.status(500).json({ message: 'Failed to register user' });
  }
});

/**
 * POST /api/users/login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('🔐 Login attempt:', email);

  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is undefined');
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.warn('❌ Login failed: No user found →', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.warn('❌ Login failed: Invalid password →', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      verified: user.verified
    };

    console.log('✅ Login successful:', email);
    return res.json({ token, user: userResponse });
  } catch (error) {
    console.error('🔥 Login error:', error.message);
    return res.status(500).json({ message: 'Failed to login', error: error.message });
  }
});

/**
 * POST /api/users/addUser
 */
router.post('/addUser', authMiddleware, adminOnly, async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn('⚠️ Admin add failed: Email already exists →', email);
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'user',
      verified: true,
    });

    await newUser.save();
    console.log('✅ Admin added user:', email);
    return res.status(201).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('❌ Failed to add user:', error);
    return res.status(500).json({ message: 'Failed to add user' });
  }
});

/**
 * GET /api/users/
 */
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    console.log('📦 Admin fetched all users');
    return res.status(200).json({ users });
  } catch (err) {
    console.error('❌ Failed to fetch users:', err);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
});

/**
 * PUT /api/users/:id
 */
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() !== id && req.user.role !== 'admin') {
    console.warn('⚠️ Forbidden: User attempted to update another user');
    return res.status(403).json({ message: 'Forbidden: You can only update your own account' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log incoming update payload
    console.log('🕵️ Incoming update data:', req.body);

    // Only allow admins to change roles
    if (req.body.role && req.user.role !== 'admin') {
      delete req.body.role;
    }

    // Role validation: only accept expected values
    const validRoles = ['admin', 'facility_manager', 'user'];
    if (req.body.role && !validRoles.includes(req.body.role)) {
      console.warn('❌ Invalid role:', req.body.role);
      return res.status(400).json({ message: `Invalid role: ${req.body.role}` });
    }

    // Handle password update
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Clean up frontend-only fields
    if (req.body.plainPassword) {
      delete req.body.plainPassword;
    }

    // Assign updated fields
    Object.keys(req.body).forEach(key => {
      user[key] = req.body[key];
    });

    const updated = await user.save();
    const userResponse = updated.toObject();
    delete userResponse.password;

    console.log('✅ User updated:', updated.email);
    return res.status(200).json({ user: userResponse });
  } catch (err) {
    console.error('❌ Failed to update user:', err);
    return res.status(500).json({ message: 'Failed to update user' });
  }
});

/**
 * DELETE /api/users/:id
 */
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.findByIdAndDelete(id);
    console.log('🗑️ Admin deleted user:', deleted?.email || id);
    return res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('❌ Failed to delete user:', err);
    return res.status(500).json({ message: 'Failed to delete user' });
  }
});

/**
 * GET /api/users/get-by-email/:email
 */
router.get('/get-by-email/:email', authMiddleware, adminOnly, async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }
    console.log('🔎 Admin fetched user by email:', email);
    return res.status(200).json({ user });
  } catch (err) {
    console.error('❌ Failed to fetch user by email:', err);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
});

export default router;
