#!/usr/bin/env node

// Script to migrate data from SQLite to MySQL if needed
// This is a helper script for transitioning between databases

const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2/promise');

async function migrateData() {
  console.log('Starting data migration from SQLite to MySQL...');
  
  try {
    // Note: This would require setting up both database connections
    // For now, this is just a placeholder for the migration process
    console.log('Migration script ready. Run `npx prisma migrate dev --name init` to set up MySQL database.');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

// Run migration if script is called directly
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData };