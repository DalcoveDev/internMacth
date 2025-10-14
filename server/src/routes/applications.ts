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

// Get applications for a student
router.get('/student', authenticate, authorize('student'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected']),
], asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', details: errors.array() }
    });
  }

  const userId = req.user!.id;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const { status } = req.query;

  // Get student ID
  const [students] = await pool.execute(
    'SELECT id FROM students WHERE user_id = ?',
    [userId]
  );

  const student = (students as any[])[0];
  if (!student) {
    return res.status(404).json({
      success: false,
      error: { message: 'Student profile not found' }
    });
  }

  let whereConditions = ['a.student_id = ?'];
  let queryParams: any[] = [student.id];

  if (status) {
    whereConditions.push('a.status = ?');
    queryParams.push(status);
  }

  const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

  // Get total count
  const [countResult] = await pool.execute(
    `SELECT COUNT(*) as total FROM applications a ${whereClause}`,
    queryParams
  );

  const total = (countResult as any[])[0].total;
  const totalPages = Math.ceil(total / limit);

  // Get applications
  const [applications] = await pool.execute(
    `SELECT 
       a.id, a.cover_letter, a.skills, a.experience, a.education,
       a.portfolio_url, a.resume_url, a.status, a.applied_at, a.reviewed_at,
       a.notes,
       i.title, i.location, i.type, i.duration, i.deadline,
       c.company_name, c.logo
     FROM applications a
     JOIN internships i ON a.internship_id = i.id
     JOIN companies c ON i.company_id = c.id
     ${whereClause}
     ORDER BY a.applied_at DESC
     LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset]
  );

  res.json({
    success: true,
    data: {
      applications,
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

// Apply for an internship (student only)
router.post('/', authenticate, authorize('student'), [
  body('internship_id').isInt().withMessage('Internship ID must be an integer'),
  body('cover_letter').trim().isLength({ min: 100 }).withMessage('Cover letter must be at least 100 characters'),
  body('skills').optional().trim().isString(),
  body('experience').optional().trim().isString(),
  body('education').optional().trim().isString(),
  body('portfolio_url').optional().isURL().withMessage('Portfolio URL must be a valid URL'),
  body('resume_url').optional().isURL().withMessage('Resume URL must be a valid URL'),
], asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', details: errors.array() }
    });
  }

  const userId = req.user!.id;
  const { internship_id, cover_letter, skills, experience, education, portfolio_url, resume_url } = req.body;

  // Get student ID
  const [students] = await pool.execute(
    'SELECT id FROM students WHERE user_id = ?',
    [userId]
  );

  const student = (students as any[])[0];
  if (!student) {
    return res.status(404).json({
      success: false,
      error: { message: 'Student profile not found' }
    });
  }

  // Check if internship exists and is active
  const [internships] = await pool.execute(
    'SELECT id, deadline FROM internships WHERE id = ? AND is_active = TRUE AND is_approved = TRUE',
    [internship_id]
  );

  const internship = (internships as any[])[0];
  if (!internship) {
    return res.status(404).json({
      success: false,
      error: { message: 'Internship not found or not available' }
    });
  }

  // Check if deadline has passed
  const deadline = new Date(internship.deadline);
  if (deadline < new Date()) {
    return res.status(400).json({
      success: false,
      error: { message: 'Application deadline has passed' }
    });
  }

  // Check if already applied
  const [existingApplications] = await pool.execute(
    'SELECT id FROM applications WHERE internship_id = ? AND student_id = ?',
    [internship_id, student.id]
  );

  if ((existingApplications as any[]).length > 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'You have already applied for this internship' }
    });
  }

  // Create application
  const [result] = await pool.execute(
    `INSERT INTO applications (
      internship_id, student_id, cover_letter, skills, experience, education, portfolio_url, resume_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [internship_id, student.id, cover_letter, skills, experience, education, portfolio_url, resume_url]
  );

  const applicationId = (result as any).insertId;

  res.status(201).json({
    success: true,
    data: { applicationId },
    message: 'Application submitted successfully'
  });
}));

// Update application status (company/admin only)
router.patch('/:id/status', authenticate, authorize('company', 'admin'), [
  body('status').isIn(['pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected']).withMessage('Invalid status'),
], asyncHandler(async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: { message: 'Validation failed', details: errors.array() }
    });
  }

  const { id } = req.params;
  const { status } = req.body;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  // Get the application
  const [applications] = await pool.execute(
    `SELECT a.*, i.company_id 
     FROM applications a
     JOIN internships i ON a.internship_id = i.id
     WHERE a.id = ?`,
    [id]
  );

  const application = (applications as any[])[0];
  if (!application) {
    return res.status(404).json({
      success: false,
      error: { message: 'Application not found' }
    });
  }

  // Check permissions
  if (userRole === 'company') {
    // Companies can only update applications for their own internships
    const [companies] = await pool.execute(
      'SELECT id FROM companies WHERE user_id = ?',
      [userId]
    );

    const company = (companies as any[])[0];
    if (!company || application.company_id !== company.id) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to update this application' }
      });
    }
  }

  // Update application status
  const [result] = await pool.execute(
    'UPDATE applications SET status = ?, reviewed_at = NOW(), reviewed_by = ? WHERE id = ?',
    [status, userId, id]
  );

  if ((result as any).affectedRows === 0) {
    return res.status(404).json({
      success: false,
      error: { message: 'Application not found' }
    });
  }

  // Get student user ID for notification
  const [studentInfo] = await pool.execute(
    `SELECT s.user_id, u.name as student_name, u.email as student_email, 
            i.title as internship_title, c.company_name
     FROM applications a
     JOIN students s ON a.student_id = s.id
     JOIN users u ON s.user_id = u.id
     JOIN internships i ON a.internship_id = i.id
     JOIN companies c ON i.company_id = c.id
     WHERE a.id = ?`,
    [id]
  );

  const student = (studentInfo as any[])[0];
  if (student) {
    // Create notification for student
    const notificationType = status === 'approved' ? 'application_update' : 'application_update';
    const notificationTitle = status === 'approved' 
      ? `Application Approved for ${student.internship_title}` 
      : `Application Update for ${student.internship_title}`;
    const notificationMessage = status === 'approved' 
      ? `Congratulations! Your application for ${student.internship_title} at ${student.company_name} has been approved.`
      : `Your application for ${student.internship_title} at ${student.company_name} has been ${status}.`;
    
    await pool.execute(
      'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
      [student.user_id, notificationType, notificationTitle, notificationMessage]
    );
  }

  res.json({
    success: true,
    message: 'Application status updated successfully'
  });
}));

export default router;