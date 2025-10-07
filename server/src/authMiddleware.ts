import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret'

export const authMiddleware = (req: any, res: any, next: any) => {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Missing token' })
  const token = auth.replace(/^Bearer\s+/, '')
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
