# MySQL Setup Guide for InternMatch

This guide will help you set up MySQL for the InternMatch application using Docker.

## Prerequisites

1. Windows 10/11 Pro, Enterprise, or Education (Docker Desktop requirement)
2. At least 4GB of RAM
3. Administrator privileges

## Step 1: Install Docker Desktop

1. Visit [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Download Docker Desktop for Windows
3. Run the installer as Administrator
4. Follow the installation wizard
5. Restart your computer when prompted

## Step 2: Start Docker Desktop

1. Search for "Docker Desktop" in the Start menu
2. Launch Docker Desktop
3. Wait for Docker to start (it may take a minute or two)
4. You should see the Docker icon in your system tray

## Step 3: Start MySQL Container

Open PowerShell as Administrator and run:

```powershell
cd d:\internmacth
docker-compose up -d
```

This will start the MySQL container in the background.

## Step 4: Verify MySQL is Running

```powershell
docker-compose ps
```

You should see output similar to:
```
NAME                COMMAND                  SERVICE             STATUS              PORTS
internmacth-db-1    "docker-entrypoint.s…"   db                  running             0.0.0.0:3306->3306/tcp, :::3306->3306/tcp
```

## Step 5: Update Server Configuration

The server is already configured to use MySQL. Your [.env](file:///d:/internmacth/server/.env) file should have:
```
DATABASE_URL=mysql://user:password@localhost:3306/internmatch
```

## Step 6: Install Dependencies and Generate Prisma Client

```powershell
cd server
npm install
npx prisma generate
```

## Step 7: Run Database Migrations

```powershell
npx prisma migrate dev --name init
```

This will create the database schema in MySQL.

## Step 8: Start the Server

```powershell
npm run dev
```

## Testing the Connection

You can test the database connection by visiting:
[http://localhost:4001/api/health](http://localhost:4001/api/health)

You should see a response like:
```json
{
  "status": "OK",
  "timestamp": "2023-05-15T10:30:45.123Z",
  "uptime": 123.456,
  "database": "Connected"
}
```

## Troubleshooting

### Issue: Docker Desktop won't start
- Make sure virtualization is enabled in BIOS
- Check Windows Features: Enable "Hyper-V" and "Containers"
- Try restarting the Docker Desktop service

### Issue: Port 3306 is already in use
- Stop any existing MySQL service: `net stop mysql`
- Or change the port in docker-compose.yml

### Issue: Prisma migration fails
- Reset the database: `docker-compose down -v && docker-compose up -d`
- Wait 10 seconds for MySQL to start
- Run the migration again

### Issue: Connection refused
- Make sure Docker is running
- Check if the container is running: `docker-compose ps`
- Restart the containers: `docker-compose restart`

## Database Connection Details

- Host: localhost
- Port: 3306
- Database: internmatch
- Username: user
- Password: password
- Root Password: rootpassword

These settings are defined in the [docker-compose.yml](file:///d:/internmacth/docker-compose.yml) file.

## Useful Docker Commands

```powershell
# View running containers
docker-compose ps

# View logs
docker-compose logs db

# Stop containers
docker-compose down

# Start containers
docker-compose up -d

# Reset database (deletes all data)
docker-compose down -v
docker-compose up -d
```

## Switching Back to SQLite

If you want to switch back to SQLite:

1. Update [.env](file:///d:/internmacth/server/.env):
   ```
   DATABASE_URL=file:./dev.db
   ```

2. Update [prisma/schema.prisma](file:///d:/internmacth/server/prisma/schema.prisma):
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. Run migrations:
   ```powershell
   npx prisma migrate dev --name sqlite-setup
   ```