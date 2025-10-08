# MySQL Setup Instructions

## Prerequisites
1. Docker Desktop for Windows installed and running

## Setup Steps

1. **Start MySQL Container**
   ```bash
   cd d:\internmacth
   docker-compose up -d
   ```

2. **Verify MySQL is Running**
   ```bash
   docker-compose ps
   ```
   You should see the `db` service running.

3. **Install Dependencies (if not already done)**
   ```bash
   cd server
   npm install
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Run Database Migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Start the Server**
   ```bash
   npm run dev
   ```

## Troubleshooting

If you encounter any issues:

1. **Check Docker is Running**: Make sure Docker Desktop is running
2. **Check Port Conflicts**: Ensure port 3306 is not being used by another MySQL instance
3. **Reset Database**: If you need to start fresh:
   ```bash
   docker-compose down -v
   docker-compose up -d
   npx prisma migrate dev --name init
   ```

## Connection Details

- Host: localhost
- Port: 3306
- Database: internmatch
- Username: user
- Password: password
- Root Password: rootpassword

These settings are defined in the docker-compose.yml file.