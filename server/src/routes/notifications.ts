import express, { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';
import pool from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Async error handler wrapper
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Get notifications for current user
router.get('/', authenticate, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('unread_only').optional().isBoolean().withMessage('unread_only must be a boolean'),
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
  const unreadOnly = req.query.unread_only === 'true';

  let whereConditions = ['user_id = ?'];
  let queryParams: any[] = [userId];

  if (unreadOnly) {
    whereConditions.push('is_read = FALSE');
  }

  const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

  // Get total count
  const [countResult] = await pool.execute(
    `SELECT COUNT(*) as total FROM notifications ${whereClause}`,
    queryParams
  );

  const total = (countResult as any[])[0].total;
  const totalPages = Math.ceil(total / limit);

  // Get notifications
  const [notifications] = await pool.execute(
    `SELECT id, type, title, message, is_read, priority, action_url, metadata, created_at
     FROM notifications ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...queryParams, limit, offset]
  );

  // Get unread count
  const [unreadResult] = await pool.execute(
    'SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = FALSE',
    [userId]
  );

  const unreadCount = (unreadResult as any[])[0].unread_count;

  res.json({
    success: true,
    data: {
      notifications,
      unreadCount,
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

// Mark notification as read
router.patch('/:id/read', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const [result] = await pool.execute(
    'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
    [id, userId]
  );

  if ((result as any).affectedRows === 0) {
    return res.status(404).json({
      success: false,
      error: { message: 'Notification not found' }
    });
  }

  res.json({
    success: true,
    message: 'Notification marked as read'
  });
}));

// Mark all notifications as read
router.patch('/read-all', authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  await pool.execute(
    'UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE',
    [userId]
  );

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

export default router;