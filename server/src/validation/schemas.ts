import { z } from 'zod'

// Auth schemas
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password must contain at least one letter and one number'),
  role: z.enum(['student', 'company', 'admin'], {
    errorMap: () => ({ message: 'Role must be student, company, or admin' })
  })
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['student', 'company', 'admin'], {
    errorMap: () => ({ message: 'Role must be student, company, or admin' })
  }).optional()
})

// User schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long').optional(),
  role: z.enum(['student', 'company', 'admin']).optional()
})

// Internship schemas
export const internshipSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  company: z.string().min(2, 'Company name must be at least 2 characters').max(50, 'Company name too long'),
  location: z.string().max(100, 'Location too long').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long').optional(),
  skills: z.string().max(500, 'Skills description too long').optional(),
  postedById: z.number().int().positive('Invalid user ID'),
  type: z.string().max(50, 'Type too long').optional(),
  duration: z.string().max(50, 'Duration too long').optional(),
  contactEmail: z.string().email('Invalid contact email').optional(),
  companyWebsite: z.string().url('Invalid website URL').optional(),
  applicationDeadline: z.string().optional(),
  applicationLink: z.string().url('Invalid application link').optional()
})

export const internshipApprovalSchema = z.object({
  reason: z.string().max(500, 'Reason too long').optional()
})

// Application schemas
export const applicationSchema = z.object({
  internshipId: z.number().int().positive('Invalid internship ID'),
  studentName: z.string().min(2, 'Student name must be at least 2 characters').max(50, 'Name too long'),
  studentEmail: z.string().email('Invalid student email'),
  studentId: z.number().int().positive('Invalid student ID').optional(),
  coverLetter: z.string().min(10, 'Cover letter must be at least 10 characters').max(2000, 'Cover letter too long').optional(),
  skills: z.string().max(500, 'Skills description too long').optional(),
  studentPhone: z.string().max(20, 'Phone number too long').optional(),
  education: z.string().max(500, 'Education description too long').optional(),
  experience: z.string().max(1000, 'Experience description too long').optional(),
  portfolio: z.string().url('Invalid portfolio URL').optional(),
  availability: z.string().max(200, 'Availability description too long').optional()
})

export const applicationStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    errorMap: () => ({ message: 'Status must be pending, approved, or rejected' })
  })
})

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('10'),
  search: z.string().optional(),
  role: z.enum(['student', 'company', 'admin']).optional()
})

// Validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
      }
      next(error)
    }
  }
}

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.query = schema.parse(req.query)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        })
      }
      next(error)
    }
  }
}
