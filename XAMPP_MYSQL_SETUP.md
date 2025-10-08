# XAMPP MySQL Setup Guide for InternMatch

This guide will help you set up MySQL using XAMPP for the InternMatch application.

## Prerequisites

1. XAMPP installed and running
2. Apache and MySQL services started in XAMPP Control Panel

## Step 1: Start XAMPP Services

1. Open XAMPP Control Panel
2. Start the Apache service (optional, only needed for phpMyAdmin)
3. Start the MySQL service
4. Make sure both services show a green "Running" status

## Step 2: Access phpMyAdmin

1. Open your browser and go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
2. You should see the phpMyAdmin interface

## Step 3: Create Database

In phpMyAdmin:

1. Click on the "New" button in the left sidebar
2. Enter "internmatch" as the database name
3. Click "Create"

## Step 4: Verify Configuration

The application is already configured to work with XAMPP's default MySQL settings:
- Host: localhost
- Port: 3306
- Username: root
- Password: (empty by default in XAMPP)
- Database: internmatch

This is already set in [server/.env](file:///d:/internmacth/server/.env):
```
DATABASE_URL=mysql://root:@localhost:3306/internmatch
```

## Step 5: Run Database Migrations

Open Command Prompt or PowerShell and navigate to the server directory:

```cmd
cd d:\internmacth\server
npx prisma migrate dev --name init
```

## Step 6: Start the Backend Server

```cmd
npm run dev
```

## Troubleshooting

### Issue: Can't connect to MySQL
- Make sure MySQL service is running in XAMPP Control Panel
- Check that port 3306 is not blocked by firewall
- Verify that no other MySQL instance is running

### Issue: Access denied for user
- XAMPP uses 'root' user with no password by default
- If you've set a password, update the DATABASE_URL in [.env](file:///d:/internmacth/server/.env)

### Issue: Prisma migration fails
- Make sure the "internmatch" database exists in phpMyAdmin
- Check that MySQL service is running
- Try resetting with:
  ```cmd
  cd d:\internmacth\server
  npx prisma migrate reset
  ```

## Useful XAMPP Commands

```cmd
# Start MySQL service (if not using XAMPP Control Panel)
net start mysql

# Stop MySQL service
net stop mysql

# Check if MySQL is listening on port 3306
netstat -an | findstr :3306
```

## Connection Details

- Host: localhost
- Port: 3306
- Database: internmatch
- Username: root
- Password: (empty by default)

## phpMyAdmin Access

- URL: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
- Username: root
- Password: (empty by default)

## Switching to Different MySQL Setup

If you want to switch to a different MySQL setup later:

### To Docker:
1. Update [.env](file:///d:/internmacth/server/.env):
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/internmatch
   ```
2. Start Docker containers:
   ```cmd
   cd d:\internmacth
   docker-compose up -d
   ```

### To Manual MySQL Installation:
1. Install MySQL Server
2. Create database and user
3. Update [.env](file:///d:/internmacth/server/.env) with your credentials