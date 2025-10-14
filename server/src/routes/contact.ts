import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { sendMessage } from '../controllers/contact';

const router = express.Router();

// Send contact message
router.post('/', 
  [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('subject').notEmpty().withMessage('Subject is required').trim(),
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
    return sendMessage(req, res, next);
  }
);

export default router;