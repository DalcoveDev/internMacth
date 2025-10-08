import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export const authMiddleware = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization
  
  if (!auth) {
    return res.status(401).json({ error: 'Authorization header missing' })
  }
  
  if (!auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid authorization format' })
  }
  
  const token = auth.replace(/^Bearer\s+/, '')
  
  if (!token) {
    return res.status(401).json({ error: 'Token missing' })
  }
  
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    
    // Validate payload structure
    if (!payload.userId || !payload.role) {
      return res.status(401).json({ error: 'Invalid token payload' })
    }
    
    req.user = {
      userId: payload.userId,
      role: payload.role,
      email: payload.email
    }
    
    next()
  } catch (err: any) {
    console.error('Auth middleware error:', err.message)
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' })
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token', code: 'INVALID_TOKEN' })
    }
    
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

// Role-based authorization middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      })
    }
    
    next()
  }
}

// Admin-only middleware
export const requireAdmin = requireRole(['admin'])

// Company or Admin middleware
export const requireCompanyOrAdmin = requireRole(['company', 'admin'])

// Student or Admin middleware
export const requireStudentOrAdmin = requireRole(['student', 'admin'])
