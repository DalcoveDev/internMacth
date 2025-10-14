import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/auth';

// Async error handler wrapper
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Submit feedback
export const submitFeedback = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { type, message } = req.body;
  const userId = req.user!.id;

  // Validate input
  if (!type || !['positive', 'negative'].includes(type)) {
    return res.status(400).json({
      success: false,
      error: { message: 'Feedback type must be either "positive" or "negative"' }
    });
  }

  if (!message || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'Feedback message is required' }
    });
  }

  // Insert feedback into database
  const [result] = await pool.execute(
    `INSERT INTO feedback (user_id, type, message, created_at) 
     VALUES (?, ?, ?, NOW())`,
    [userId, type, message.trim()]
  );

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully',
    data: {
      id: (result as any).insertId,
      user_id: userId,
      type,
      message: message.trim()
    }
  });
});