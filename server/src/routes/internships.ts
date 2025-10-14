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

// Get all internships with pagination and filters
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('location').optional().isString(),
  query('type').optional().isIn(['full-time', 'part-time', 'contract', 'remote']),
  query('search').optional().isString(),
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
  const { location, type, search } = req.query;

  let whereConditions = ['i.is_active = TRUE', 'i.is_approved = TRUE'];
  let queryParams: any[] = [];

  if (location) {
    whereConditions.push('i.location LIKE ?');
    queryParams.push(`%${location}%`);
  }

  if (type) {
    whereConditions.push('i.type = ?');
    queryParams.push(type);
  }

  if (search) {
    whereConditions.push('(i.title LIKE ? OR i.description LIKE ? OR i.requirements LIKE ?)');
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Get total count
  const [countResult] = await pool.execute(
    `SELECT COUNT(*) as total FROM internships i 
     JOIN companies c ON i.company_id = c.id 
     ${whereClause}`,
    queryParams
  );

  const total = (countResult as any[])[0].total;
  const totalPages = Math.ceil(total / limit);

  // Get internships
  const [internships] = await pool.execute(
    `SELECT 
       i.id, i.title, i.description, i.requirements, i.responsibilities, i.benefits,
       i.location, i.type, i.duration, i.salary_min, i.salary_max, i.salary_type,
       i.deadline, i.start_date, i.end_date, i.skills_required, i.experience_level,
       i.created_at, i.updated_at,
       c.company_name, c.industry, c.company_size, c.logo,
       u.name as posted_by_name, u.email as posted_by_email
     FROM internships i
     JOIN companies c ON i.company_id = c.id
     JOIN users u ON c.user_id = u.id
     ${whereClause}
     ORDER BY i.created_at DESC
     LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset]
  );

  res.json({
    success: true,
    data: {
      internships,
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

// Get single internship by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [internships] = await pool.execute(
    `SELECT 
       i.*,
       c.company_name, c.industry, c.company_size, c.description as company_description, c.logo,
       c.website as company_website, c.founded_year, c.headquarters,
       u.name as posted_by_name, u.email as posted_by_email
     FROM internships i
     JOIN companies c ON i.company_id = c.id
     JOIN users u ON c.user_id = u.id
     WHERE i.id = ? AND i.is_active = TRUE AND i.is_approved = TRUE`,
    [id]
  );

  const internship = (internships as any[])[0];
  if (!internship) {
    return res.status(404).json({
      success: false,
      error: { message: 'Internship not found' }
    });
  }

  res.json({
    success: true,
    data: { internship }
  });
}));

// Create new internship (company only)
router.post('/', authenticate, authorize('company'), [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('requirements').trim().isLength({ min: 20 }).withMessage('Requirements must be at least 20 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('type').isIn(['full-time', 'part-time', 'contract', 'remote']).withMessage('Invalid type'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
  body('deadline').isISO8601().withMessage('Invalid deadline format'),
], asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', details: errors.array() }
    });
  }

  const userId = req.user!.id;
  const {
    title, description, requirements, responsibilities, benefits,
    location, type, duration, salary_min, salary_max, salary_type,
    deadline, start_date, end_date, skills_required, experience_level
  } = req.body;

  // Get company ID
  const [companies] = await pool.execute(
    'SELECT id FROM companies WHERE user_id = ?',
    [userId]
  );

  const company = (companies as any[])[0];
  if (!company) {
    return res.status(404).json({
      success: false,
      error: { message: 'Company profile not found' }
    });
  }

  // Create internship
  const [result] = await pool.execute(
    `INSERT INTO internships (
      company_id, title, description, requirements, responsibilities, benefits,
      location, type, duration, salary_min, salary_max, salary_type,
      deadline, start_date, end_date, skills_required, experience_level
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      company.id, title, description, requirements, responsibilities, benefits,
      location, type, duration, salary_min, salary_max, salary_type,
      deadline, start_date, end_date, skills_required, experience_level
    ]
  );

  const internshipId = (result as any).insertId;

  res.status(201).json({
    success: true,
    data: { internshipId },
    message: 'Internship created successfully. It will be reviewed by admin before going live.'
  });
}));

// Approve internship (admin only)
router.patch('/:id/approve', authenticate, authorize('admin'), asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const adminId = req.user!.id;

  const [result] = await pool.execute(
    'UPDATE internships SET is_approved = TRUE, approved_by = ?, approved_at = NOW() WHERE id = ?',
    [adminId, id]
  );

  if ((result as any).affectedRows === 0) {
    return res.status(404).json({
      success: false,
      error: { message: 'Internship not found' }
    });
  }

  res.json({
    success: true,
    message: 'Internship approved successfully'
  });
}));

// Get pending internships (admin only)
router.get('/admin/pending', authenticate, authorize('admin'), asyncHandler(async (req: Request, res: Response) => {
  const [internships] = await pool.execute(
    `SELECT 
       i.*,
       c.company_name, c.industry,
       u.name as posted_by_name, u.email as posted_by_email
     FROM internships i
     JOIN companies c ON i.company_id = c.id
     JOIN users u ON c.user_id = u.id
     WHERE i.is_approved = FALSE AND i.is_active = TRUE
     ORDER BY i.created_at ASC`
  );

  res.json({
    success: true,
    data: { internships }
  });
}));

export default router;