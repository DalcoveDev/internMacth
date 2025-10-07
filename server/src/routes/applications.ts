import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

// ...existing imports

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req: any, res: any) => {
  const apps = await prisma.application.findMany({ include: { internship: true }, orderBy: { createdAt: 'desc' } })
  res.json(apps)
})

router.get('/:id', async (req: any, res: any) => {
  const id = Number(req.params.id)
  const app = await prisma.application.findUnique({ where: { id }, include: { internship: true } })
  if (!app) return res.status(404).json({ message: 'Not found' })
  res.json(app)
})

// Create an application
router.post('/', async (req: any, res: any) => {
  const { internshipId, studentName, studentEmail, coverLetter, skills } = req.body
  try {
    const created = await prisma.application.create({ data: { internshipId, studentName, studentEmail, coverLetter, skills } })
    res.status(201).json(created)
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

export default router
