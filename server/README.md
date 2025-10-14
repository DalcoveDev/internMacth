# InternMatch Backend API

A comprehensive backend API for the InternMatch application built with Node.js, Express, and MySQL.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Support for students, companies, and admins
- **Internship Management**: CRUD operations for internship postings
- **Application System**: Complete application workflow management
- **Notification System**: Real-time notifications for all user types
- **File Upload**: Support for resume and portfolio uploads
- **Email Integration**: Automated email notifications
- **Rate Limiting**: API protection against abuse
- **Security**: Helmet, CORS, and input validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: multer
- **Email**: nodemailer
- **Security**: helmet, cors, express-rate-limit
- **Language**: TypeScript

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd internmatch/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=internmatch
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   JWT_EXPIRES_IN=7d
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Set up MySQL database**
   ```sql
   CREATE DATABASE internmatch;
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/admin/stats` - Get dashboard statistics

### Internships
- `GET /api/internships` - Get all internships (with filters)
- `GET /api/internships/:id` - Get internship by ID
- `POST /api/internships` - Create internship (company only)
- `PUT /api/internships/:id` - Update internship (company only)
- `DELETE /api/internships/:id` - Delete internship (company only)
- `PATCH /api/internships/:id/approve` - Approve internship (admin only)
- `PATCH /api/internships/:id/reject` - Reject internship (admin only)
- `GET /api/internships/admin/pending` - Get pending internships (admin only)

### Applications
- `GET /api/applications/student` - Get student applications
- `GET /api/applications/company` - Get company applications
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications` - Apply for internship (student only)
- `PATCH /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id` - Delete application (student only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete notification
- `DELETE /api/notifications` - Clear all notifications
- `POST /api/notifications` - Create notification (admin only)
- `GET /api/notifications/stats` - Get notification statistics

## Database Schema

The API automatically creates the following tables:

- **users** - User accounts and basic info
- **companies** - Company-specific information
- **students** - Student-specific information
- **internships** - Internship postings
- **applications** - Job applications
- **notifications** - User notifications
- **messages** - Direct messages between users
- **skills** - Available skills
- **user_skills** - User skill associations

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (to be implemented)

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Comprehensive request validation
- **Password Hashing**: bcrypt with configurable rounds
- **JWT Security**: Secure token-based authentication

## Error Handling

The API includes comprehensive error handling with:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- File upload errors
- Custom error messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

