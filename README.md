# InternMatch - Internship Platform

This is an internship matching platform developed by **Ingabire Dalcove** to connect talented students with great companies for meaningful internship opportunities.

## Developer Information

- **Name**: Ingabire Dalcove
- **Email**: ingabiredalcove@gmail.com
- **Phone**: +250 794 289 360

## Project Overview

InternMatch is a comprehensive platform that helps students find internships and enables companies to post internship opportunities. The platform includes features for both students and companies, with dedicated dashboards for each user type.

## Key Features

### For Students
- Browse and search for internships
- Apply to internships with detailed application forms
- Track application status
- Access career resources and guidance
- Join community discussions

### For Companies
- Post internship opportunities
- Review and manage applications
- Access dashboard with analytics
- Communicate with potential interns

### For Administrators
- Manage users and internships
- Approve internship postings
- Monitor platform activity
- Send notifications to users

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MySQL (configured for XAMPP)
- **Authentication**: JWT-based authentication
- **Deployment**: Vite for frontend bundling

## Getting Started

1. Run `npm install` to install dependencies
2. Run `npm run dev` to start the development server

## Database Options

The application supports both SQLite (for easier local development) and MySQL (for production).

### Option 1: SQLite (Easiest Setup)

SQLite is already configured and ready to use. Simply:

1. Navigate to the server directory:
   ```powershell
   cd server
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the server:
   ```powershell
   npm run dev
   ```

### Option 2: MySQL with Docker (Recommended)

For MySQL setup with Docker, please follow the detailed instructions in [MYSQL_SETUP_GUIDE.md](MYSQL_SETUP_GUIDE.md).

### Option 3: Manual MySQL Installation

For manual MySQL setup without Docker, please follow the detailed instructions in [MANUAL_MYSQL_SETUP.md](MANUAL_MYSQL_SETUP.md).

### Option 4: XAMPP MySQL (Recommended for Windows)

If you're using XAMPP, follow the detailed instructions in [XAMPP_MYSQL_SETUP.md](XAMPP_MYSQL_SETUP.md).

## Environment Configuration

The application uses environment variables for configuration. See [server/.env.example](server/.env.example) for required variables.

## API Documentation

For detailed API documentation, see [server/README.md](server/README.md).

The server will run on port 4001 (configured in server/.env) and expose endpoints under `/api`.

## Deployment

For deployment instructions, please see:
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Complete deployment checklist
- [DEPLOYMENT_PREP.md](DEPLOYMENT_PREP.md) - Preparation guide for deployment
- [DEPLOYMENT_VERIFY.md](DEPLOYMENT_VERIFY.md) - Post-deployment verification guide

### Quick Deployment Steps

1. Update environment variables in both `.env` files for production
2. Build both frontend and backend applications
3. Deploy the built applications to your hosting environment
4. Verify all functionality with the deployment verification guide

### Production Considerations

- Ensure HTTPS is configured for security
- Set up proper database backups
- Configure monitoring and alerting
- Test failover and recovery procedures

## Contact

For support or inquiries, please contact:
- **Email**: ingabiredalcove@gmail.com
- **Phone**: +250 794 289 360

Developed with ❤️ by **Dalcove**