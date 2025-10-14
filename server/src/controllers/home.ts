import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

// Async error handler wrapper
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Get home page content
export const getContent = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Fetch featured internships (latest 3 approved internships)
    const [internships] = await pool.execute(`
      SELECT 
        i.id,
        i.title,
        c.company_name as company,
        i.location,
        i.type,
        i.duration,
        i.description,
        i.skills_required as requirements,
        DATE_FORMAT(i.created_at, '%Y-%m-%d') as postedDate,
        DATE_FORMAT(i.deadline, '%Y-%m-%d') as deadline,
        c.logo as logoUrl
      FROM internships i
      JOIN companies c ON i.company_id = c.id
      WHERE i.is_approved = TRUE AND i.is_active = TRUE
      ORDER BY i.created_at DESC
      LIMIT 3
    `);

    // Fetch statistics
    const [companiesCount] = await pool.execute(`
      SELECT COUNT(*) as count FROM companies
    `);

    const [internshipsCount] = await pool.execute(`
      SELECT COUNT(*) as count FROM internships WHERE is_approved = TRUE
    `);

    const [applicationsCount] = await pool.execute(`
      SELECT COUNT(*) as count FROM applications WHERE status = 'accepted'
    `);

    const content = {
      featuredInternships: (internships as any[]).map(internship => ({
        ...internship,
        requirements: internship.requirements ? internship.requirements.split(',').map((req: string) => req.trim()) : []
      })),
      stats: {
        companies: (companiesCount as any[])[0].count,
        jobs: (internshipsCount as any[])[0].count,
        placements: (applicationsCount as any[])[0].count
      }
    };

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching home content:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch home content' }
    });
  }
});