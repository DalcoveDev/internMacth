import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = Router()

// List internships
router.get('/', async (req: any, res: any) => {
  const internships = await prisma.internship.findMany({
    include: { postedBy: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' }
  })
  res.json(internships)
})

// Get single
router.get('/:id', async (req: any, res: any) => {
  const id = Number(req.params.id)
  const internship = await prisma.internship.findUnique({ where: { id }, include: { postedBy: true } })
  if (!internship) return res.status(404).json({ message: 'Not found' })
  res.json(internship)
})

// Create
router.post('/', async (req: any, res: any) => {
  const { title, company, location, description, skills, postedById } = req.body
  try {
    const created = await prisma.internship.create({ data: { title, company, location, description, skills, postedById } })
    res.status(201).json(created)
  } catch (err) {
    res.status(400).json({ error: err })
  }
})

// Approve
router.post('/:id/approve', async (req: any, res: any) => {
  const id = Number(req.params.id)
  const updated = await prisma.internship.update({ where: { id }, data: { isApproved: true } })
  res.json(updated)
})

// Reject (set isApproved to false and optionally store reason)
router.post('/:id/reject', async (req: any, res: any) => {
  const id = Number(req.params.id)
  const { reason } = req.body
  // For simplicity we just mark as not approved. You can extend schema to store reason.
  const updated = await prisma.internship.update({ where: { id }, data: { isApproved: false } })
  res.json({ ...updated, rejectionReason: reason })
})

export default router
