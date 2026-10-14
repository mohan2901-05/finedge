# FinEdge Local MySQL Setup Instructions

## 1. Quick Start: Zero-Setup Mode (Default)
By default, FinEdge uses an in-memory MySQL-compatible database mode initialized via Flyway. You do not need to install or configure any database to run tests or start developing immediately.

To launch in default mode:
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

## 2. Using Local MySQL 8.0 Server

To connect FinEdge to your running MySQL 8.0 server (`MySQL80` service on port 3306):

### Step A: Create Database & User
Open MySQL command line:
```sql
CREATE DATABASE IF NOT EXISTS finedgedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Optional: Create dedicated application user
CREATE USER IF NOT EXISTS 'finedge_user'@'localhost' IDENTIFIED BY 'StrongPassword123!';
GRANT ALL PRIVILEGES ON finedgedb.* TO 'finedge_user'@'localhost';
FLUSH PRIVILEGES;
```

### Step B: Configure Environment Variables
Set the following environment variables (or supply them in `application-local.yml`):
```powershell
$env:DB_HOST="localhost"
$env:DB_PORT="3306"
$env:DB_NAME="finedgedb"
$env:DB_USERNAME="finedge_user"
$env:DB_PASSWORD="StrongPassword123!"
```

### Step C: Run with Local Profile
```powershell
cd d:\projects\finedge\backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```
Flyway will automatically run `V1__initial_schema.sql` and `V2__seed_demo_data.sql` to initialize all tables and load realistic demonstration records.
