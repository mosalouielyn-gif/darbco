# DARBCO Quick Start Guide

Get the DARBCO system running on your laptop in 5 steps.

## Prerequisites

- **Node.js 18+** ([Download here](https://nodejs.org/)) - includes npm
- **MySQL 8.0+** ([Download here](https://dev.mysql.com/downloads/mysql/))

> **Important**: This project uses **npm** (not yarn or pnpm). npm comes bundled with Node.js.

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm run install:all
```

This installs dependencies for both the frontend and backend.

## Step 2: Set Up MySQL Database

1. **Start MySQL** (if not already running)

2. **Create the database:**
   ```bash
   mysql -u root -p -e "CREATE DATABASE darbco;"
   ```

3. **Import the schema:**
   ```bash
   mysql -u root -p darbco < database/darbco.sql
   ```

## Step 3: Configure Backend Environment

Create `server/.env` file:

**Windows:**
```bash
copy server\.env.example server\.env
```

**Mac/Linux:**
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:

**If using XAMPP:**
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=darbco
DB_USER=root
DB_PASS=              ← Leave empty for XAMPP!
PORT=3001
NODE_ENV=development
```

**If using standalone MySQL:**
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=darbco
DB_USER=root
DB_PASS=your_mysql_password_here
PORT=3001
NODE_ENV=development
```

## Step 4: Start the Application

Run both frontend and backend together:

```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Step 5: Log In

Open your browser to http://localhost:5173 and log in with:

**Email**: `admin@darbco.local`  
**Password**: `password`

## Available Test Accounts

After importing the database, you can use these accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@darbco.local | password | Manager/Admin |
| production@darbco.local | password | Production Clerk |
| inventory@darbco.local | password | Inventory Bookkeeper |
| payroll@darbco.local | password | Payroll Personnel |
| finance@darbco.local | password | Finance Officer |

## Important Notes

**Package Manager**: This project uses **npm only**. Do not use pnpm or yarn.

```bash
# Correct ✅
npm run dev
npm install

# Incorrect ❌
pnpm run dev
yarn dev
```

## Troubleshooting

### npm not found?
- Install Node.js from https://nodejs.org/ (includes npm)
- Verify: `npm --version`

### Can't connect to MySQL?
- Verify MySQL is running: `mysql -u root -p`
- Check your password in `server/.env`

### Backend won't start?
- Check if port 3001 is already in use
- Change `PORT=3002` in `server/.env` if needed

### Frontend can't reach backend?
- Verify backend is running at http://localhost:3001
- Check `.env` file has `VITE_API_URL=http://localhost:3001/api`

### Database import failed?
- Make sure database exists: `SHOW DATABASES;` in MySQL
- Try creating it first: `CREATE DATABASE darbco;`
- Re-run: `mysql -u root -p darbco < database/darbco.sql`

### Dependency installation errors?
- Clear npm cache: `npm cache clean --force`
- Remove node_modules: `npm run clean`
- Reinstall: `npm run install:all`

## What's Next?

- Explore each role's dashboard
- Add beneficiaries through the appropriate administrative setup screen
- Create production records via Production Clerk
- Manage inventory via Inventory Bookkeeper
- Process payroll via Payroll Personnel
- Review finances via Finance Officer

---

**Need help?** Check the full [README.md](README.md) for detailed documentation.
