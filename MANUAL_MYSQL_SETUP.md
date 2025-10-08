# Manual MySQL Setup Guide for InternMatch

This guide will help you set up MySQL manually for the InternMatch application without using Docker.

## Prerequisites

1. Windows 10/11
2. Administrator privileges

## Step 1: Install MySQL Server

1. Download MySQL Community Server from [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
2. Choose "Windows (x86, 64-bit), MSI Installer"
3. Download the installer (you may need to sign up for an Oracle account)
4. Run the installer as Administrator
5. Choose "Server only" setup type
6. Follow the installation wizard with default settings
7. During installation, set a root password (remember this password)
8. Complete the installation

## Step 2: Configure MySQL

1. Open MySQL Command Line Client (or MySQL Workbench)
2. Log in as root with the password you set during installation
3. Create the database and user for InternMatch:

```sql
-- Create the database
CREATE DATABASE internmatch;

-- Create a dedicated user for the application
CREATE USER 'internuser'@'localhost' IDENTIFIED BY 'internpass';

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON internmatch.* TO 'internuser'@'localhost';

-- Apply the changes
FLUSH PRIVILEGES;

-- Verify the database exists
SHOW DATABASES;
```

## Step 3: Update Configuration

Update the [server/.env](file:///d:/internmacth/server/.env) file with your MySQL credentials:

```
DATABASE_URL=mysql://internuser:internpass@localhost:3306/internmatch
```

Or if you want to use root:

```
DATABASE_URL=mysql://root:your_root_password@localhost:3306/internmatch
```

## Step 4: Run Database Migrations

Open PowerShell or Command Prompt and navigate to the server directory:

```cmd
cd d:\internmacth\server
npx prisma migrate dev --name init
```

## Step 5: Start the Backend Server

```cmd
npm run dev
```

## Troubleshooting

### Issue: Can't connect to MySQL
- Make sure MySQL service is running
- Check Windows Services and ensure "MySQL80" (or similar) is running
- Verify the port (default is 3306)
- Check firewall settings

### Issue: Access denied for user
- Verify username and password in the DATABASE_URL
- Make sure you've created the user and granted privileges

### Issue: Prisma migration fails
- Check that the database exists
- Verify the user has proper privileges
- Try resetting with:
  ```cmd
  DROP DATABASE internmatch;
  CREATE DATABASE internmatch;
  ```

## Useful MySQL Commands

```sql
-- Start MySQL service (run as Administrator)
net start mysql

-- Stop MySQL service (run as Administrator)
net stop mysql

-- Check MySQL status
mysqladmin -u root -p status

-- Connect to MySQL
mysql -u root -p

-- List databases
SHOW DATABASES;

-- Use the internmatch database
USE internmatch;

-- Show tables
SHOW TABLES;
```

## Connection Details

- Host: localhost
- Port: 3306
- Database: internmatch
- Username: internuser (or root)
- Password: internpass (or your root password)

## Switching Back to Docker

If you want to switch back to Docker later:

1. Update [.env](file:///d:/internmacth/server/.env):
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/internmatch
   ```

2. Start Docker containers:
   ```cmd
   cd d:\internmacth
   docker-compose up -d
   ```

3. Run migrations:
   ```cmd
   cd server
   npx prisma migrate dev --name docker-setup
   ```