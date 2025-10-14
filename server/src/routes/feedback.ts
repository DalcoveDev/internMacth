import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { submitFeedback } from '../controllers/feedback';

const router = express.Router();

// Submit feedback
router.post('/', 
  authenticate,
  [
    body('type').isIn(['positive', 'negative']).withMessage('Type must be either "positive" or "negative"'),
    body('message').notEmpty().withMessage('Message is required').trim()
  ],
  (req: Request, res: Response, next: NextFunction) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }
    
    // Call controller function
    return submitFeedback(req, res, next);
  }
);

export default router;