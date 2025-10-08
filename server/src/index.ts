import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { PrismaClient } from '@prisma/client'
import internshipsRouter from './routes/internships'
import usersRouter from './routes/users'
import applicationsRouter from './routes/applications'
import authRouter from './routes/auth'
import { authMiddleware } from './authMiddleware'
import { env } from './config/env'

const app = express()
const prisma = new PrismaClient()

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

// CORS configuration for multiple origins
const corsOrigins = env.CORS_ORIGIN.split(',').map(origin => origin.trim())
app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})

// Apply rate limiting
app.use('/api/auth', authLimiter)
app.use('/api', generalLimiter)

// Public routes (no auth required)
app.use('/api/auth', authRouter)

// Protected routes (auth required)
app.use('/api/users', authMiddleware, usersRouter)
app.use('/api/internships', authMiddleware, internshipsRouter)
app.use('/api/applications', authMiddleware, applicationsRouter)

// Health check endpoint
app.get('/api/health', (req: any, res: any) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err.stack)
  
  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: isDevelopment ? err.message : 'Something went wrong',
    ...(isDevelopment && { stack: err.stack })
  })
})

// 404 handler
app.use('*', (req: any, res: any) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(env.PORT, () => {
	console.log(`🚀 Server listening on port ${env.PORT}`)
	console.log(`📊 Environment: ${env.NODE_ENV}`)
	console.log(`🌐 CORS Origins: ${corsOrigins.join(', ')}`)
	console.log(`📝 Database: ${env.DATABASE_URL.includes('@') ? 'Connected' : env.DATABASE_URL}`)
})

process.on('SIGINT', async () => {
	await prisma.$disconnect()
	process.exit()
})