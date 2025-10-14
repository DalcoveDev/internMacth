import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').isIn(['student', 'company', 'admin']).withMessage('Invalid role'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Async error handler wrapper
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Register new user
router.post('/register', registerValidation, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', details: errors.array() }
    });
  }

  const { name, email, password, role } = req.body;

  // Check if user already exists
  const [existingUsers] = await pool.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if ((existingUsers as any[]).length > 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'User with this email already exists' }
    });
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role]
  );

  const userId = (result as any).insertId;

  // Create role-specific profile
  if (role === 'company') {
    await pool.execute(
      'INSERT INTO companies (user_id, company_name) VALUES (?, ?)',
      [userId, name]
    );
  } else if (role === 'student') {
    await pool.execute(
      'INSERT INTO students (user_id) VALUES (?)',
      [userId]
    );
  }

  // Generate JWT token
  const token = (jwt.sign as any)(
    { userId, email, role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: userId,
        name,
        email,
        role,
        status: 'active'
      },
      token
    },
    message: 'User registered successfully'
  });
}));

// Login user
router.post('/login', loginValidation, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', details: errors.array() }
    });
  }

  const { email, password } = req.body;

  // Find user
  const [users] = await pool.execute(
    'SELECT id, name, email, password, role, status FROM users WHERE email = ?',
    [email]
  );

  const userList = users as any[];
  if (userList.length === 0) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid email or password' }
    });
  }

  const user = userList[0];

  // Check if user is active
  if (user.status !== 'active') {
    return res.status(401).json({
      success: false,
      error: { message: 'Account is not active' }
    });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid email or password' }
    });
  }

  // Generate JWT token
  const token = (jwt.sign as any)(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      token
    },
    message: 'Login successful'
  });
}));

// Get current user profile
router.get('/me', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  // Get user with role-specific data
  const [users] = await pool.execute(
    'SELECT id, name, email, role, status, avatar, phone, location, bio, website, created_at FROM users WHERE id = ?',
    [userId]
  );

  const user = (users as any[])[0];
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }

  // Get role-specific data
  let profileData = {};
  if (user.role === 'company') {
    const [companies] = await pool.execute(
      'SELECT * FROM companies WHERE user_id = ?',
      [userId]
    );
    profileData = (companies as any[])[0] || {};
  } else if (user.role === 'student') {
    const [students] = await pool.execute(
      'SELECT * FROM students WHERE user_id = ?',
      [userId]
    );
    profileData = (students as any[])[0] || {};
  }

  res.json({
    success: true,
    data: {
      user: {
        ...user,
        profile: profileData
      }
    }
  });
}));

// Update user profile
router.put('/profile', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { name, phone, location, bio, website, avatar } = req.body;

  // Update basic user info
  await pool.execute(
    'UPDATE users SET name = ?, phone = ?, location = ?, bio = ?, website = ?, avatar = ? WHERE id = ?',
    [name, phone, location, bio, website, avatar, userId]
  );

  // Update role-specific data
  if (req.user!.role === 'company') {
    const { company_name, industry, company_size, description, logo, founded_year, headquarters } = req.body;
    await pool.execute(
      'UPDATE companies SET company_name = ?, industry = ?, company_size = ?, description = ?, logo = ?, founded_year = ?, headquarters = ? WHERE user_id = ?',
      [company_name, industry, company_size, description, logo, founded_year, headquarters, userId]
    );
  } else if (req.user!.role === 'student') {
    const { university, major, graduation_year, gpa, skills, resume, portfolio, linkedin, github } = req.body;
    await pool.execute(
      'UPDATE students SET university = ?, major = ?, graduation_year = ?, gpa = ?, skills = ?, resume = ?, portfolio = ?, linkedin = ?, github = ? WHERE user_id = ?',
      [university, major, graduation_year, gpa, skills, resume, portfolio, linkedin, github, userId]
    );
  }

  res.json({
    success: true,
    message: 'Profile updated successfully'
  });
}));

// Change password
router.put('/change-password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
], asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', details: errors.array() }
    });
  }

  const userId = req.user!.id;
  const { currentPassword, newPassword } = req.body;

  // Get current password
  const [users] = await pool.execute(
    'SELECT password FROM users WHERE id = ?',
    [userId]
  );

  const user = (users as any[])[0];
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { message: 'User not found' }
    });
  }

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    return res.status(400).json({
      success: false,
      error: { message: 'Current password is incorrect' }
    });
  }

  // Hash new password
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await pool.execute(
    'UPDATE users SET password = ? WHERE id = ?',
    [hashedPassword, userId]
  );

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

// Logout (client-side token removal, but we can add token blacklisting here if needed)
router.post('/logout', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  // In a more sophisticated setup, you could blacklist the token here
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

export default router;