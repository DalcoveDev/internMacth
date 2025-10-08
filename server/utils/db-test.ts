import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

export async function closeDatabaseConnection(): Promise<void> {
  await prisma.$disconnect();
}

// Test the connection if this file is run directly
if (require.main === module) {
  testDatabaseConnection()
    .then(async () => {
      await closeDatabaseConnection();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error('Test failed:', error);
      await closeDatabaseConnection();
      process.exit(1);
    });
}