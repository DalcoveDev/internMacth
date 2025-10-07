import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const router = Router()

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev_secret'

// Signup (create user with hashed password)
router.post('/signup', async (req: any, res: any) => {
  const { name, email, password, role } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' })
  try {
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, password: hashed, role } })
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET)
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token })
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

// Login (verify password)
router.post('/login', async (req: any, res: any) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET)
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token })
})

export default router
