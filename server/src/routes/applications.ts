import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

// ...existing imports

const prisma = new PrismaClient()
const router = Router()

router.get('/', async (req: any, res: any) => {
  try {
    const apps = await prisma.application.findMany({ include: { internship: true }, orderBy: { createdAt: 'desc' } })
    res.json(apps)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' })
  }
})

router.get('/:id', async (req: any, res: any) => {
  const id = Number(req.params.id)
  try {
    const app = await prisma.application.findUnique({ where: { id }, include: { internship: true } })
    if (!app) return res.status(404).json({ message: 'Not found' })
    res.json(app)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch application' })
  }
})

// Create an application
router.post('/', async (req: any, res: any) => {
  const { internshipId, studentName, studentEmail, coverLetter, skills } = req.body
  try {
    const created = await prisma.application.create({ data: { internshipId, studentName, studentEmail, coverLetter, skills } })
    res.status(201).json(created)
  } catch (error) {
    res.status(400).json({ error: error })
  }
})

// Update application status (approved/rejected/pending)
router.patch('/:id/status', async (req: any, res: any) => {
  const id = Number(req.params.id)
  const { status } = req.body as { status: string }
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  try {
    const updated = await prisma.application.update({ where: { id }, data: { status } })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

export default router
