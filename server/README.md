# InternMatch Backend API Documentation

Base URL: `/api`

Auth: JWT (HS256) with `Authorization: Bearer <token>` where applicable. Current routes do not strictly enforce auth middleware yet; add `authMiddleware` to protect routes when ready.

## Database Setup

The application supports both SQLite (for development) and MySQL (for production). By default, it uses SQLite.

To switch to MySQL:

### Option 1: Using Docker (Recommended)
1. Install Docker Desktop
2. Run `docker-compose up -d` from the project root
3. Update the DATABASE_URL in `.env` to use MySQL
4. Run `npx prisma migrate dev --name init`

### Option 2: Manual Installation
1. Install MySQL Server manually
2. Create the database and user as described in MANUAL_MYSQL_SETUP.md
3. Update the DATABASE_URL in `.env` with your MySQL credentials
4. Run `npx prisma migrate dev --name init`

### Option 3: XAMPP MySQL
1. Start MySQL service in XAMPP Control Panel
2. Create the "internmatch" database using phpMyAdmin
3. The DATABASE_URL in `.env` is already configured for XAMPP
4. Run `npx prisma migrate dev --name init`

## Auth

POST `/auth/signup`
- Body: `{ name?: string, email: string, password: string, role?: 'student'|'company'|'admin' }`
- Creates a user with hashed password and returns `{ user, token }`.

POST `/auth/login`
- Body: `{ email: string, password: string }`
- Verifies credentials and returns `{ user, token }`.

Notes:
- JWT secret: `process.env.JWT_SECRET` (defaults to `dev_secret`).
- Returned `user` never includes password.

## Users

POST `/users`
- Body: `{ email: string, password: string, name?: string, role?: string }`
- Creates a user record (password is NOT hashed in this route; for production use `/auth/signup`).
- Returns the created user.

GET `/users`
- Returns an array of users: `{ id, email, name, role }[]`.

## Internships

GET `/internships`
- Returns list of internships including `postedBy { id, name, email }`.
- Ordered by `createdAt desc`.

GET `/internships/:id`
- Returns one internship with `postedBy`.
- 404 if not found.

POST `/internships`
- Body: `{ title: string, company: string, location?: string, description?: string, skills?: string, postedById: number }`
- Creates an internship. Returns created record.

POST `/internships/:id/approve`
- Marks internship as approved (`isApproved = true`). Returns updated record.

POST `/internships/:id/reject`
- Body: `{ reason?: string }`
- Marks internship as not approved (`isApproved = false`). Returns updated record plus `{ rejectionReason }` echo for client display. Schema does not persist reason by default.

## Applications

GET `/applications`
- Returns list of applications including related `internship`.
- Ordered by `createdAt desc`.

GET `/applications/:id`
- Returns one application including related `internship`.
- 404 if not found.

POST `/applications`
- Body: `{ internshipId: number, studentName: string, studentEmail: string, coverLetter?: string, skills?: string }`
- Creates an application. Returns created record.

## Data Model (Prisma)

- `User { id, email(unique), password, name?, role, createdAt }`
- `Company { id, name, email?, website?, location?, description?, ownerUserId?, createdAt }`
- `Student { id, userId(unique), university?, major?, resumeUrl?, createdAt }`
- `Internship { id, title, company, location?, description?, skills?, postedById -> User, companyId?, isApproved, createdAt }`
- `Application { id, internshipId -> Internship, studentName, studentEmail, studentId?, coverLetter?, skills?, status, createdAt }`

Notes:
- `skills` fields are stored as comma-separated strings for simplicity.
- `Application.status` defaults to `pending` and is used in frontend UX.

## Environment

- `DATABASE_URL` (SQLite or MySQL)
- `JWT_SECRET`
- `PORT` (default 4000)

For MySQL setup, see SETUP_MYSQL.md for detailed instructions.

## Future Hardening

- Enforce auth/roles with `authMiddleware` on create/approve/reject endpoints.
- Hash passwords on `/users` route or deprecate it in favor of `/auth/signup` only.
- Persist rejection reasons in Prisma schema (add `rejectionReason` to `Internship`).
- Add pagination and input validation (e.g., Zod) to all endpoints.

