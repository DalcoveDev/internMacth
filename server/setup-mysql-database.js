#!/usr/bin/env node

// Script to help set up MySQL database and user for InternMatch
// This script provides guidance for manual MySQL setup

console.log(`
========================================
MySQL Database Setup Helper
========================================

This script will guide you through setting up MySQL for InternMatch.

1. Make sure MySQL Server is installed and running
2. Open MySQL Command Line Client or MySQL Workbench
3. Log in as root user
4. Run the following SQL commands:

-- Create the database
CREATE DATABASE IF NOT EXISTS internmatch;

-- Create a dedicated user for the application
CREATE USER IF NOT EXISTS 'internuser'@'localhost' IDENTIFIED BY 'internpass';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON internmatch.* TO 'internuser'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Verify the database exists
SHOW DATABASES LIKE 'internmatch';

========================================
Next Steps:
1. Update server/.env with your database credentials:
   DATABASE_URL=mysql://internuser:internpass@localhost:3306/internmatch
2. Run database migrations:
   npx prisma migrate dev --name init
3. Start the server:
   npm run dev
========================================
`);

// Exit with success
process.exit(0);