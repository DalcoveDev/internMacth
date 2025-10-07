import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

// Create user (mock registration)
router.post('/', async (req: any, res: any) => {
  const { email, password, name, role } = req.body
  try {
    const user = await prisma.user.create({ data: { email, password, name, role } })
    res.status(201).json(user)
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

// List users
router.get('/', async (req: any, res: any) => {
  const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, role: true } })
  res.json(users)
})

export default router
