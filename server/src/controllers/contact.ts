import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

// Async error handler wrapper
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Send contact message
export const sendMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, subject, message } = req.body;

  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: { message: 'All fields are required' }
    });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: { message: 'Please provide a valid email address' }
    });
  }

  // Insert contact message into database
  const [result] = await pool.execute(
    `INSERT INTO contact_messages (name, email, subject, message, created_at) 
     VALUES (?, ?, ?, ?, NOW())`,
    [name, email, subject, message]
  );

  // In a real application, you would send an email to the admin here
  // For now, we'll just store it in the database

  res.status(201).json({
    success: true,
    message: 'Message sent successfully. We will get back to you within 24 hours.',
    data: {
      id: (result as any).insertId,
      name,
      email,
      subject,
      message
    }
  });
});