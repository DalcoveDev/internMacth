import { Request, Response, NextFunction } from 'express';
import pool from '../config/database';

// Async error handler wrapper
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Get services page content
export const getContent = asyncHandler(async (req: Request, res: Response) => {
  try {
    // For now, we'll return static content
    // In a real application, you might fetch this from a database or CMS
    
    const content = {
      studentServices: [
        {
          title: "Internship Discovery",
          description: "Access thousands of verified internship opportunities across all industries"
        },
        {
          title: "Profile Optimization",
          description: "AI-powered suggestions to enhance your profile and stand out to employers"
        },
        {
          title: "Application Tracking",
          description: "Monitor your application status and receive real-time updates"
        },
        {
          title: "Career Guidance",
          description: "Expert advice and resources to help you make informed career decisions"
        }
      ],
      companyServices: [
        {
          title: "Talent Acquisition",
          description: "Access a diverse pool of pre-vetted students from top universities"
        },
        {
          title: "Smart Matching",
          description: "AI-powered algorithms to find the best candidates for your positions"
        },
        {
          title: "Application Management",
          description: "Streamlined dashboard to review, filter, and manage all applications"
        },
        {
          title: "Brand Building",
          description: "Showcase your company culture and attract top talent to your organization"
        }
      ],
      premiumServices: [
        {
          title: "Skills Assessment",
          description: "Comprehensive skill evaluations to help students identify strengths and companies find the right talent.",
          features: [
            "Technical skill testing",
            "Soft skills evaluation",
            "Industry-specific assessments",
            "Detailed performance reports"
          ],
          icon: "BrainIcon"
        },
        {
          title: "Fast Placement",
          description: "Quick and efficient matching process that gets students placed in internships within days, not weeks.",
          features: [
            "Priority application processing",
            "Direct company connections",
            "Expedited interview scheduling",
            "Real-time status updates"
          ],
          icon: "RocketIcon"
        },
        {
          title: "Success Support",
          description: "Ongoing mentorship and support throughout the internship journey to ensure mutual success.",
          features: [
            "Dedicated success manager",
            "Weekly check-ins",
            "Performance feedback",
            "Career development planning"
          ],
          icon: "StarIcon"
        }
      ],
      howItWorks: [
        {
          step: 1,
          title: "Explore",
          description: "Browse through thousands of internship opportunities filtered by your preferences",
          icon: "SearchIcon"
        },
        {
          step: 2,
          title: "Match",
          description: "Our AI algorithm matches you with the most suitable opportunities based on your profile",
          icon: "TargetIcon"
        },
        {
          step: 3,
          title: "Apply",
          description: "Submit applications with one click and track your progress in real-time",
          icon: "ClipboardIcon"
        },
        {
          step: 4,
          title: "Succeed",
          description: "Get matched with your ideal internship and receive ongoing support for success",
          icon: "TrendingUpIcon"
        }
      ],
      stats: [
        { value: "10K+", label: "Internship Opportunities", description: "From top companies worldwide" },
        { value: "5K+", label: "Successful Placements", description: "Students placed in dream roles" },
        { value: "95%", label: "Satisfaction Rate", description: "Of students and employers" }
      ]
    };

    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error fetching services content:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch services content' }
    });
  }
});