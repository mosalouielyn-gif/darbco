# 🚀 START HERE - DARBCO Setup for Your Laptop

Welcome! This guide will get you up and running quickly.

## What is DARBCO?

A complete agricultural management system for banana cooperatives with:
- Production tracking
- Inventory management  
- Payroll processing
- Finance workflows
- Role-based dashboards

## Technology Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL
- **Package Manager**: npm

## Prerequisites (Install These First)

1. **Node.js 18+** - [Download](https://nodejs.org/)
   - Includes npm automatically
   - Verify: `node --version` and `npm --version`

2. **Database (Choose One):**
   - **Option A: XAMPP** - [Download](https://www.apachefriends.org/) ⭐ **RECOMMENDED - Easier!**
     - Includes MySQL + phpMyAdmin (visual interface)
     - No command-line needed
   - **Option B: MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)
     - Standalone MySQL server
     - Uses command-line

## Quick Start (5 Steps)

### Step 1: Install Dependencies
```bash
npm run install:all
```

### Step 2: Create Database

**If using XAMPP (Recommended):**
1. Start XAMPP, run MySQL
2. Open http://localhost/phpmyadmin
3. Create database named `darbco`
4. Import `database/darbco.sql` using phpMyAdmin Import tab

**If using standalone MySQL:**
```bash
mysql -u root -p -e "CREATE DATABASE darbco;"
mysql -u root -p darbco < database/darbco.sql
```

### Step 3: Configure Backend

**If using XAMPP:**
Edit `server/.env`:
```env
DB_PASS=              (leave empty for XAMPP)
```

**If using standalone MySQL:**
Edit `server/.env` with your MySQL password:
```env
DB_PASS=your_mysql_password_here
```

### Step 4: Start the Application
```bash
npm run dev
```

### Step 5: Open Browser
Go to: http://localhost:5173

Login with:
- **Email**: admin@darbco.local
- **Password**: password

## 📚 Documentation

Choose based on your needs:

### Installation Guides (Pick One)
- **[STEP_BY_STEP_INSTALLATION.md](STEP_BY_STEP_INSTALLATION.md)** - 🌟 **Most detailed** - Complete walkthrough with screenshots descriptions (RECOMMENDED FOR BEGINNERS)
- **[QUICKSTART.md](QUICKSTART.md)** - Fast 5-step setup for experienced users
- **[INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md)** - Checklist format

### System Documentation
- **[README.md](README.md)** - Complete documentation
- **[NPM_SETUP.md](NPM_SETUP.md)** - Everything about npm
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - PHP to Node.js migration notes

### Reference
- **[NPM_CONVERSION.md](NPM_CONVERSION.md)** - npm configuration details
- **[DOCS_INDEX.md](DOCS_INDEX.md)** - All documentation index

## Common Commands

```bash
# Start both frontend and backend
npm run dev

# Install all dependencies
npm run install:all

# Build for production
npm run build
npm run build:server

# Clean and reinstall
npm run clean
npm run install:all
```

## Test Accounts

After database import, you can log in with:

| Email | Password | Role |
|-------|----------|------|
| admin@darbco.local | password | Manager/Admin |
| production@darbco.local | password | Production Clerk |
| inventory@darbco.local | password | Inventory Bookkeeper |
| payroll@darbco.local | password | Payroll Personnel |
| finance@darbco.local | password | Finance Officer |

## Project Structure

```
DARBCO/
├── src/                 # React frontend
├── server/              # Node.js backend  
├── database/            # MySQL schema
├── package.json         # Frontend deps
├── server/package.json  # Backend deps
└── *.md                # Documentation
```

## Ports Used

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## Need Help?

### Can't install dependencies?
```bash
npm cache clean --force
npm run install:all
```

### Database connection failed?
- Check MySQL is running
- Verify password in `server/.env`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Frontend can't reach backend?
- Check backend is running (you should see it in the terminal)
- Verify port 3001 is accessible

### Other issues?
See [QUICKSTART.md](QUICKSTART.md) troubleshooting section

## Important Notes

⚠️ **Use npm only** - Don't use pnpm or yarn  
⚠️ **Node 18+ required** - Earlier versions won't work  
⚠️ **MySQL must be running** - Start it before `npm run dev`

## What's Next?

1. ✅ Follow the Quick Start above
2. ✅ Log in with a test account
3. ✅ Explore each role's dashboard
4. ✅ Read the full documentation as needed

## Need More Help?

**Choose based on your database preference:**

**Using XAMPP + phpMyAdmin (EASIEST):**
→ Read **[XAMPP_INSTALLATION.md](XAMPP_INSTALLATION.md)** - Visual interface, no command-line needed ⭐

**Using standalone MySQL:**
→ Read **[STEP_BY_STEP_INSTALLATION.md](STEP_BY_STEP_INSTALLATION.md)** - Command-line approach

**Experienced users:**
→ Use the Quick Start above or **[QUICKSTART.md](QUICKSTART.md)**

---

**Ready to begin?** 

- **Easiest**: Start with [XAMPP_INSTALLATION.md](XAMPP_INSTALLATION.md) ⭐
- **Detailed**: Start with [STEP_BY_STEP_INSTALLATION.md](STEP_BY_STEP_INSTALLATION.md) 🎯
- **Quick**: Use the Quick Start section above
