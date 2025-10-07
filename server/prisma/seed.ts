import { PrismaClient } from '@prisma/client'
// Use require for bcrypt to avoid TypeScript module-declaration issues in the seed script
const bcrypt: any = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  await prisma.application.deleteMany()
  await prisma.internship.deleteMany()
  await prisma.user.deleteMany()

  const pw = await bcrypt.hash('password123', 10)
  const alice = await prisma.user.create({ data: { name: 'Alice', email: 'alice@example.com', password: pw, role: 'student' } })
  const acme = await prisma.user.create({ data: { name: 'Acme Corp', email: 'hr@acme.com', password: pw, role: 'company' } })
  const admin = await prisma.user.create({ data: { name: 'Admin', email: 'admin@internmatch.com', password: pw, role: 'admin' } })

  const internship1 = await prisma.internship.create({ data: { title: 'Frontend Intern', company: 'Acme Corp', location: 'Remote', description: 'Build UI', skills: 'React,TypeScript', postedById: acme.id, isApproved: false } })
  const internship2 = await prisma.internship.create({ data: { title: 'Data Analyst Intern', company: 'Acme Corp', location: 'NY', description: 'Analyze data', skills: 'SQL,Python', postedById: acme.id, isApproved: true } })

  await prisma.application.create({ data: { internshipId: internship1.id, studentName: 'Alice', studentEmail: 'alice@example.com', coverLetter: 'I am excited', skills: 'React' } })

  console.log('Seed complete')
}

main().catch(e => {
  console.error(e)
  process.exit(1)
}).finally(() => prisma.$disconnect())
