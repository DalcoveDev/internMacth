#!/bin/bash

# Quick Database Setup Script for InternMatch
echo "🚀 InternMatch Database Setup"
echo "=============================="

# Check if MySQL is installed
if command -v mysql &> /dev/null; then
    echo "✅ MySQL is installed"
else
    echo "❌ MySQL is not installed"
    echo ""
    echo "Please install MySQL first:"
    echo "1. Download XAMPP: https://www.apachefriends.org/download.html"
    echo "2. Or download MySQL: https://dev.mysql.com/downloads/installer/"
    echo "3. Or use Docker: docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0"
    exit 1
fi

# Check if MySQL is running
if netstat -an | grep -q :3306; then
    echo "✅ MySQL server is running"
else
    echo "❌ MySQL server is not running"
    echo "Please start MySQL service"
    exit 1
fi

# Get database credentials
echo ""
echo "📝 Database Configuration"
echo "-------------------------"
read -p "MySQL root password: " -s MYSQL_PASSWORD
echo ""

# Create database
echo "Creating database..."
mysql -u root -p$MYSQL_PASSWORD -e "CREATE DATABASE IF NOT EXISTS internmatch;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database 'internmatch' created successfully"
else
    echo "❌ Failed to create database"
    echo "Please check your MySQL credentials"
    exit 1
fi

# Create .env file
echo "Creating environment configuration..."
cat > .env << EOF
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=internmatch
DB_USER=root
DB_PASSWORD=$MYSQL_PASSWORD

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
EOF

echo "✅ Environment file created"

# Test connection
echo "Testing database connection..."
node test-db-connection.js

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Database setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. Start the backend: npm run dev"
    echo "2. Start the frontend: cd .. && npm run dev"
    echo "3. Open http://localhost:3000"
    echo ""
    echo "Default admin account:"
    echo "Email: admin@internmatch.com"
    echo "Password: admin123"
else
    echo "❌ Database connection test failed"
    echo "Please check your configuration"
fi

