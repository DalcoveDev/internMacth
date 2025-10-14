import express, { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Async error handler wrapper
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['student', 'company', 'admin']),
  query('status').optional().isIn(['active', 'inactive', 'suspended']),
], asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', details: errors.array() }
    });
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const { role, status } = req.query;

  let whereConditions = [];
  let queryParams: any[] = [];

  if (role) {
    whereConditions.push('role = ?');
    queryParams.push(role);
  }

  if (status) {
    whereConditions.push('status = ?');
    queryParams.push(status);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Get total count
  const [countResult] = await pool.execute(
    `SELECT COUNT(*) as total FROM users ${whereClause}`,
    queryParams
  );

  const total = (countResult as any[])[0].total;
  const totalPages = Math.ceil(total / limit);

  // Get users
  const [users] = await pool.execute(
    `SELECT id, name, email, role, status, avatar, phone, location, created_at 
     FROM users ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset]
  );

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  });
}));

// Get dashboard statistics (admin only)
router.get('/admin/stats', authenticate, authorize('admin'), asyncHandler(async (req: Request, res: Response) => {
  // Get user statistics
  const [userStats] = await pool.execute(`
    SELECT 
      COUNT(*) as total_users,
      SUM(CASE WHEN role = 'student' THEN 1 ELSE 0 END) as students,
      SUM(CASE WHEN role = 'company' THEN 1 ELSE 0 END) as companies,
      SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_users,
      SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_users,
      SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended_users
    FROM users
  `);

  // Get internship statistics
  const [internshipStats] = await pool.execute(`
    SELECT 
      COUNT(*) as total_internships,
      SUM(CASE WHEN is_approved = TRUE THEN 1 ELSE 0 END) as approved_internships,
      SUM(CASE WHEN is_approved = FALSE THEN 1 ELSE 0 END) as pending_internships,
      SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_internships
    FROM internships
  `);

  // Get application statistics
  const [applicationStats] = await pool.execute(`
    SELECT 
      COUNT(*) as total_applications,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_applications,
      SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) as accepted_applications,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_applications
    FROM applications
  `);

  res.json({
    success: true,
    data: {
      stats: {
        users: userStats[0],
        internships: internshipStats[0],
        applications: applicationStats[0]
      }
    }
  });
}));

export default router;