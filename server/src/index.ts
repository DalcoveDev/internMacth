import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import internshipsRouter from './routes/internships'
import usersRouter from './routes/users'
import applicationsRouter from './routes/applications'
import authRouter from './routes/auth'
import dotenv from 'dotenv'
import { authMiddleware } from './authMiddleware'

dotenv.config()

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/internships', internshipsRouter)
app.use('/api/users', usersRouter)
app.use('/api/applications', applicationsRouter)

const port = process.env.PORT ?? 4000
app.listen(port, () => {
	console.log(`Server listening on ${port} - SQLite Database Ready`)
})

process.on('SIGINT', async () => {
	await prisma.$disconnect()
	process.exit()
})
