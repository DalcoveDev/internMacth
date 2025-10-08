import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { signupSchema, loginSchema, validateRequest } from '../validation/schemas'

const prisma = new PrismaClient()
const router = Router()

// Validate JWT secret
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET || JWT_SECRET === 'dev_secret') {
  console.warn('⚠️  WARNING: Using default JWT secret. Set JWT_SECRET environment variable for production!')
}

const JWT_SECRET_FINAL = JWT_SECRET || 'dev_secret'

// Signup (create user with hashed password)
router.post('/signup', validateRequest(signupSchema), async (req: any, res: any, next: any) => {
  try {
    const { name, email, password, role } = req.body
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' })
    }
    
    // Hash password
    const hashed = await bcrypt.hash(password, 12) // Increased salt rounds for better security
    
    // Create user
    const user = await prisma.user.create({ 
      data: { 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        password: hashed, 
        role: role || 'student' 
      } 
    })
    
    // Generate JWT token with expiration
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email }, 
      JWT_SECRET_FINAL,
      { expiresIn: '7d' } // Token expires in 7 days
    )
    
    res.status(201).json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        createdAt: user.createdAt
      }, 
      token 
    })
  } catch (err: any) {
    console.error('Signup error:', err)
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'User with this email already exists' })
    }
    next(err)
  }
})

// Login (verify password)
router.post('/login', validateRequest(loginSchema), async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body
    
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }
    
    // Generate JWT token with expiration
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email }, 
      JWT_SECRET_FINAL,
      { expiresIn: '7d' } // Token expires in 7 days
    )
    
    res.json({ 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        createdAt: user.createdAt
      }, 
      token 
    })
  } catch (err: any) {
    console.error('Login error:', err)
    next(err)
  }
})

export default router
