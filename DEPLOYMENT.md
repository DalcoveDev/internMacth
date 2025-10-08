# 🚀 InternMatch Production Deployment Guide

## ⚠️ Critical Security Checklist

Before deploying to production, ensure all security measures are implemented:

### ✅ Security Requirements
- [ ] Strong JWT secret (32+ characters)
- [ ] HTTPS enforced
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] Authentication middleware on all protected routes
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] Database migrated to PostgreSQL/MySQL
- [ ] Error handling without sensitive data exposure

## 🔧 Environment Setup

### 1. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install frontend dependencies
cd ../src
npm install
```

### 2. Environment Configuration
Copy the example environment file and configure:
```bash
cd server
cp env.example .env
```

Edit `.env` with your production values:
```env
NODE_ENV=production
PORT=4000
DATABASE_URL="postgresql://username:password@localhost:5432/internmatch_prod"
JWT_SECRET="your-super-secret-jwt-key-here-at-least-32-characters-long"
FRONTEND_URL="https://yourdomain.com"
CORS_ORIGIN="https://yourdomain.com"
```

### 3. Generate Strong JWT Secret
```bash
# Generate a secure JWT secret
openssl rand -base64 32
```

## 🗄️ Database Setup

### Option 1: PostgreSQL (Recommended)
```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb internmatch_prod

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://username:password@localhost:5432/internmatch_prod"
```

### Option 2: MySQL
```bash
# Install MySQL
sudo apt-get install mysql-server

# Create database
mysql -u root -p
CREATE DATABASE internmatch_prod;
```

### Run Database Migrations
```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

## 🏗️ Build and Deploy

### 1. Build Frontend
```bash
cd src
npm run build
```

### 2. Build Backend
```bash
cd server
npm run build
```

### 3. Start Production Server
```bash
cd server
npm start
```

## 🌐 Web Server Configuration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Frontend (Static Files)
    location / {
        root /path/to/your/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔄 Process Management

### Using PM2 (Recommended)
```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'internmatch-api',
    script: './server/dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 📊 Monitoring & Logging

### Health Check Endpoint
```bash
curl https://yourdomain.com/api/health
```

### Log Monitoring
```bash
# View PM2 logs
pm2 logs internmatch-api

# Monitor resources
pm2 monit
```

## 🔒 Security Hardening

### 1. Firewall Configuration
```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com
```

### 3. Database Security
```sql
-- Create dedicated database user
CREATE USER internmatch_user WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABASE internmatch_prod TO internmatch_user;
GRANT USAGE ON SCHEMA public TO internmatch_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO internmatch_user;
```

## 🔄 Backup Strategy

### Database Backup
```bash
# Daily backup script
#!/bin/bash
pg_dump internmatch_prod > backup_$(date +%Y%m%d).sql
# Keep only last 7 days
find . -name "backup_*.sql" -mtime +7 -delete
```

### Automated Backup with Cron
```bash
# Add to crontab
0 2 * * * /path/to/backup_script.sh
```

## 🚨 Troubleshooting

### Common Issues

1. **JWT Secret Error**
   ```
   Error: JWT_SECRET must be at least 32 characters long
   ```
   Solution: Generate a strong secret with `openssl rand -base64 32`

2. **Database Connection Error**
   ```
   Error: Database connection failed
   ```
   Solution: Check DATABASE_URL format and credentials

3. **CORS Error**
   ```
   Error: CORS policy blocked
   ```
   Solution: Verify FRONTEND_URL matches your domain

4. **Rate Limiting**
   ```
   Error: Too many requests
   ```
   Solution: Adjust rate limit settings in server configuration

### Performance Optimization

1. **Enable Database Indexes**
   ```sql
   CREATE INDEX idx_internships_created_at ON internships(created_at);
   CREATE INDEX idx_applications_status ON applications(status);
   ```

2. **Enable Caching**
   ```bash
   # Install Redis for caching
   sudo apt-get install redis-server
   ```

3. **Monitor Performance**
   ```bash
   # Install monitoring tools
   npm install -g clinic
   clinic doctor -- node dist/index.js
   ```

## 📋 Post-Deployment Checklist

- [ ] HTTPS redirect working
- [ ] All API endpoints responding
- [ ] Authentication working
- [ ] Database queries optimized
- [ ] Error monitoring configured
- [ ] Backup system tested
- [ ] Performance monitoring active
- [ ] Security headers present
- [ ] Rate limiting functional
- [ ] Log aggregation working

## 🆘 Emergency Procedures

### Rollback Plan
```bash
# Stop current version
pm2 stop internmatch-api

# Deploy previous version
git checkout previous-stable-tag
npm run build
pm2 start ecosystem.config.js
```

### Database Recovery
```bash
# Restore from backup
psql internmatch_prod < backup_20240101.sql
```

---

**⚠️ Remember**: Never use default secrets or development configurations in production!
