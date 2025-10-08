import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

interface EnvConfig {
  NODE_ENV: string
  PORT: number
  DATABASE_URL: string
  JWT_SECRET: string
  FRONTEND_URL: string
  CORS_ORIGIN: string
}

// Validate required environment variables
const requiredEnvVars = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development'
}

// Check for missing required variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '))
  console.error('Please set these variables in your .env file')
  process.exit(1)
}

// Validate JWT secret strength in production
if (process.env.NODE_ENV === 'production') {
  const jwtSecret = process.env.JWT_SECRET!
  
  if (jwtSecret === 'dev_secret' || jwtSecret.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long in production')
    console.error('Generate a strong secret: openssl rand -base64 32')
    process.exit(1)
  }
  
  if (!/^https:\/\//.test(process.env.FRONTEND_URL || '')) {
    console.error('❌ FRONTEND_URL must use HTTPS in production')
    process.exit(1)
  }
}

// Export validated configuration
export const env: EnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  CORS_ORIGIN: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:5174'
}

// Log configuration (without sensitive data)
console.log('🔧 Environment Configuration:')
console.log(`   NODE_ENV: ${env.NODE_ENV}`)
console.log(`   PORT: ${env.PORT}`)
console.log(`   FRONTEND_URL: ${env.FRONTEND_URL}`)
console.log(`   DATABASE_URL: ${env.DATABASE_URL.includes('@') ? '***configured***' : env.DATABASE_URL}`)
console.log(`   JWT_SECRET: ${env.JWT_SECRET === 'dev_secret' ? '⚠️  DEFAULT (NOT SECURE)' : '***configured***'}`)

if (env.NODE_ENV === 'production' && env.JWT_SECRET === 'dev_secret') {
  console.error('🚨 CRITICAL: Using default JWT secret in production!')
  process.exit(1)
}