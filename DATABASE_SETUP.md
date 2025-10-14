# 🗄️ Database Setup Guide for InternMatch

## Current Status: ❌ Database Not Connected

The backend is ready, but **MySQL database is not installed** on your system. Here are your options:

## 🚀 Option 1: Install MySQL Locally (Recommended)

### Windows Installation

**Method 1: MySQL Installer (Easiest)**
1. Download MySQL Installer from: https://dev.mysql.com/downloads/installer/
2. Choose "MySQL Installer for Windows"
3. Run the installer and select "Developer Default"
4. Set root password during installation
5. Complete the installation

**Method 2: XAMPP (Includes MySQL + phpMyAdmin)**
1. Download XAMPP from: https://www.apachefriends.org/download.html
2. Install XAMPP
3. Start MySQL service from XAMPP Control Panel
4. Access phpMyAdmin at: http://localhost/phpmyadmin

**Method 3: Docker (If you have Docker installed)**
```bash
docker run --name mysql-internmatch -e MYSQL_ROOT_PASSWORD=yourpassword -e MYSQL_DATABASE=internmatch -p 3306:3306 -d mysql:8.0
```

### After MySQL Installation

1. **Create Database:**
```sql
CREATE DATABASE internmatch;
```

2. **Create User (Optional but recommended):**
```sql
CREATE USER 'internmatch_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON internmatch.* TO 'internmatch_user'@'localhost';
FLUSH PRIVILEGES;
```

3. **Update Environment Variables:**
```bash
# In server/.env file
DB_HOST=localhost
DB_PORT=3306
DB_NAME=internmatch
DB_USER=root  # or internmatch_user
DB_PASSWORD=your_password
```

## 🌐 Option 2: Use Cloud Database (No Local Installation)

### Free Cloud Options

**1. PlanetScale (Free Tier)**
- Sign up at: https://planetscale.com/
- Create a new database
- Get connection string
- Update `.env` with cloud credentials

**2. Railway (Free Tier)**
- Sign up at: https://railway.app/
- Create MySQL service
- Get connection details
- Update `.env` with cloud credentials

**3. Supabase (Free Tier)**
- Sign up at: https://supabase.com/
- Create new project
- Get database connection details
- Update `.env` with cloud credentials

## 🧪 Test Database Connection

After setting up MySQL, test the connection:

```bash
cd server
node test-db-connection.js
```

This will:
- ✅ Test MySQL server connection
- ✅ Check if database exists
- ✅ Verify credentials
- ✅ Show detailed error messages if issues occur

## 🔧 Quick Setup Commands

### If using local MySQL:
```bash
# 1. Install MySQL (choose one method above)

# 2. Create database
mysql -u root -p
CREATE DATABASE internmatch;
exit

# 3. Update server/.env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=internmatch
DB_USER=root
DB_PASSWORD=your_mysql_password

# 4. Test connection
cd server
node test-db-connection.js

# 5. Start backend (will auto-create tables)
npm run dev
```

### If using cloud database:
```bash
# 1. Sign up for cloud service (PlanetScale/Railway/Supabase)

# 2. Get connection details from cloud provider

# 3. Update server/.env with cloud credentials
DB_HOST=your-cloud-host
DB_PORT=3306
DB_NAME=internmatch
DB_USER=your-cloud-user
DB_PASSWORD=your-cloud-password

# 4. Test connection
cd server
node test-db-connection.js

# 5. Start backend
npm run dev
```

## 📊 What Happens When Database is Connected

Once connected, the backend will automatically:

1. **Create Tables:** All required tables (users, companies, students, internships, applications, etc.)
2. **Insert Default Data:** Admin user and skill categories
3. **Enable Full Functionality:**
   - User registration and login
   - Internship posting and management
   - Application system
   - Real-time notifications
   - Admin dashboard

## 🔍 Troubleshooting

### Common Issues:

**"ECONNREFUSED" Error:**
- MySQL server is not running
- Wrong host/port configuration

**"ER_ACCESS_DENIED_ERROR":**
- Wrong username/password
- User doesn't have permissions

**"ER_BAD_DB_ERROR":**
- Database doesn't exist
- Wrong database name

### Test Commands:
```bash
# Check if MySQL is running
netstat -an | findstr :3306

# Test MySQL connection
mysql -u root -p -h localhost

# Check databases
mysql -u root -p -e "SHOW DATABASES;"
```

## 🎯 Next Steps

1. **Choose your preferred option** (local MySQL or cloud)
2. **Follow the setup steps** above
3. **Test the connection** using the test script
4. **Start the backend** - it will auto-create all tables
5. **Start the frontend** and begin using the application

## 💡 Recommendation

For development, I recommend **XAMPP** as it's the easiest to set up and includes phpMyAdmin for database management.

---

**Current Status:** Database not connected - follow the steps above to get started! 🚀

