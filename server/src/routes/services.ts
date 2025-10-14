import express, { Request, Response, NextFunction } from 'express';
import { getContent } from '../controllers/services';

const router = express.Router();

// Get services page content
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  return getContent(req, res, next);
});

export default router;