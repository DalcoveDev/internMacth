# 🚀 InternMatch - Complete Setup Guide

## Overview
InternMatch is a full-stack internship matching platform with React frontend and Node.js/MySQL backend.

## 🏗️ Architecture
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + MySQL
- **Authentication**: JWT-based with role-based access control
- **Database**: MySQL with comprehensive schema

## 📋 Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone and Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd internmatch

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Database Setup
```sql
-- Create MySQL database
CREATE DATABASE internmatch;
CREATE USER 'internmatch_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON internmatch.* TO 'internmatch_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Environment Configuration

#### Backend (.env in server directory)
```bash
cd server
cp env.example .env
```

Update `server/.env`:
```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=internmatch
DB_USER=internmatch_user
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env in root directory)
```bash
cp env.example .env
```

Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=InternMatch
VITE_ENABLE_DEBUG=true
```

### 4. Start the Application

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend
```bash
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/health

## 🔧 Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start            # Start production server
```

## 📊 Database Schema

The backend automatically creates the following tables:

### Core Tables
- **users** - User accounts and basic info
- **companies** - Company-specific information
- **students** - Student-specific information
- **internships** - Internship postings
- **applications** - Job applications
- **notifications** - User notifications
- **messages** - Direct messages
- **skills** - Available skills
- **user_skills** - User skill associations

### Default Data
- Admin user: `admin@internmatch.com` (password: `admin123`)
- 30+ default skills across various categories

## 🔐 Authentication & Roles

### User Roles
- **Student**: Can apply for internships, view applications
- **Company**: Can post internships, manage applications
- **Admin**: Full system access, user management

### Authentication Flow
1. User registers/logs in
2. JWT token issued and stored
3. Token sent with each API request
4. Backend validates token and user permissions

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Internships
- `GET /api/internships` - Get all internships (with filters)
- `POST /api/internships` - Create internship (company only)
- `PUT /api/internships/:id` - Update internship (company only)
- `PATCH /api/internships/:id/approve` - Approve internship (admin only)

### Applications
- `GET /api/applications/student` - Get student applications
- `GET /api/applications/company` - Get company applications
- `POST /api/applications` - Apply for internship (student only)
- `PATCH /api/applications/:id/status` - Update application status

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `DELETE /api/notifications` - Clear all notifications

## 🛡️ Security Features

### Backend Security
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **Password Hashing**: bcrypt with configurable rounds
- **JWT Security**: Secure token-based authentication

### Frontend Security
- **Input Validation**: Client-side validation
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: SameSite cookies
- **Secure Storage**: Token stored securely

## 🧪 Testing

### Backend Testing (To be implemented)
```bash
cd server
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Frontend Testing (To be implemented)
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## 🚀 Deployment

### Backend Deployment
1. Build the application: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, AWS, DigitalOcean, etc.)
4. Set up MySQL database
5. Run database migrations

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update API URL in environment variables

## 🔧 Configuration Options

### Backend Configuration
- Database connection settings
- JWT secret and expiration
- Email service configuration
- File upload settings
- Rate limiting configuration

### Frontend Configuration
- API base URL
- Feature flags
- File upload limits
- Pagination defaults

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
- Verify MySQL is running
- Check database credentials
- Ensure database exists
- Check firewall settings

#### Authentication Issues
- Verify JWT secret is set
- Check token expiration
- Ensure CORS is configured correctly

#### API Connection Issues
- Verify backend is running on correct port
- Check CORS configuration
- Ensure API URL is correct in frontend

### Debug Mode
Enable debug mode by setting `VITE_ENABLE_DEBUG=true` in frontend `.env` file.

## 📚 Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT Documentation](https://jwt.io/introduction)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

## 🎯 Next Steps

1. **Set up your environment** following the steps above
2. **Create your first user account** using the registration form
3. **Post your first internship** (if you're a company)
4. **Apply for internships** (if you're a student)
5. **Explore the admin dashboard** (admin@internmatch.com)

Happy coding! 🚀

