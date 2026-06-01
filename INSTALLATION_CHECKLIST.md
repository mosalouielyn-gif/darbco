# Installation Checklist

Use this checklist to ensure proper setup of the DARBCO system on your laptop.

## Pre-Installation

- [ ] **Node.js 18+** installed
  ```bash
  node --version  # Should show v18.x.x or higher
  ```

- [ ] **npm 9+** installed (comes with Node.js)
  ```bash
  npm --version  # Should show 9.x.x or higher
  ```

- [ ] **MySQL 8.0+** installed and running
  ```bash
  mysql --version  # Should show 8.0.x or higher
  ```

- [ ] MySQL root password known

## Step 1: Clone/Download Project

- [ ] Project files downloaded to your laptop
- [ ] Terminal/Command Prompt opened in project directory
  ```bash
  cd /path/to/darbco-project
  ```

## Step 2: Install Dependencies

- [ ] Run installation command
  ```bash
  npm run install:all
  ```

- [ ] Verify no errors during installation
- [ ] Check that `node_modules/` folders exist:
  - [ ] `node_modules/` in root
  - [ ] `server/node_modules/` in server folder

## Step 3: Database Setup

- [ ] Start MySQL service
  ```bash
  # Windows: Check Services
  # Mac: mysql.server start
  # Linux: sudo systemctl start mysql
  ```

- [ ] Create database
  ```bash
  mysql -u root -p -e "CREATE DATABASE darbco;"
  ```

- [ ] Import schema
  ```bash
  mysql -u root -p darbco < database/darbco.sql
  ```

- [ ] Verify database exists
  ```bash
  mysql -u root -p -e "SHOW DATABASES LIKE 'darbco';"
  ```

- [ ] Verify tables were created
  ```bash
  mysql -u root -p -e "USE darbco; SHOW TABLES;"
  ```
  Should show 14 tables (users, roles, beneficiaries, etc.)

## Step 4: Configure Environment

- [ ] Copy `server/.env.example` to `server/.env`
  ```bash
  cp server/.env.example server/.env
  ```

- [ ] Edit `server/.env` with your settings:
  - [ ] `DB_PASS` = your MySQL root password
  - [ ] `DB_HOST` = 127.0.0.1 (or localhost)
  - [ ] `DB_PORT` = 3306
  - [ ] `DB_NAME` = darbco
  - [ ] `DB_USER` = root
  - [ ] `PORT` = 3001

- [ ] Copy `.env.example` to `.env` (frontend)
  ```bash
  cp .env.example .env
  ```

- [ ] Verify `.env` has correct API URL:
  - [ ] `VITE_API_URL=http://localhost:3001/api`

## Step 5: Start the Application

- [ ] Run development server
  ```bash
  npm run dev
  ```

- [ ] Verify both servers started:
  - [ ] Frontend running on http://localhost:5173
  - [ ] Backend running on http://localhost:3001

- [ ] Open browser to http://localhost:5173

## Step 6: Test Login

- [ ] Login page loads without errors
- [ ] Try logging in with test account:
  - Email: `admin@darbco.local`
  - Password: `password`

- [ ] Login succeeds and dashboard loads
- [ ] No console errors in browser DevTools (F12)

## Post-Installation Verification

- [ ] Test each user role:
  - [ ] Manager/Admin: `admin@darbco.local` / `password`
  - [ ] Production Clerk: `production@darbco.local` / `password`
  - [ ] Inventory Bookkeeper: `inventory@darbco.local` / `password`
  - [ ] Payroll Personnel: `payroll@darbco.local` / `password`
  - [ ] Finance Officer: `finance@darbco.local` / `password`

- [ ] Check database connection in terminal output
  - Should see: `✓ DARBCO Server running on http://localhost:3001`
  - Should see: `✓ Database: darbco`

## Common Issues Checklist

### Can't install dependencies

- [ ] Check Node.js version is 18+
- [ ] Run `npm cache clean --force`
- [ ] Delete `node_modules` and try again

### Database connection fails

- [ ] MySQL service is running
- [ ] Password in `server/.env` is correct
- [ ] Database `darbco` exists
- [ ] User `root` has access to database

### Frontend can't reach backend

- [ ] Backend is running (check terminal)
- [ ] Backend is on port 3001
- [ ] `.env` has `VITE_API_URL=http://localhost:3001/api`
- [ ] No CORS errors in browser console

### Port already in use

- [ ] Change `PORT` in `server/.env` to different port (e.g., 3002)
- [ ] Update `VITE_API_URL` in `.env` to match

## Development Workflow

Once installed, your daily workflow:

1. **Start MySQL** (if not auto-starting)
   ```bash
   # Windows: Services → MySQL → Start
   # Mac: mysql.server start
   # Linux: sudo systemctl start mysql
   ```

2. **Start development servers**
   ```bash
   npm run dev
   ```

3. **Open browser** to http://localhost:5173

4. **Stop servers** when done (Ctrl+C in terminal)

## Need Help?

If you encounter issues:

1. Check [NPM_SETUP.md](NPM_SETUP.md) for npm-specific help
2. Check [QUICKSTART.md](QUICKSTART.md) for troubleshooting
3. Check [README.md](README.md) for full documentation
4. Review terminal output for error messages

---

**Installation complete!** ✅

You should now have a fully functional DARBCO system running locally.
