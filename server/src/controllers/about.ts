import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

// Async error handler wrapper
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Get about page content
export const getContent = asyncHandler(async (req: Request, res: Response) => {
  try {
    // For now, we'll return static content
    // In a real application, you might fetch this from a database or CMS
    
    const content = {
      stats: [
        { value: '10,000+', label: 'Students Placed' },
        { value: '500+', label: 'Partner Companies' },
        { value: '95%', label: 'Success Rate' },
        { value: '50+', label: 'Industries' },
      ],
      values: [
        { 
          icon: 'HeartIcon', 
          title: 'Student-Focused', 
          description: 'Every feature is designed with students\' success in mind' 
        },
        { 
          icon: 'ShieldIcon', 
          title: 'Trusted Platform', 
          description: 'Verified companies and secure application process' 
        },
        { 
          icon: 'UsersIcon', 
          title: 'Community', 
          description: 'Join a network of ambitious students and mentors' 
        },
        { 
          icon: 'AwardIcon', 
          title: 'Excellence', 
          description: 'Award-winning platform recognized by industry leaders' 
        },
      ],
      coreValues: [
        {
          title: 'Purpose-Driven',
          description: 'We connect people with opportunities that align with their passions and career goals, creating meaningful professional relationships that drive mutual success.',
          iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
          iconClass: 'text-primary-foreground',
          bgClass: 'bg-primary'
        },
        {
          title: 'Inclusive',
          description: 'We\'re committed to creating opportunities for students from all backgrounds, ensuring diversity and equal access to career development for everyone.',
          iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
          iconClass: 'text-secondary-foreground',
          bgClass: 'bg-secondary'
        },
        {
          title: 'Innovation',
          description: 'We continuously improve our platform using cutting-edge technology to make the internship search and hiring process more efficient and effective.',
          iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
          iconClass: 'text-accent-foreground',
          bgClass: 'bg-accent'
        }
      ],
      story: ''
    };

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch about content' }
    });
  }
});