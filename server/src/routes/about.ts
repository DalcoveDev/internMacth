import express, { Request, Response, NextFunction } from 'express';
import { getContent } from '../controllers/about';

const router = express.Router();

// Get about page content
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  return getContent(req, res, next);
});

export default router;