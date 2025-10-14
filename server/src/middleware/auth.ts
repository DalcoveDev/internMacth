import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    name: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access denied. No token provided.' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Get user from database
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, status FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    const users = rows as any[];
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token. User not found.' }
      });
    }

    req.user = users[0];
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid token.' }
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access denied. Please authenticate.' }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied. Insufficient permissions.' }
      });
    }

    return next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      const [rows] = await pool.execute(
        'SELECT id, name, email, role, status FROM users WHERE id = ? AND status = "active"',
        [decoded.userId]
      );

      const users = rows as any[];
      if (users.length > 0) {
        req.user = users[0];
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};
